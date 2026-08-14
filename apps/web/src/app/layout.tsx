import type { Metadata, Viewport } from "next";
import "@seed-design/css/base.css";
import "@dayjaview/design-tokens/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAY-JA-VIEW Product Prototype",
  description: "DAY-JA-VIEW fixture 기반 UX 프로토타입",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
