import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) => {
  const actionButton = actionHref ? (
    <Link
      to={actionHref}
      className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A1A1A]"
    >
      <Plus className="h-4 w-4" />
      {actionLabel}
    </Link>
  ) : (
    onAction && (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A1A1A]"
      >
        <Plus className="h-4 w-4" />
        {actionLabel}
      </button>
    )
  );

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {actionLabel && actionButton && (
        <div className="mt-5 flex justify-center">{actionButton}</div>
      )}
    </div>
  );
};
