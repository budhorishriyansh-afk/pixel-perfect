import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/men")({
  component: () => <Navigate to="/category/$slug" params={{ slug: "men" }} />,
});
