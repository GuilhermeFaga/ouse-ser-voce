import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isFirebaseConfigured, loadFirebaseAuth } from "./firebase";

export interface AccountUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export type AuthStatus = "loading" | "ready" | "unavailable";

export interface AuthApi {
  user: AccountUser | null;
  status: AuthStatus;
  configured: boolean;
  signingIn: boolean;
  error: string | null;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthApi | null>(null);

const UNAVAILABLE =
  "O login ainda não está disponível neste app. Tente de novo mais tarde.";

function codeOf(error: unknown): string {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === "string" ? code : "";
}

/** Null when the person simply closed the Google window. */
function messageForAuthError(error: unknown): string | null {
  const code = codeOf(error);
  if (
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request" ||
    code === "auth/user-cancelled"
  ) {
    return null;
  }
  if (code === "auth/popup-blocked") {
    return "O navegador bloqueou a janela do Google. Permita pop-ups e tente de novo.";
  }
  if (code === "auth/unauthorized-domain") {
    return "O login com Google não está disponível neste endereço.";
  }
  if (code === "auth/operation-not-allowed") {
    return "O login com Google não está disponível agora.";
  }
  if (code === "auth/network-request-failed") {
    return "Sem conexão com o Google. Tente de novo quando tiver internet.";
  }
  if (code === "auth/user-disabled") {
    return "Esta conta foi desativada.";
  }
  if (code === "auth/too-many-requests") {
    return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  }
  if (code === "auth/account-exists-with-different-credential") {
    return "Já existe uma conta com este e-mail usando outro login.";
  }
  return "Não foi possível entrar. Tente de novo.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | null = null;

    (async () => {
      const services = await loadFirebaseAuth();
      if (!active) return;
      if (!services) {
        setStatus("unavailable");
        return;
      }

      const mod = await import("firebase/auth");
      if (!active) return;

      unsubscribe = mod.onAuthStateChanged(
        services.auth,
        next => {
          if (!active) return;
          setUser(
            next
              ? {
                  uid: next.uid,
                  displayName: next.displayName ?? "",
                  email: next.email ?? "",
                  photoURL: next.photoURL ?? "",
                }
              : null
          );
          setStatus("ready");
        },
        cause => {
          if (!active) return;
          setError(messageForAuthError(cause));
          setStatus("ready");
        }
      );

      if (!active) {
        unsubscribe();
        unsubscribe = null;
        return;
      }

      // Completes a sign-in that fell back to a full-page redirect.
      mod.getRedirectResult(services.auth).catch(cause => {
        if (active) setError(messageForAuthError(cause));
      });
    })().catch(cause => {
      if (!active) return;
      setError(messageForAuthError(cause));
      setStatus("unavailable");
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const signIn = useCallback(async () => {
    setError(null);
    setSigningIn(true);
    try {
      const services = await loadFirebaseAuth();
      if (!services) {
        setError(UNAVAILABLE);
        return;
      }

      const mod = await import("firebase/auth");
      const provider = new mod.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      try {
        await mod.signInWithPopup(services.auth, provider);
      } catch (cause) {
        // Safari and in-app browsers sometimes block the popup entirely.
        const code = codeOf(cause);
        if (
          code === "auth/popup-blocked" ||
          code === "auth/operation-not-supported-in-this-environment"
        ) {
          await mod.signInWithRedirect(services.auth, provider);
          return;
        }
        throw cause;
      }
    } catch (cause) {
      setError(messageForAuthError(cause));
    } finally {
      setSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    setSigningIn(true);
    try {
      const services = await loadFirebaseAuth();
      if (!services) return;
      const mod = await import("firebase/auth");
      await mod.signOut(services.auth);
    } catch {
      setError("Não foi possível sair agora. Tente de novo.");
    } finally {
      setSigningIn(false);
    }
  }, []);

  const value = useMemo<AuthApi>(
    () => ({
      user,
      status,
      configured: isFirebaseConfigured,
      signingIn,
      error,
      signIn,
      signOut,
    }),
    [user, status, signingIn, error, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthApi {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
