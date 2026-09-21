import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudCompass — AWS decisions, made clear",
  description: "Compare and right-size AWS infrastructure with confidence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
