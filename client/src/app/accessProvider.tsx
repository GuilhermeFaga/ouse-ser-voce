import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth";
import { loadFirestore } from "./firebase";
import { accessFromSnapshot, isAdminEmail, normalizeEmail } from "./access";

export type AccessStatus = "checking" | "granted" | "denied" | "error";

export interface AccessApi {
  status: AccessStatus;
  email: string;
  isAdmin: boolean;
  error: string | null;
  /** Re-reads the access document after an offline/permission error. */
  retry(): void;
}

const AccessContext = createContext<AccessApi | null>(null);

const ERROR_OFFLINE = "Sem conexão para confirmar seu acesso.";
const ERROR_UNKNOWN = "Não foi possível confirmar seu acesso agora.";

function errorCodeOf(cause: unknown): string {
  const code = (cause as { code?: unknown } | null)?.code;
  return typeof code === "string" ? code : "";
}

export function AccessProvider({ children }: { children: ReactNode }) {
  const { user, configured } = useAuth();
  const email = normalizeEmail(user?.email);
  const admin = isAdminEmail(email);

  const [status, setStatus] = useState<AccessStatus>("checking");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const checkedEmailRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      checkedEmailRef.current = null;
      setStatus("checking");
      setError(null);
      return;
    }

    if (!email) {
      setStatus("error");
      setError("Não foi possível identificar o e-mail da sua conta Google.");
      return;
    }

    if (!configured) {
      setStatus("error");
      setError(ERROR_UNKNOWN);
      return;
    }

    if (admin) {
      setStatus("granted");
      setError(null);
      return;
    }

    // Retrying an already granted account keeps the app mounted while the
    // cloud is re-read; a new account starts from the neutral state.
    if (checkedEmailRef.current !== email) {
      setStatus("checking");
    }
    checkedEmailRef.current = email;
    setError(null);

    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    (async () => {
      const services = await loadFirestore();
      if (cancelled) return;
      if (!services) {
        setStatus(previous => (previous === "granted" ? previous : "error"));
        setError(ERROR_UNKNOWN);
        return;
      }

      const fs = await import("firebase/firestore");
      if (cancelled) return;

      unsubscribe = fs.onSnapshot(
        fs.doc(services.db, "access", email),
        snapshot => {
          if (cancelled) return;

          const next = accessFromSnapshot(
            snapshot.exists(),
            snapshot.metadata.fromCache
          );
          if (next === "granted") {
            setStatus("granted");
            setError(null);
            return;
          }
          if (next === "denied") {
            setStatus("denied");
            setError(null);
            return;
          }

          // A missing document from cache does not prove the e-mail is
          // unlisted. Keep an already granted session; otherwise ask for a
          // connection.
          setStatus(previous => (previous === "granted" ? previous : "error"));
          setError(ERROR_OFFLINE);
        },
        cause => {
          if (cancelled) return;
          if (errorCodeOf(cause).includes("permission-denied")) {
            setStatus("denied");
            setError(null);
            return;
          }
          setStatus(previous => (previous === "granted" ? previous : "error"));
          setError(ERROR_UNKNOWN);
        }
      );
    })().catch(cause => {
      if (cancelled) return;
      console.error("Falha ao confirmar o acesso", cause);
      setStatus(previous => (previous === "granted" ? previous : "error"));
      setError(ERROR_UNKNOWN);
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [user?.uid, email, admin, configured, attempt]);

  const retry = useCallback(() => {
    setError(null);
    setAttempt(value => value + 1);
  }, []);

  const value = useMemo<AccessApi>(
    () => ({
      status,
      email,
      isAdmin: admin,
      error,
      retry,
    }),
    [status, email, admin, error, retry]
  );

  return (
    <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
  );
}

export function useAccess(): AccessApi {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error("useAccess must be used within AccessProvider");
  }
  return context;
}
