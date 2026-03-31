"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getActiveNavigationItem, isPublicExperience, uploadNavigationItem } from "@/lib/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  if (isPublicExperience(pathname)) {
    return <>{children}</>;
  }

  const activeItem = getActiveNavigationItem(pathname);

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggle={() => setCollapsed((value) => !value)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-transparent px-4 py-3 lg:hidden">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen((value) => !value)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-subtle"
                aria-label="Toggle navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <Link href="/dashboard" className="text-sm font-semibold uppercase tracking-authority text-primary-deep">
                  IndoLegal AI
                </Link>
                <p className="text-xs text-muted-foreground">{activeItem.label}</p>
              </div>
            </div>

            <Link
              href={uploadNavigationItem.href}
              className="rounded-full bg-card px-4 py-2 text-sm font-medium text-primary-deep shadow-subtle"
            >
              Upload
            </Link>
          </div>

          <Header />
          <main className="flex-1 px-4 pb-8 xl:px-8">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
