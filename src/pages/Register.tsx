import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUpWithEmail } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirect";
import { registerSchema, validateForm, type FieldErrors } from "@/lib/validation";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: unknown } | null)?.from;

  const [errors, setErrors] = useState<FieldErrors<{ name: string; email: string; password: string }>>({});
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState<string>();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = validateForm(registerSchema, {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    });
    setErrors(result.errors ?? {});
    setFormError(undefined);
    if (!result.data) return;

    setSubmitting(true);
    const auth = await signUpWithEmail(result.data.name, result.data.email, result.data.password);
    setSubmitting(false);
    if (!auth.ok) return setFormError(auth.message);
    // No session means the project wants the email confirmed first.
    if (auth.session) navigate(safeRedirectPath(from), { replace: true });
    else setConfirmEmail(result.data.email);
  }

  if (confirmEmail) {
    return (
      <AuthShell
        title="Check your email"
        description={`We sent a confirmation link to ${confirmEmail}. Open it to finish creating your account.`}
        footer={
          <>
            Already confirmed?{" "}
            <Link to="/login" state={location.state} className="font-medium text-foreground underline-offset-4 hover:underline">
              Log in
            </Link>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Can&apos;t find it? Check your spam folder.</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      description="Save your invitations, publish them and collect replies."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="font-medium text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Field id="register-name" label="Name" error={errors.name}>
          <Input id="register-name" name="name" autoComplete="name" maxLength={80} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "register-name-error" : undefined} />
        </Field>
        <Field id="register-email" label="Email" error={errors.email}>
          <Input id="register-email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "register-email-error" : undefined} />
        </Field>
        <Field id="register-password" label="Password" helper="At least 8 characters." error={errors.password}>
          <Input id="register-password" name="password" type="password" autoComplete="new-password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "register-password-error" : undefined} />
        </Field>
        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
