type UserStatsProps = {
  xp: number;
  streak: number;
  completedLessons: number;
};

export default function UserStats({
  xp,
  streak,
  completedLessons,
}: UserStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
          XP
        </p>
        <p className="mt-1 text-2xl font-bold text-white">{xp}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
          Streak
        </p>
        <p className="mt-1 text-2xl font-bold text-white">
          {streak} {streak === 1 ? "day" : "days"}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
          Completed
        </p>
        <p className="mt-1 text-2xl font-bold text-white">
          {completedLessons}
        </p>
      </div>
    </div>
  );
}