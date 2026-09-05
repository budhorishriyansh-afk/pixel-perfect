import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/accessories")({
  component: () => <Navigate to="/category/$slug" params={{ slug: "accessories" }} />,
});
