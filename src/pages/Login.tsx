import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInWithEmail } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirect";
import { loginSchema, validateForm, type FieldErrors } from "@/lib/validation";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: unknown } | null)?.from;

  const [errors, setErrors] = useState<FieldErrors<{ email: string; password: string }>>({});
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = validateForm(loginSchema, { email: form.get("email"), password: form.get("password") });
    setErrors(result.errors ?? {});
    setFormError(undefined);
    if (!result.data) return;

    setSubmitting(true);
    const auth = await signInWithEmail(result.data.email, result.data.password);
    setSubmitting(false);
    if (auth.ok) navigate(safeRedirectPath(from), { replace: true });
    else setFormError(auth.message);
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to continue designing your invitations."
      footer={
        <>
          New here?{" "}
          <Link to="/register" state={location.state} className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Field id="login-email" label="Email" error={errors.email}>
          <Input id="login-email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} />
        </Field>
        <Field id="login-password" label="Password" error={errors.password}>
          <Input id="login-password" name="password" type="password" autoComplete="current-password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined} />
        </Field>
        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
