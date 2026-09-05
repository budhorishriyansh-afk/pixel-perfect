import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/sale")({
  component: () => <Navigate to="/collections/$slug" params={{ slug: "sale" }} />,
});
