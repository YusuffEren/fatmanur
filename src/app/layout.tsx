import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Experience & advantages - David Whyte",
  description: "The opening watercolor experience that introduces David Whyte's online Companion Portal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
