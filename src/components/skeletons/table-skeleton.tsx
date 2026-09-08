import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  columns?: number
  rows?: number
}

export function TableSkeleton({ columns = 6, rows = 10 }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Skeleton className="h-5 w-24" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row} className="border-b">
              {Array.from({ length: columns }).map((_, col) => (
                <td key={col} className="px-4 py-3">
                  <Skeleton className="h-5 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
