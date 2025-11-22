// Alert.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
  XCircle,
  AlertTriangle,
} from "lucide-react";

// -----------------------------
// CVA Styling for Variants
// -----------------------------
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid items-start gap-y-1 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current transition-all",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-red-50 border-red-200 text-red-700 [&>svg]:text-red-700",
        success: "bg-green-50 border-green-200 text-green-700 [&>svg]:text-green-700",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-700 [&>svg]:text-yellow-700",
        info: "bg-blue-50 border-blue-200 text-blue-700 [&>svg]:text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// -----------------------------
// Default Icons for Variants
// -----------------------------
const variantIcons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

// -----------------------------
// Alert Component Props
// -----------------------------
interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  closable?: boolean;
  onClose?: () => void;
  duration?: number; // auto-dismiss in ms
  icon?: React.ReactNode;
}

// -----------------------------
// Alert Component
// -----------------------------
const Alert = ({
  className,
  variant,
  closable = false,
  onClose,
  duration,
  icon,
  ...props
}: AlertProps) => {
  const [visible, setVisible] = React.useState(true);

  // Auto-dismiss
  React.useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!visible) return null;

  const IconComponent = icon || variantIcons[variant || "default"];

  return (
    <div
      role="alert"
      aria-live={variant === "destructive" ? "assertive" : "polite"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <IconComponent className="h-4 w-4 mt-0.5" />
      {props.children}
      {closable && (
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          aria-label="Close"
          className="absolute top-2 right-2 p-1 rounded hover:bg-muted/20 transition"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// -----------------------------
// Alert Title
// -----------------------------
const AlertTitle = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  );
};

// -----------------------------
// Alert Description
// -----------------------------
const AlertDescription = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
};

export { Alert, AlertTitle, AlertDescription };
