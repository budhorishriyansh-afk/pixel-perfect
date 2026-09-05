import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/kids")({
  component: () => <Navigate to="/category/$slug" params={{ slug: "kids" }} />,
});
