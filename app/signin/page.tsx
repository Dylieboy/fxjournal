import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction } from "@/app/actions";
import { AuthForm } from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";

export default async function SignInPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <section className="auth-intro">
          <h1>Trade the plan, study the result.</h1>
          <p>
            Keep your gold, forex, and index trades in one place with lot size, risk,
            reward, outcome, streaks, and the notes that sharpen your next setup.
          </p>
        </section>

        <section className="auth-panel">
          <h2>Sign in</h2>
          <p>Open your trading journal and review what your recent trades are teaching you.</p>
          <AuthForm mode="signin" action={signInAction} />
          <div className="link-row">
            New here? <Link href="/signup">Create an account</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
