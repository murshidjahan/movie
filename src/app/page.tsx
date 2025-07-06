"use client";

import React, { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen min-w-screen flex flex-col"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Center everything vertically and horizontally */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto animate-fadeInUp">
        <h1
          className="text-5xl font-extrabold mb-6"
          style={{ color: "var(--color-primary)" }}
        >
          Discover Your Next Favorite Movie
        </h1>
        <p
          className="mb-10 text-lg"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Stay updated with the latest movies and exclusive recommendations.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md flex gap-3"
            noValidate
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow rounded-md px-4 py-3"
              style={{
                backgroundColor: "var(--color-input)",
                color: "var(--color-foreground)",
                borderColor: "var(--color-border)",
                outlineColor: "var(--color-ring)",
              }}
            />
            <button
              type="submit"
              className="rounded-md px-6 py-3 font-semibold transition"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
              }}
            >
              Notify Me
            </button>
          </form>
        ) : (
          <p
            className="mt-6 font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            Thanks for subscribing!
          </p>
        )}
      </main>

      <footer
        className="py-6 text-center"
        style={{
          color: "var(--color-muted-foreground)",
          backgroundColor: "var(--color-background)",
        }}
      >
        &copy; {new Date().getFullYear()} Design by Murshid Jahan. All rights reserved.
      </footer>
    </div>
  );
}
