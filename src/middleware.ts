import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth"];

// FIXME: Auth-Gate für den Workshop-Demo-Deploy deaktiviert — es gibt noch
// keine /login-Seite und kein Auth.js/Entra-ID-Setup, das Gate würde also nur
// zu einem 404 führen. Vor echtem Rollout mit sensiblen Projektdaten muss der
// Session-Check unten wieder aktiv sein.
const AUTH_GATE_DISABLED = true;

export function middleware(req: NextRequest) {
  if (AUTH_GATE_DISABLED) return NextResponse.next();

  const isPublic = PUBLIC_PATHS.some((p) => req.nextUrl.pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // TODO: durch echten Auth.js Session-Check ersetzen, sobald
  // AUTH_MICROSOFT_ENTRA_ID_* konfiguriert ist.
  const hasSession = req.cookies.has("authjs.session-token");
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Statische Public-Assets (Logo etc.) ausnehmen: next/image ruft sie beim
  // Optimieren serverseitig ohne Browser-Cookie ab — hinter der Middleware
  // würden sie sonst zu /login umgeleitet, statt Bilddaten zu liefern.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
