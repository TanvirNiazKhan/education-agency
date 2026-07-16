"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center"
        style={{ background: "var(--c-bg)" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "var(--c-border)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  // Login page — no sidebar/header
  if (pathname === "/login" || !user) {
    return <>{children}</>;
  }

  // Authenticated pages — show sidebar + header
  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ background: "var(--c-bg)" }}
    >
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 h-full">
        <Header />
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--c-bg)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
