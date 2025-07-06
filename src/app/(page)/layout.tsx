import React, { PropsWithChildren } from "react";

export default function PagesLayout({ children }: PropsWithChildren) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 px-6 py-10">{children}</main>
      <footer className="px-6 py-4 border-t border-border text-sm text-muted-foreground">
        © {currentYear} Design by Murshid Jahan. All rights reserved.
      </footer>
    </div>
  );
}
