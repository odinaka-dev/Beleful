/** "or" divider used between primary auth actions and social login. */
export function OrDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-[#00452E]/10" />
      <span className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#00452E]/10" />
    </div>
  );
}
