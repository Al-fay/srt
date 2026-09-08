import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";

export const Route = createFileRoute("/pengumuman-libur/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Pengumuman Libur</h2>
        <Button asChild size="sm">
          <Link to="/pengumuman-libur/create" className="gap-2">
            <PlusCircle className="size-4" />
            <span>Tambah</span>
          </Link>
        </Button>
      </div>
    </>
  );
}
