import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Lightweight label + control + error/hint wrapper for admin forms.
 * Pairs with react-hook-form: pass `errors.field?.message` to `error`.
 */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={htmlFor} data-error={!!error}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {hint && !error ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** A red error banner for form-level (non-field) errors. */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
    >
      {message}
    </p>
  );
}
