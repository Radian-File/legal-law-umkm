import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const documentId = params.id?.trim();

    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Document id is required.",
        },
        { status: 400 }
      );
    }

    const deletedDocument = await prisma.document.delete({
      where: { id: documentId },
      select: {
        id: true,
        title: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/documents");
    revalidatePath(`/documents/${documentId}`);

    return NextResponse.json({
      success: true,
      deletedDocumentId: deletedDocument.id,
      title: deletedDocument.title,
    });
  } catch (error) {
    console.error("[api/documents/[id]] delete failed", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Document not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete document.",
      },
      { status: 500 }
    );
  }
}
