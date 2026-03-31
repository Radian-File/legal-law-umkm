import type { Route } from "next";
import {
  FileUp,
  FileText,
  Gavel,
  LayoutDashboard,
  Settings2,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: Route;
  icon: LucideIcon;
  matchMode?: "exact" | "prefix";
};

export const primaryNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard" as Route,
    icon: LayoutDashboard,
    matchMode: "exact",
  },
  {
    label: "Documents",
    href: "/documents" as Route,
    icon: FileText,
    matchMode: "prefix",
  },
  {
    label: "Regulatory",
    href: "/regulatory" as Route,
    icon: Gavel,
    matchMode: "prefix",
  },
  {
    label: "Settings",
    href: "/settings" as Route,
    icon: Settings2,
    matchMode: "prefix",
  },
];

export const uploadNavigationItem: NavigationItem = {
  label: "Upload Flow",
  href: "/documents/upload" as Route,
  icon: FileUp,
  matchMode: "prefix",
};

export function isNavigationItemActive(pathname: string, item: NavigationItem) {
  if (item.matchMode === "exact") {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getActiveNavigationItem(pathname: string) {
  return (
    [uploadNavigationItem, ...primaryNavigation].find((item) => isNavigationItemActive(pathname, item)) ??
    primaryNavigation[0]
  );
}

export function isPublicExperience(pathname: string) {
  return pathname === "/" || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
}

export function getRouteContext(pathname: string) {
  if (pathname.startsWith("/documents/upload")) {
    return {
      eyebrow: "Document Intake",
      title: "Unggah dan analisis dokumen baru",
      description:
        "Mulai alur upload untuk mem-parsing dokumen, menjalankan analisis AI, dan meneruskan hasil ke workspace kepatuhan.",
      searchPlaceholder: "Cari template upload atau tipe dokumen...",
      cta: uploadNavigationItem,
    };
  }

  if (pathname.startsWith("/documents")) {
    return {
      eyebrow: "Document Workspace",
      title: "Kelola dokumen dan hasil analisis",
      description:
        "Pantau arsip dokumen, status kepatuhan, dan jalankan upload baru tanpa keluar dari workspace utama.",
      searchPlaceholder: "Cari dokumen, pihak, atau status risiko...",
      cta: uploadNavigationItem,
    };
  }

  if (pathname.startsWith("/regulatory")) {
    return {
      eyebrow: "Regulatory Watch",
      title: "Pantau perubahan regulasi prioritas tinggi",
      description:
        "Ikuti pembaruan UU, PP, dan pedoman terbaru yang berdampak langsung pada dokumen serta proses internal Anda.",
      searchPlaceholder: "Cari UU, regulasi, atau topik kepatuhan...",
      cta: primaryNavigation[2],
    };
  }

  if (pathname.startsWith("/settings")) {
    return {
      eyebrow: "Workspace Settings",
      title: "Atur preferensi dan kontrol workspace",
      description:
        "Kelola konfigurasi tim, notifikasi, dan pengaturan sistem agar operasional legal tetap sinkron.",
      searchPlaceholder: "Cari pengaturan, peran, atau integrasi...",
      cta: primaryNavigation[3],
    };
  }

  return {
    eyebrow: "Compliance Center",
    title: "Selamat datang kembali, Budi.",
    description: "12 dokumen baru telah dianalisis sejak kunjungan terakhir Anda.",
    searchPlaceholder: "Cari dokumen atau UU...",
    cta: uploadNavigationItem,
  };
}
