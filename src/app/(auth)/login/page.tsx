import LoginForm from "@/components/auth/login/login-form";
import { redirectIfAuthenticated } from "@/lib/require-auth";

export default async function Login() {
  await redirectIfAuthenticated();

  return <LoginForm />;
}