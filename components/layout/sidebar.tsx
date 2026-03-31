"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import {
  isNavigationItemActive,
  primaryNavigation,
  uploadNavigationItem,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggle: () => void;
};

export function Sidebar({ collapsed, mobileOpen, onCloseMobile, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} aria-label="Close navigation" />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex min-h-screen flex-col bg-primary-deep px-4 py-6 text-white transition-all duration-300 lg:sticky lg:top-0 lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-[92px]" : "w-[280px]"
        )}
      >
      <button
        onClick={onToggle}
        className="absolute -right-4 top-8 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-deep shadow-ambient"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <Link href="/dashboard" onClick={onCloseMobile} className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
          <ScaleLogo />
        </div>
        {!collapsed && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">IndoLegal</p>
            <h1 className="text-lg font-semibold tracking-editorial">AI</h1>
          </div>
        )}
      </Link>

      <div className="space-y-3">
        <nav className="space-y-2">
          {primaryNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = isNavigationItemActive(pathname, item);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200",
                  isActive
                    ? "bg-secondary-teal text-slate-950 shadow-subtle"
                    : "text-white/72 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <Link
          href={uploadNavigationItem.href}
          onClick={onCloseMobile}
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/86 transition-all hover:bg-white/12 hover:text-white",
            isNavigationItemActive(pathname, uploadNavigationItem) && "border-secondary-teal/60 bg-white/12 text-white"
          )}
        >
          <uploadNavigationItem.icon className="h-5 w-5 shrink-0 text-secondary-teal" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-medium">{uploadNavigationItem.label}</p>
              <p className="truncate text-xs text-white/55">Masuk ke alur intake dokumen</p>
            </div>
          )}
        </Link>
      </div>

        <div className="mt-auto rounded-[1.75rem] bg-white/8 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-secondary-teal/20 p-2 text-secondary-calm">
              <Sparkles className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-authority text-white/55">AI Insight</p>
                <p className="text-sm leading-6 text-white/85">
                  14 klausul berisiko tinggi perlu ditinjau minggu ini.
                </p>
                <Link
                  href={primaryNavigation[2].href}
                  onClick={onCloseMobile}
                  className="inline-flex items-center gap-2 text-sm font-medium text-secondary-calm transition hover:text-white"
                >
                  <BarChart3 className="h-4 w-4" /> Lihat ringkasan
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function ScaleLogo() {
  return <span className="text-lg font-semibold">§</span>;
}
