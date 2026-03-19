import type { ReactNode } from "react";
import { Check, AlertCircle, X } from "lucide-react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "caution"
  | "error"
  | "neutral"
  | "info"
  | "support";

const variantClasses: Record<BadgeVariant, string> = {
  success:
    "bg-status-success-bg text-status-success-text border-status-success-border",
  warning:
    "bg-status-warning-bg text-status-warning-text border-status-warning-border",
  caution:
    "bg-status-warning-bg text-status-caution-text border-status-warning-border",
  error:
    "bg-status-error-bg text-status-error-text border-status-error-border",
  neutral:
    "bg-status-neutral-bg text-brand-dark border-status-neutral-border",
  info: "bg-status-info-bg text-status-info-text border-status-info-border",
  support:
    "bg-status-support-bg text-status-support-text border-status-error-border",
};

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({
  variant,
  children,
  icon,
  dot,
  className,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${variantClasses[variant]}${className ? ` ${className}` : ""}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {icon}
      {children}
    </span>
  );
}

// Circular icon-only status indicator
export type StatusIconVariant = "success" | "warning" | "error";

const statusIconClasses: Record<StatusIconVariant, string> = {
  success:
    "bg-status-success-bg border-status-success-border text-status-success-text",
  warning:
    "bg-status-warning-bg border-status-warning-border text-status-caution-text",
  error:
    "bg-status-error-bg border-status-error-border text-status-error-text",
};

const statusIcons: Record<StatusIconVariant, ReactNode> = {
  success: <Check size={14} strokeWidth={2.5} />,
  warning: <AlertCircle size={14} strokeWidth={2} />,
  error: <X size={14} strokeWidth={2.5} />,
};

interface StatusIconProps {
  variant: StatusIconVariant;
  className?: string;
}

export function StatusIcon({ variant, className }: StatusIconProps) {
  return (
    <div
      className={`inline-flex items-center justify-center size-6 rounded-full border ${statusIconClasses[variant]}${className ? ` ${className}` : ""}`}
    >
      {statusIcons[variant]}
    </div>
  );
}
