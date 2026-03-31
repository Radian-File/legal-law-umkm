"use client";

import Link from "next/link";
import type { Route } from "next";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import {
  getActiveNavigationItem,
  getRouteContext,
  isNavigationItemActive,
  primaryNavigation,
  uploadNavigationItem,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const routeContext = getRouteContext(pathname);
  const activeItem = getActiveNavigationItem(pathname);
  const { user } = useUser();
  const firstName = user?.firstName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "Pengguna";
  const resolvedTitle = pathname === "/dashboard" ? `Selamat datang kembali, ${firstName}.` : routeContext.title;

  return (
    <header className="sticky top-0 z-20 flex flex-col gap-4 bg-surface/90 px-4 py-4 backdrop-blur xl:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-authority text-primary-deep/75">
            <span>{routeContext.eyebrow}</span>
            <span className="hidden h-1 w-1 rounded-full bg-primary-deep/30 sm:inline-block" />
            <span className="text-muted-foreground">Workspace / {activeItem.label}</span>
          </div>

          <h2 className="mt-2 text-2xl font-semibold tracking-editorial text-foreground md:text-3xl">
            {resolvedTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            {routeContext.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <Link href={uploadNavigationItem.href} className={cn(buttonVariants({ variant: "teal", size: "lg" }), "rounded-2xl px-6 font-semibold")}>
            + Unggah Dokumen Baru
          </Link>

          <button className="hidden h-11 w-11 items-center justify-center rounded-full bg-card text-muted-foreground shadow-subtle transition hover:text-foreground md:flex">
            <Bell className="h-5 w-5" />
          </button>

          <SignedIn>
            <div className="flex items-center rounded-full bg-card px-2 py-2 shadow-subtle">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <Link
              href={"/sign-in" as Route}
              className={cn(buttonVariants({ variant: "teal", size: "lg" }), "rounded-2xl px-6 font-semibold")}
            >
              Login
            </Link>
          </SignedOut>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-11" placeholder={routeContext.searchPlaceholder} />
        </div>

        <nav className="flex flex-wrap items-center gap-2 lg:hidden">
          {primaryNavigation.map((item) => {
            const isActive = isNavigationItemActive(pathname, item);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  isActive ? "bg-primary-deep text-white shadow-subtle" : "bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
