"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { ForgotPasswordValues } from "@/types/auth";

function getResponseMessage(value: unknown): string | undefined {
  if (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return value.message;
  }
}

export default function ForgetPasswordForm() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>();

  async function onSubmit(values: ForgotPasswordValues) {
    setServerError("");
    setSuccessMessage("");

    let response: Response;
    try {
      response = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
    } catch {
      setServerError("Unable to connect. Please try again.");
      return;
    }

    let result: unknown;
    try {
      result = await response.json();
    } catch {
      setServerError("The server returned an invalid response.");
      return;
    }

    if (!response.ok) {
      setServerError(
        getResponseMessage(result) ??
          `Password reset request failed with status ${response.status}.`,
      );
      return;
    }

    setSuccessMessage(
      getResponseMessage(result) ??
        "If an account exists for this email, password reset instructions will be sent.",
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f7f9f7] px-4 py-10 sm:px-6">
      <section className="w-full max-w-lg rounded-xl border border-[#e7ece8] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-[#198754]">
            FreshCart shop
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#26382d]">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-[#7b887e]">
            Enter your email address and we&apos;ll send you a reset code.
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
              className="mt-1 w-full rounded-md border border-[#dfe5e0] px-3 py-2.5 text-sm text-[#26382d] outline-none transition focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/20"
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

          {serverError ? (
            <p
              className="rounded-md bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {serverError}
            </p>
          ) : null}
          {successMessage ? (
            <p
              className="rounded-md bg-green-50 p-3 text-sm text-green-700"
              role="status"
            >
              {successMessage}
            </p>
          ) : null}

          <button
            className="w-full rounded-md bg-[#198754] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#157347] disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending reset code..." : "Send reset code"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#7b887e]">
          Remembered your password?{" "}
          <Link
            className="font-medium text-[#198754] hover:underline"
            href="/login"
          >
            Back to sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
