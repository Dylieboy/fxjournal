"use client";

import { useActionState } from "react";

type AuthState = {
  error?: string;
};

type AuthFormProps = {
  mode: "signin" | "signup";
  action: (state: AuthState | void, formData: FormData) => Promise<AuthState | void>;
};

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="form-grid">
      {state?.error ? <div className="error">{state.error}</div> : null}

      {isSignup ? (
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" required />
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={8}
          required
        />
      </div>

      <button className="button" disabled={pending} type="submit">
        {pending ? "Working..." : isSignup ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
