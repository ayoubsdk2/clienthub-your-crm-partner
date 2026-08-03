import { cn } from "@/lib/utils";

export function Logo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_var(--primary)]">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 17.5 9.5 11l4 4L20 7" />
          <path d="M20 12V7h-5" />
        </svg>
      </span>
      {showWord && (
        <span className="text-[1.05rem] font-extrabold tracking-tight">
          Client<span className="text-primary">Hub</span>
        </span>
      )}
    </span>
  );
}
