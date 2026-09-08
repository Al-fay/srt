import { Card } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export default function SuratTugasFormSkeleton() {
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>

          <Skeleton className="h-11 w-full" />

          <Skeleton className="h-11 w-full" />

          <Skeleton className="h-11 w-full" />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>

          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </Card>
    </>
  )
}
