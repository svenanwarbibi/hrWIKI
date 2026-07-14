import type { Metadata } from "next";
import { Nunito_Sans, Roboto_Slab } from "next/font/google";
import Link from "next/link";
import { Logotype } from "@/components/brand/Logotype";
import "./globals.css";

// Freie Substitute für die kommerziellen Webfonts museo_sans/museo_slab
// (siehe DESIGN.md §3 "Substitution notes"), bis lizenzierte Font-Dateien vorliegen.
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-nunito-sans",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
  title: "hirner & riehl · HRWIKI",
  description: "Internes Projekt-Portal: RAG-Chat und Projektkennzahlen je Bauvorhaben",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${nunitoSans.variable} ${robotoSlab.variable}`}>
      <body className="antialiased font-sans">
        <header className="border-b border-plan-black/10 px-6 py-4 sm:px-10">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/projects">
              <Logotype />
            </Link>
            <nav aria-label="Hauptnavigation">
              <Link href="/projects" className="text-sm font-medium nav-lowercase hover:text-ci">
                projekte
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
