"use client";

import type { Route } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeleteDocumentButtonProps = {
  documentId: string;
  documentTitle: string;
  redirectTo?: string;
  showLabel?: boolean;
  confirmMessage?: string;
} & Pick<ButtonProps, "size" | "variant" | "className">;

async function safeReadJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return {} as Record<string, unknown>;
  }

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { error: text } satisfies Record<string, unknown>;
  }
}

export function DeleteDocumentButton({
  documentId,
  documentTitle,
  redirectTo,
  showLabel = true,
  confirmMessage,
  variant = "ghost",
  size = "sm",
  className,
}: DeleteDocumentButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      confirmMessage || `Hapus dokumen \"${documentTitle}\"? Tindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });
      const payload = (await safeReadJson(response)) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || payload.success === false) {
        throw new Error(payload.error || "Gagal menghapus dokumen.");
      }

      if (redirectTo) {
        router.push(redirectTo as Route);
        return;
      }

      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus dokumen.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleDelete}
      disabled={isDeleting}
      className={cn(
        "text-danger-foreground hover:bg-danger-soft hover:text-danger-foreground",
        className
      )}
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {showLabel ? (isDeleting ? "Deleting..." : "Delete") : null}
    </Button>
  );
}
