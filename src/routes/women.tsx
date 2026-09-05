import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/women")({
  component: () => <Navigate to="/category/$slug" params={{ slug: "women" }} />,
});
