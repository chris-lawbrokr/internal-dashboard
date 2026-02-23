import * as React from "react";

type CardVariant = "default" | "outline" | "ghost";
type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function cn(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(" ");
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-card text-card-foreground border border-border shadow-sm",
  outline: "bg-transparent text-card-foreground border border-border",
  ghost: "bg-transparent text-card-foreground",
};

const paddingStyles: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", padding = "md", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg",
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5", className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pt-4", className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center pt-4", className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";
