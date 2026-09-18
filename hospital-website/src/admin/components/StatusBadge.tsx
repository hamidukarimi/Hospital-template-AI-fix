interface StatusBadgeProps {
  value?: boolean | string | null;
  trueLabel?: string;
  falseLabel?: string;
  className?: string;
}

export const StatusBadge = ({
  value,
  trueLabel = "Active",
  falseLabel = "Inactive",
  className = "",
}: StatusBadgeProps) => {
  const isTrue =
    value === true ||
    value === "true" ||
    value === "ACTIVE" ||
    value === "PUBLISHED";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        isTrue
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-200 text-slate-700",
        className,
      ].join(" ")}
    >
      {isTrue ? trueLabel : falseLabel}
    </span>
  );
};
