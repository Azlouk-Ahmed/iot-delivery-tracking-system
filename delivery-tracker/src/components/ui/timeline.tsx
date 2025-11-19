import { cn } from "@/lib/utils";

export function Timeline({ children, className }) {
  return (
    <div className={cn("relative border-l border-gray-300 pl-6 space-y-6", className)}>
      {children}
    </div>
  );
}

export function TimelineItem({ title, description, icon }) {
  return (
    <div className="relative">
      {/* Point sur la ligne */}
      <span className="absolute -left-[1.05rem] flex h-4 w-4 items-center justify-center">
        <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
      </span>

      <div className="flex items-start gap-3">
        {icon && (
          <div className="text-yellow-600">
            {icon}
          </div>
        )}

        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
