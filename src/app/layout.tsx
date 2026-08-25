import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edutainer",
  description: "A focused workspace for video lessons and discussion.",
};

type RootLayoutProps = {
  children: ReactNode;
};

/** Defines the document shell and global flex layout shared by every route. */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
