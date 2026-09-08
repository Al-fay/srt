import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SuratFormSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      <Card className="my-5 px-10 py-5 shadow-lg">
        <div className="space-y-6">
          {/* kantor + tanggal */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>

          {/* nomor */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>

          <Skeleton className="h-11 w-full" />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>

          <Skeleton className="h-11 w-full" />

          <Skeleton className="h-24 w-full" />

          {/* editor */}
          <Skeleton className="h-[350px] w-full rounded-xl" />

          <Skeleton className="h-24 w-full" />

          {/* ttd */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />

            {[1, 2].map((i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_40px]"
              >
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-10" />
              </div>
            ))}
          </div>

          <Skeleton className="h-11 w-full" />

          <Skeleton className="h-20 w-full" />

          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </Card>
    </>
  )
}
