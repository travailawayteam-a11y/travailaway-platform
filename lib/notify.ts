// Asks the server to send an email about something that just happened.
// It never blocks the page and never shows an error: if the email cannot be
// sent, the action the person took (sending a message and so on) still works.

export type NotifyKind = "message" | "listing_decision" | "listing_submitted";

export function notify(kind: NotifyKind, id: string) {
  try {
    void fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, id }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Ignore: emails are a bonus, never a requirement.
  }
}
