export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than 1 minute
  if (secondsPast < 60) {
    return "just now";
  }
  // Less than 1 hour
  if (secondsPast < 3600) {
    const mins = Math.floor(secondsPast / 60);
    return `${mins} min${mins === 1 ? "" : "s"} ago`;
  }
  // Less than 24 hours
  if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  // 24 hours or more (e.g., "June 4")
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}