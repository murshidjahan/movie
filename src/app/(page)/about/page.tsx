// /src/app/(pages)/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Your Site Name",
  description: "Learn more about us.",
};

export default function AboutPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">About</h1>
      <p className="mt-2 text-[color:var(--muted-foreground)]">
        This is the About page.
      </p>
    </>
  );
}
