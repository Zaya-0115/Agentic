import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Selecto — AI Shopping Assistant",
  description:
    "Find and compare products across Cody, Zary.mn, Shoppy.mn, and ShoppyHub.mn with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
