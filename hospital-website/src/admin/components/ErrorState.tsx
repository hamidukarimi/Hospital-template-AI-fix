import { AlertTriangle } from "lucide-react";

export const ErrorState = ({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5" />
        <div className="flex-1">
          <p className="text-base font-semibold">{title}</p>
          <p className="mt-1 text-sm text-red-600">{message}</p>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </div>
  );
};
