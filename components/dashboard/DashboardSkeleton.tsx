import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-8">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg">
          <div className="p-8 md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-4">
                <Skeleton className="h-7 w-64 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-9 w-[90%] max-w-xl" />
                  <Skeleton className="h-5 w-[95%] max-w-2xl" />
                  <Skeleton className="h-5 w-[80%] max-w-xl" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-11 w-48 rounded-2xl" />
                <Skeleton className="h-11 w-36 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-end gap-3">
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-12 w-12 rounded-2xl" />
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-7 w-80" />
              </div>
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
          <div className="p-0">
            <div className="grid grid-cols-12 gap-4 px-6 py-4">
              <Skeleton className="col-span-5 h-4" />
              <Skeleton className="col-span-2 h-4" />
              <Skeleton className="col-span-3 h-4" />
              <Skeleton className="col-span-2 h-4" />
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 border-t border-slate-100 px-6 py-5">
                <Skeleton className="col-span-5 h-5 w-[85%]" />
                <Skeleton className="col-span-2 h-5 w-[80%]" />
                <Skeleton className="col-span-3 h-6 w-24 rounded-full" />
                <Skeleton className="col-span-2 h-5 w-[75%]" />
              </div>
            ))}
            <div className="flex items-center justify-between px-6 py-5">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
