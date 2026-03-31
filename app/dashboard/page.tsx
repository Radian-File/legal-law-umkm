import { currentUser } from "@clerk/nextjs/server";
import { ComplianceStatus } from "@prisma/client";

import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { prisma } from "@/lib/prisma";

const regulatoryUpdates = [
  {
    type: "UU",
    title: "UU No. 27 Tahun 2022 Tentang Pelindungan Data Pribadi",
    detail: "Wajib dipatuhi seluruh entitas digital sebelum Oktober 2024. AI mendeteksi 14 klausul yang perlu diperbarui.",
    impact: "Urgent Impact",
    impactVariant: "danger" as const,
    updatedAt: "2 hari lalu",
  },
  {
    type: "PP",
    title: "PP No. 5 Tahun 2021 Tentang Perizinan Berusaha Berbasis Risiko",
    detail: "Perubahan teknis pada sistem OSS-RBA dengan dampak rendah terhadap operasional dokumen perusahaan.",
    impact: "Low Impact",
    impactVariant: "info" as const,
    updatedAt: "1 minggu lalu",
  },
];

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Pengguna";

  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      type: true,
      complianceStatus: true,
      createdAt: true,
      riskScore: true,
    },
  });

  const totalDocuments = await prisma.document.count();
  const highRiskCount = await prisma.document.count({ where: { complianceStatus: "HIGH_RISK" } });
  const compliantCount = await prisma.document.count({ where: { complianceStatus: "COMPLIANT" } });
  const recentLawUpdates = regulatoryUpdates.length;
  const healthScore = totalDocuments === 0 ? 0 : Math.round((compliantCount / totalDocuments) * 100);

  const summaryCards = [
    {
      label: "Total Dokumen",
      value: String(totalDocuments),
      note: totalDocuments === 0 ? "Belum ada upload" : "Live from uploads",
      iconKey: "documents" as const,
      accent: "neutral" as const,
    },
    {
      label: "Analisis Berisiko",
      value: String(highRiskCount),
      note: highRiskCount === 0 ? "No critical findings" : "Perlu tindakan segera",
      iconKey: "risk" as const,
      accent: "danger" as const,
    },
    {
      label: "Kepatuhan Hijau",
      value: String(compliantCount),
      note: compliantCount === 0 ? "Belum ada compliant doc" : "Audit ready",
      iconKey: "green" as const,
      accent: "success" as const,
    },
    {
      label: "UU Terbaru",
      value: String(recentLawUpdates),
      note: "Static regulatory feed",
      iconKey: "laws" as const,
      accent: "info" as const,
    },
  ];

  return (
    <DashboardContent
      firstName={firstName}
      documents={documents.map((document) => ({
        ...document,
        type: document.type,
        createdAt: document.createdAt.toISOString(),
      }))}
      totalDocuments={totalDocuments}
      highRiskCount={highRiskCount}
      compliantCount={compliantCount}
      healthScore={healthScore}
      summaryCards={summaryCards}
      regulatoryUpdates={regulatoryUpdates}
    />
  );
}
