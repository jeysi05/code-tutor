type AiUsageBadgeProps = {
  used: number;
  limit: number;
};

export default function AiUsageBadge({ used, limit }: AiUsageBadgeProps) {
  const remaining = Math.max(limit - used, 0);
  const isLow = remaining <= 3;
  const isEmpty = remaining === 0;

  return (
    <div
      className={`rounded-full border px-4 py-2 text-sm font-semibold ${
        isEmpty
          ? "border-red-400/30 bg-red-500/10 text-red-200"
          : isLow
            ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-100"
            : "border-blue-400/20 bg-blue-500/10 text-blue-100"
      }`}
    >
      AI Checks: {used} / {limit}
    </div>
  );
}