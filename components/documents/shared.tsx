import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, FileText, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentRecord, StatusVariant } from "@/components/documents/mock-data";

const statusCopy: Record<StatusVariant, string> = {
  success: "Compliant",
  warning: "Review Required",
  danger: "High Risk",
  info: "In Verification",
};

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
      <div className="space-y-3">
        <p className="authority-label">{eyebrow}</p>
        <div>
          <h1 className="text-3xl font-semibold tracking-editorial text-foreground md:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3 xl:justify-end">{actions}</div> : null}
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="authority-label">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-editorial text-foreground">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  variant = "neutral",
}: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  variant?: StatusVariant | "neutral";
}) {
  return (
    <Card className="bg-card-elevated">
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="authority-label">{label}</p>
          <p className="mt-4 text-4xl font-semibold tracking-editorial text-foreground">{value}</p>
          <Badge variant={variant === "neutral" ? "neutral" : variant} className="mt-4 w-fit">
            {note}
          </Badge>
        </div>
        <div className="rounded-2xl bg-surface-low p-3 text-primary-deep">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ variant, children }: { variant: StatusVariant; children?: ReactNode }) {
  return <Badge variant={variant}>{children ?? statusCopy[variant]}</Badge>;
}

export function DocumentRow({ document }: { document: DocumentRecord }) {
  return (
    <tr className="align-top text-sm">
      <td className="px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-surface-low p-3 text-primary-deep">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <Link href={`/documents/${document.id}`} className="font-semibold text-foreground transition hover:text-secondary-teal">
              {document.title}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-authority text-muted-foreground">{document.type}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-muted-foreground">{document.category}</td>
      <td className="px-6 py-5 text-muted-foreground">{document.owner}</td>
      <td className="px-6 py-5">
        <div className="space-y-2">
          <StatusBadge variant={document.statusVariant}>{document.status}</StatusBadge>
          <p className="text-xs text-muted-foreground">Health score {document.healthScore}%</p>
        </div>
      </td>
      <td className="px-6 py-5 text-muted-foreground">{document.updatedAt}</td>
      <td className="px-6 py-5 text-right">
        <Link
          href={`/documents/${document.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-surface-low px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-high"
        >
          Open <ChevronRight className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}

export function EmptyStateCard() {
  return (
    <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(10,31,68,0.98),rgba(10,31,68,0.84))] text-white shadow-ambient">
      <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-authority text-white/70">
            Calm, structured, audit-ready
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-editorial md:text-4xl">My Documents, refined for everyday legal operations.</h2>
            <p className="mt-3 text-sm leading-7 text-white/75 md:text-base">
              Keep uploads, redlines, filing preparation, and compliance health in one measured workspace inspired by the Stitch source design.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/documents/upload" className={buttonVariants({ variant: "teal", size: "lg", className: "rounded-2xl px-6 font-semibold" })}>
            Upload document
          </Link>
          <Link href="/documents/doc-pdp-vendor-msa" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-2xl border-0 bg-white/10 px-6 text-white hover:bg-white/15 hover:text-white" })}>
            Open sample file <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function InsightCard({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <p className="authority-label">{eyebrow}</p>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
