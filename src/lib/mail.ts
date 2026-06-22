// Provider-aware "compose email" helper.
//
// A bare `mailto:` only does something when the visitor has a desktop mail
// client registered with the OS — which most webmail users do not. So instead
// we look at the address the visitor typed and send them to the matching
// webmail compose window (Gmail / Outlook / Yahoo), falling back to `mailto:`
// for providers without a public compose deep link (iCloud, Proton, corporate
// domains, …) so their own mail app still works.

export type MailProvider = "gmail" | "outlook" | "yahoo" | "other";

export interface MailParams {
  to: string | string[];
  subject: string;
  body: string;
}

export interface MailUrls {
  gmail: string;
  outlook: string;
  yahoo: string;
  mailto: string;
}

// Known consumer webmail domains → provider. Anything not listed (including
// Google Workspace / corporate custom domains, which can't be detected from the
// address alone) falls through to `mailto:`.
const PROVIDER_DOMAINS: Record<string, MailProvider> = {
  "gmail.com": "gmail",
  "googlemail.com": "gmail",
  "outlook.com": "outlook",
  "outlook.in": "outlook",
  "hotmail.com": "outlook",
  "hotmail.co.uk": "outlook",
  "live.com": "outlook",
  "live.co.uk": "outlook",
  "msn.com": "outlook",
  "yahoo.com": "yahoo",
  "yahoo.co.uk": "yahoo",
  "yahoo.in": "yahoo",
  "ymail.com": "yahoo",
  "rocketmail.com": "yahoo",
};

export function detectProvider(email: string): MailProvider {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return "other";
  return PROVIDER_DOMAINS[domain] ?? "other";
}

export function buildMailUrls({ to, subject, body }: MailParams): MailUrls {
  const toStr = Array.isArray(to) ? to.join(",") : to;
  const toEnc = encodeURIComponent(toStr);
  const su = encodeURIComponent(subject);
  const bd = encodeURIComponent(body);
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${toEnc}&su=${su}&body=${bd}`,
    // Personal Outlook/Hotmail/Live/MSN accounts compose endpoint.
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${toEnc}&subject=${su}&body=${bd}`,
    yahoo: `https://compose.mail.yahoo.com/?to=${toEnc}&subject=${su}&body=${bd}`,
    mailto: `mailto:${toStr}?subject=${su}&body=${bd}`,
  };
}

export interface ComposeChoice {
  provider: MailProvider;
  label: string; // e.g. "Gmail", "Outlook", "Yahoo Mail", "your email app"
  url: string;
  webmail: boolean; // true → open in a new tab; false → mailto (default mail app)
}

// Pick the best compose target for the address the visitor entered.
export function pickCompose(email: string, urls: MailUrls): ComposeChoice {
  switch (detectProvider(email)) {
    case "gmail":
      return { provider: "gmail", label: "Gmail", url: urls.gmail, webmail: true };
    case "outlook":
      return { provider: "outlook", label: "Outlook", url: urls.outlook, webmail: true };
    case "yahoo":
      return { provider: "yahoo", label: "Yahoo Mail", url: urls.yahoo, webmail: true };
    default:
      return { provider: "other", label: "your email app", url: urls.mailto, webmail: false };
  }
}

// Actually open a compose target. Webmail opens a new tab; `mailto:` is
// triggered via a transient anchor so it hands off to the OS mail app without
// navigating the SPA.
export function openCompose(choice: Pick<ComposeChoice, "url" | "webmail">) {
  if (choice.webmail) {
    window.open(choice.url, "_blank", "noopener,noreferrer");
    return;
  }
  const a = document.createElement("a");
  a.href = choice.url;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
