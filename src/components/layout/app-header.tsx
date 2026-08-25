import type { PropsWithChildren } from "react";
import Link from "next/link";

/** Renders the sticky brand header and accepts page-specific actions as children. */
function AppHeader({ children }: PropsWithChildren) {
  return (
    <header className="sticky top-0 z-30 flex h-21 shrink-0 items-center justify-between border-b bg-background p-3">
      <Link
        href="/"
        aria-label="Edutainer home"
      >
        <span className="text-xl font-extrabold text-primary">Edutainer</span>
      </Link>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </header>
  );
}

export { AppHeader };
