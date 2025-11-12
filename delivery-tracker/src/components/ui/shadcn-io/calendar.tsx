"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import CalendarLib from "react-calendar"; // default import
import "react-calendar/dist/Calendar.css";

interface CalendarProps extends React.ComponentProps<typeof CalendarLib> {
  className?: string;
}

const Calendar = React.forwardRef<CalendarLib, CalendarProps>(
  ({ className, ...props }, ref) => {
    return (
      <CalendarLib
        ref={ref as any}
        {...props}
        className={cn(
          "p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
          className
        )}
      />
    );
  }
);

Calendar.displayName = "Calendar";

// ✅ Named export
export { Calendar };
