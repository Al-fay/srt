import { Card } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export default function SuratDriverFormSkeleton() {
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

          {/* pemberi tugas + jabatan */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>

          {/* Tanggal + Jam */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>

          {/* tujuan */}
          <Skeleton className="h-11 w-full" />

          {/* keperluan */}
          <Skeleton className="h-20 w-full" />

          {/* nopol */}
          <Skeleton className="h-11 w-full" />

          {/* keterangan */}
          <Skeleton className="h-11 w-full" />

          {/* klasifikasi */}
          <Skeleton className="h-11 w-full" />

          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </Card>
    </>
  )
}
