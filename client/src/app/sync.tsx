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
import { nanoid } from "nanoid";
import { toast } from "sonner";
import type { DocumentReference } from "firebase/firestore";
import { useApp } from "./store";
import { useAuth } from "./auth";
import { loadFirestore } from "./firebase";
import {
  CLOUD_SCHEMA_VERSION,
  cloudStateFor,
  hasRecord,
  planLink,
  readCloudState,
} from "./cloud";
import { createDefaultState } from "./persist";
import type { AppState } from "./state";

type FirestoreModule = typeof import("firebase/firestore");

export type SyncStatus = "off" | "linking" | "syncing" | "synced" | "error";

export interface CloudApi {
  /** False when there is no Firebase project configured: the app is local-only. */
  enabled: boolean;
  signedIn: boolean;
  status: SyncStatus;
  error: string | null;
  lastSyncedAt: Date | null;
  online: boolean;
  /** Pushes pending edits, or re-reads the cloud when this device is clean. */
  syncNow(): void;
}

const CloudContext = createContext<CloudApi | null>(null);

const WRITE_DEBOUNCE_MS = 700;
const CLEAR_DEBOUNCE_MS = 80;
const LINK_KEY = "ouse-cloud-link";
const stashKey = (uid: string) => `ouse-account-${uid}`;

interface LinkMeta {
  uid: string;
  syncedAt: string | null;
}

/**
 * "Apagar meus dados" while signed in, keyed by account so signing into
 * another account on this device cannot lose the request.
 */
const clearKey = (uid: string) => `ouse-clear-${uid}`;

function readClear(uid: string): boolean {
  try {
    return localStorage.getItem(clearKey(uid)) === "1";
  } catch {
    return false;
  }
}

function markClear(uid: string) {
  try {
    localStorage.setItem(clearKey(uid), "1");
  } catch {
    // Storage unavailable; the write still goes out this session.
  }
}

function forgetClear(uid: string) {
  try {
    localStorage.removeItem(clearKey(uid));
  } catch {
    // Storage unavailable; nothing to clean.
  }
}

function readLink(): LinkMeta | null {
  try {
    const raw = localStorage.getItem(LINK_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as {
      uid?: unknown;
      syncedAt?: unknown;
    } | null;
    if (!value || typeof value.uid !== "string" || value.uid === "") {
      return null;
    }
    return {
      uid: value.uid,
      syncedAt: typeof value.syncedAt === "string" ? value.syncedAt : null,
    };
  } catch {
    return null;
  }
}

function writeLink(meta: LinkMeta) {
  try {
    localStorage.setItem(LINK_KEY, JSON.stringify(meta));
  } catch {
    // Storage unavailable; the cloud copy is still authoritative.
  }
}

/**
 * Keeps the local record of the previous account before another account signs
 * in on this device, so signing back in restores it instead of depending on
 * whatever had reached Firestore.
 */
function stashState(uid: string, state: AppState) {
  try {
    localStorage.setItem(
      stashKey(uid),
      JSON.stringify({
        schemaVersion: CLOUD_SCHEMA_VERSION,
        state: cloudStateFor(state),
      })
    );
  } catch {
    // Nothing to recover from; the account's cloud copy is the fallback.
  }
}

function takeState(uid: string): AppState | null {
  try {
    const raw = localStorage.getItem(stashKey(uid));
    if (!raw) return null;
    return readCloudState(JSON.parse(raw));
  } catch {
    return null;
  }
}

function clearStash(uid: string) {
  try {
    localStorage.removeItem(stashKey(uid));
  } catch {
    // Storage unavailable; nothing to clean.
  }
}

interface Live {
  uid: string;
  fs: FirestoreModule;
  docRef: DocumentReference;
}

function syncErrorMessage(cause: unknown): string {
  const code = String((cause as { code?: unknown } | null)?.code ?? "");
  if (code.includes("permission-denied")) {
    return "A nuvem recusou o acesso. Suas mudanças continuam neste aparelho.";
  }
  if (code.includes("unavailable") || code.includes("network")) {
    return "Sem conexão com a nuvem.";
  }
  if (code.includes("resource-exhausted") || code.includes("quota")) {
    return "O limite diário da nuvem foi atingido. Tente mais tarde.";
  }
  if (code.includes("failed-precondition")) {
    return "A nuvem ainda não está pronta para este app.";
  }
  if (code.includes("not-found") || code.includes("invalid-argument")) {
    return "Não encontramos seu registro na nuvem.";
  }
  return "Não foi possível salvar na nuvem.";
}

export function CloudSyncProvider({ children }: { children: ReactNode }) {
  const { state, localRevision, replaceState } = useApp();
  const { user, configured } = useAuth();

  const [status, setStatus] = useState<SyncStatus>("off");
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [online, setOnline] = useState(
    () => typeof navigator === "undefined" || navigator.onLine
  );
  const [linkEpoch, setLinkEpoch] = useState(0);
  const [attempt, setAttempt] = useState(0);

  const stateRef = useRef(state);
  const revisionRef = useRef(localRevision);
  const liveRef = useRef<Live | null>(null);
  /** True while the first read/merge is running; local pushes wait for it. */
  const linkingRef = useRef(false);
  /** The first read succeeded, so pushing over the cloud copy is safe. */
  const linkReadyRef = useRef(false);
  /** Revisions written by this tab; their snapshots are echoes, not remote edits. */
  const ownRevisionsRef = useRef<string[]>([]);
  const pushedRevisionRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const writeChainRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    stateRef.current = state;
    revisionRef.current = localRevision;
  }, [state, localRevision]);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  /**
   * Sends one snapshot to Firestore. Serialised through `writeChainRef` so an
   * older debounced write can never land after a newer one.
   */
  const writeState = useCallback(
    async (
      live: Live,
      next: AppState,
      atRevision: number
    ): Promise<boolean> => {
      const revision = nanoid();
      ownRevisionsRef.current = [
        ...ownRevisionsRef.current.slice(-4),
        revision,
      ];
      const stillCurrent = () => liveRef.current === live;
      if (stillCurrent()) setStatus("syncing");
      try {
        await live.fs.setDoc(live.docRef, {
          schemaVersion: CLOUD_SCHEMA_VERSION,
          revision,
          state: cloudStateFor(next),
          savedAt: live.fs.serverTimestamp(),
        });
        if (!stillCurrent()) return true;
        if (atRevision > pushedRevisionRef.current) {
          pushedRevisionRef.current = atRevision;
        }
        writeLink({
          uid: live.uid,
          syncedAt: next.updatedAt ?? null,
        });
        forgetClear(live.uid);
        setLastSyncedAt(new Date());
        setError(null);
        setStatus("synced");
        return true;
      } catch (cause) {
        console.error("Falha ao salvar na nuvem", cause);
        if (stillCurrent()) {
          setError(syncErrorMessage(cause));
          setStatus("error");
        }
        return false;
      }
    },
    []
  );

  const enqueueWrite = useCallback(
    (live: Live, next: AppState, atRevision: number) => {
      // A failed write must not stop the next one.
      writeChainRef.current = writeChainRef.current
        .then(() => writeState(live, next, atRevision))
        .catch(() => false);
      return writeChainRef.current;
    },
    [writeState]
  );

  /** Pushes pending edits now, cancelling the debounce. */
  const flush = useCallback(() => {
    const live = liveRef.current;
    if (!live) return false;
    if (linkingRef.current || !linkReadyRef.current) return false;
    if (revisionRef.current <= pushedRevisionRef.current) return false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    void enqueueWrite(live, stateRef.current, revisionRef.current);
    return true;
  }, [enqueueWrite]);

  /**
   * "Sincronizar agora" must not overwrite a newer cloud copy with this
   * device's clean cache: pending edits push, otherwise it re-reads the cloud.
   */
  const syncNow = useCallback(() => {
    if (linkingRef.current) return;
    if (!flush()) setAttempt(value => value + 1);
  }, [flush]);

  // First link and live listener, one per account (and per retry).
  useEffect(() => {
    const uid = user?.uid;
    if (!uid) {
      liveRef.current = null;
      linkReadyRef.current = false;
      pushedRevisionRef.current = 0;
      ownRevisionsRef.current = [];
      setStatus("off");
      setError(null);
      setLastSyncedAt(null);
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    linkingRef.current = true;
    linkReadyRef.current = false;
    setStatus("linking");
    setError(null);

    (async () => {
      try {
        const services = await loadFirestore();
        if (cancelled) return;
        if (!services) {
          setStatus("off");
          return;
        }

        const fs = await import("firebase/firestore");
        if (cancelled) return;

        const meta = readLink();
        let base = stateRef.current;

        if (meta && meta.uid !== uid) {
          // Another account used this device: its record stays out of this one.
          if (hasRecord(base)) stashState(meta.uid, base);
          base = takeState(uid) ?? createDefaultState();
          replaceState(base);
          writeLink({ uid, syncedAt: null });
        }

        let baseRevision = revisionRef.current;
        // Keep the debounced effect quiet until the first read decides what wins.
        pushedRevisionRef.current = Math.max(
          pushedRevisionRef.current,
          baseRevision
        );

        const live: Live = {
          uid,
          fs,
          docRef: fs.doc(services.db, "users", uid),
        };
        liveRef.current = live;

        const linkedMeta = readLink();
        let cleanCache =
          linkedMeta?.uid === uid &&
          Boolean(base.updatedAt) &&
          linkedMeta.syncedAt === base.updatedAt;

        let snapshot: Awaited<ReturnType<typeof fs.getDoc>>;
        try {
          snapshot = await fs.getDoc(live.docRef);
        } catch (cause) {
          if (cancelled) return;
          setError(syncErrorMessage(cause));
          setStatus("error");
          return;
        }
        if (cancelled) return;

        // Something was written while the cloud was being read: merge the
        // current record, never the snapshot captured before those edits.
        if (revisionRef.current !== baseRevision) {
          base = stateRef.current;
          baseRevision = revisionRef.current;
          cleanCache = false;
          pushedRevisionRef.current = Math.max(
            pushedRevisionRef.current,
            baseRevision
          );
        }

        const raw = snapshot.exists()
          ? (snapshot.data() as Record<string, unknown>)
          : null;
        const remote = raw ? readCloudState(raw) : null;

        if (raw && !remote) {
          setError(
            "O registro na nuvem está num formato mais novo. Atualize o app."
          );
          setStatus("error");
          return;
        }

        const plan = planLink(base, remote, {
          cleanCache,
          clearPending: readClear(uid),
        });

        if (plan.kind === "idle") {
          writeLink({ uid, syncedAt: null });
          setStatus("synced");
        } else if (plan.kind === "adopt") {
          replaceState(plan.state);
          writeLink({
            uid,
            syncedAt: plan.state.updatedAt ?? null,
          });
          setLastSyncedAt(new Date());
          setStatus("synced");
        } else if (plan.kind === "push") {
          await enqueueWrite(live, plan.state, baseRevision);
        } else {
          replaceState(plan.state);
          const pushed = await enqueueWrite(live, plan.state, baseRevision);
          if (pushed && remote && hasRecord(remote)) {
            toast.success("Juntamos este aparelho com a sua conta.");
          }
        }

        if (cancelled) return;
        clearStash(uid);
        linkReadyRef.current = true;

        unsubscribe = fs.onSnapshot(
          live.docRef,
          { includeMetadataChanges: true },
          next => {
            const data = next.data();
            if (!data) return;

            if (next.metadata.hasPendingWrites) {
              setStatus("syncing");
              return;
            }

            if (
              typeof data.revision === "string" &&
              ownRevisionsRef.current.includes(data.revision)
            ) {
              setLastSyncedAt(new Date());
              setStatus("synced");
              return;
            }

            // Local edits that have not reached the cloud win over an older echo.
            if (revisionRef.current > pushedRevisionRef.current) {
              void enqueueWrite(live, stateRef.current, revisionRef.current);
              return;
            }

            const nextState = readCloudState(data);
            if (!nextState) return;

            replaceState(nextState);
            writeLink({
              uid,
              syncedAt: nextState.updatedAt ?? null,
            });
            setLastSyncedAt(new Date());
            setError(null);
            setStatus("synced");
          },
          cause => {
            setError(syncErrorMessage(cause));
            setStatus("error");
          }
        );

        if (cancelled) {
          unsubscribe();
          unsubscribe = null;
          return;
        }
      } finally {
        if (!cancelled) {
          linkingRef.current = false;
          setLinkEpoch(value => value + 1);
        }
      }
    })().catch(cause => {
      if (cancelled) return;
      setError(syncErrorMessage(cause));
      setStatus("error");
    });

    return () => {
      cancelled = true;
      linkingRef.current = false;
      unsubscribe?.();
    };
  }, [user?.uid, attempt, enqueueWrite, replaceState]);

  // Debounced push of local edits that happened after the link.
  useEffect(() => {
    if (!user) return;
    if (linkingRef.current || !linkReadyRef.current) return;
    if (!liveRef.current) return;
    if (localRevision <= pushedRevisionRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    // A reset is committed empty. Record the intent before the debounce so a
    // reload or sign-out cannot let the old cloud copy come back.
    const empty = !hasRecord(stateRef.current);
    if (empty && user) markClear(user.uid);

    const delay = empty ? CLEAR_DEBOUNCE_MS : WRITE_DEBOUNCE_MS;

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const live = liveRef.current;
      if (!live) return;
      void enqueueWrite(live, stateRef.current, revisionRef.current);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [localRevision, linkEpoch, user, enqueueWrite]);

  // Closing the tab mid-debounce should still leave the write queued.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    const handlePageHide = () => flush();
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [flush]);

  const value = useMemo<CloudApi>(
    () => ({
      enabled: configured,
      signedIn: Boolean(user),
      status,
      error,
      lastSyncedAt,
      online,
      syncNow,
    }),
    [configured, user, status, error, lastSyncedAt, online, syncNow]
  );

  return (
    <CloudContext.Provider value={value}>{children}</CloudContext.Provider>
  );
}

export function useCloud(): CloudApi {
  const context = useContext(CloudContext);
  if (!context) {
    throw new Error("useCloud must be used within CloudSyncProvider");
  }
  return context;
}
