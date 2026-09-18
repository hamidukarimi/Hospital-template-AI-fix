export const LoadingState = ({ label = "Loading..." }: { label?: string }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-slate-600">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#147BD5]" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};
