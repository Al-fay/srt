import { usePageTitle } from "@/lib/use-page-title";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  usePageTitle("Dahsboard");

  return (
    <>
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </>
  );
}
