import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/footwear")({
  component: () => <Navigate to="/category/$slug" params={{ slug: "footwear" }} />,
});
