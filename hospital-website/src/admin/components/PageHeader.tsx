import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  backLink?: string;
}

export const PageHeader = ({
  title,
  description,
  action,
  backLink,
}: PageHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        {backLink && (
          <Link
            to={backLink}
            className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}

        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
};
