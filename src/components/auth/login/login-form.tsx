"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { LoginValues } from "@/types/auth";

const inputClassName =
  "mt-1 w-full rounded-md border border-[#dfe5e0] px-3 py-2.5 text-sm text-[#26382d] outline-none transition focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/20";

export default function LoginForm() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>();

  async function onSubmit(values: LoginValues) {
    setServerError("");

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/products",
      });

      if (!result?.ok || result.error) {
        setServerError(
          result?.error === "CredentialsSignin"
            ? "Email or password is incorrect."
            : "Unable to sign in. Please try again.",
        );
        return;
      }

      router.replace("/products");
      router.refresh();
    } catch {
      setServerError("Unable to connect. Please try again.");
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f7f9f7] px-4 py-10 sm:px-6">
      <section className="w-full max-w-lg rounded-xl border border-[#e7ece8] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-[#198754]">
            FreshCart shop
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#26382d]">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-[#7b887e]">
            Welcome back. Enter your account details to continue.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label
              className="text-sm font-medium text-[#26382d]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={inputClassName}
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />
            {errors.email ? (
              <p className="mt-1 text-sm text-red-600" id="email-error">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              className="text-sm font-medium text-[#26382d]"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={inputClassName}
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              {...register("password", {
                required: "Password is required.",
              })}
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-red-600" id="password-error">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="text-right">
            <Link
              className="text-sm font-medium text-[#198754] hover:underline"
              href="/forgetPassWord"
            >
              Forgot password?
            </Link>
          </div>

          {serverError ? (
            <p
              className="rounded-md bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {serverError}
            </p>
          ) : null}

          <button
            className="w-full rounded-md bg-[#198754] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#157347] disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#7b887e]">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium text-[#198754] hover:underline"
            href="/register"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
