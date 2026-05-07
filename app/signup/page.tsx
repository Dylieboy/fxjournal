import Link from "next/link";
import { redirect } from "next/navigation";
import { signUpAction } from "@/app/actions";
import { AuthForm } from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";

export default async function SignUpPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <section className="auth-intro">
          <h1>Build a journal that keeps you honest.</h1>
          <p>
            Log every trade with the position size, planned loss, target reward,
            final P/L, and the lesson you want to remember before the next entry.
          </p>
        </section>

        <section className="auth-panel">
          <h2>Create account</h2>
          <p>
            Locally this uses a small file database. On Vercel it will use Neon once
            `DATABASE_URL` is added.
          </p>
          <AuthForm mode="signup" action={signUpAction} />
          <div className="link-row">
            Already have an account? <Link href="/signin">Sign in</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
