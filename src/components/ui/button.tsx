import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline";
type ButtonSize = "sm" | "default" | "lg" | "icon";

type ButtonStyleOptions = {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:opacity-90",
  outline:
    "border border-border bg-background text-foreground shadow-sm hover:bg-secondary",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3",
  default: "h-10 px-4",
  lg: "h-12 px-5",
  icon: "size-10 p-0",
};

/** Returns the shared button styles for both buttons and button-like links. */
function buttonStyles({
  className,
  size = "default",
  variant = "primary",
}: ButtonStyleOptions = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

type ButtonProps = React.ComponentProps<"button"> & ButtonStyleOptions;

/** Renders a consistently styled interactive button. */
function Button({ className, size, variant, ...props }: ButtonProps) {
  return (
    <button
      className={buttonStyles({ className, size, variant })}
      {...props}
    />
  );
}

export { Button, buttonStyles };
