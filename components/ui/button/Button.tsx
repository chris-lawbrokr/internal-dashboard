import * as React from "react";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive" | "link";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function cn(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(" ");
}

const baseStyles =
  "flex items-center justify-center gap-1.5 self-stretch rounded-xl text-sm font-medium transition-colors cursor-pointer " +
  "shadow-[0_1px_0.5px_0.05px_rgba(29,41,61,0.02)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-ring focus-visible:ring-offset-background " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline:
    "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  link: "bg-transparent text-primary underline-offset-4 hover:underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      className,
      type = "button",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
