/**
 * Administrative accounts. Keep this list in sync with the `isAdminEmail`
 * list in `firestore.rules`: the UI uses it to show the admin page, the rules
 * use it to authorize access-list writes.
 */
export const ADMIN_EMAILS: readonly string[] = [
  "guilhermefaaga@gmail.com",
  "soraya.farias@gmail.com",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Firestore document ids and auth tokens both use the lower-case form. */
export function normalizeEmail(raw: string | null | undefined): string {
  return (raw ?? "").trim().toLowerCase();
}

export function isEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  return normalized !== "" && ADMIN_EMAILS.includes(normalized);
}

export interface ParsedEmails {
  emails: string[];
  invalid: string[];
}

/**
 * Reads the admin's bulk input: commas, semicolons, spaces and new lines all
 * separate addresses. Invalid entries are reported instead of silently lost.
 */
export function parseEmails(raw: string): ParsedEmails {
  const emails = new Set<string>();
  const invalid = new Set<string>();

  for (const part of raw.split(/[\s,;]+/)) {
    const email = normalizeEmail(part);
    if (!email) continue;
    if (isEmail(email)) emails.add(email);
    else invalid.add(email);
  }

  return { emails: [...emails], invalid: [...invalid] };
}

export type AccessSnapshot = "granted" | "denied" | "unknown";

/**
 * What a Firestore access-document snapshot means. A missing document served
 * from cache proves nothing: it may simply not be cached on this phone yet.
 */
export function accessFromSnapshot(
  exists: boolean,
  fromCache: boolean
): AccessSnapshot {
  if (exists) return "granted";
  return fromCache ? "unknown" : "denied";
}
