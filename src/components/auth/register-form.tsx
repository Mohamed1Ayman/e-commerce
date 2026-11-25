"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { SignupValues } from "@/types/auth";

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

const inputClassName =
  "mt-1 w-full rounded-md border border-[#dfe5e0] px-3 py-2.5 text-sm text-[#26382d] outline-none transition focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/20";

export default function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>();

  async function onSubmit(values: SignupValues) {
    setServerError("");
    setSuccessMessage("");

    let response: Response;
    try {
      response = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
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
          `Sign up failed with status ${response.status}.`,
      );
      return;
    }

    setSuccessMessage("Your account has been created successfully.");
    reset();
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f7f9f7] px-4 py-10 sm:px-6">
      <section className="w-full max-w-lg rounded-xl border border-[#e7ece8] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-[#198754]">
            FreshCart shop
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#26382d]">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-[#7b887e]">
            Sign up to start shopping with us.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label
              className="text-sm font-medium text-[#26382d]"
              htmlFor="name"
            >
              Full name
            </label>
            <input
              className={inputClassName}
              id="name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name", {
                required: "Name is required.",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters.",
                },
              })}
            />
            {errors.name ? (
              <p className="mt-1 text-sm text-red-600" id="name-error">
                {errors.name.message}
              </p>
            ) : null}
          </div>

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
              htmlFor="phone"
            >
              Phone number
            </label>
            <input
              className={inputClassName}
              id="phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              {...register("phone", {
                required: "Phone number is required.",
                pattern: {
                  value: /^01[0125]\d{8}$/,
                  message: "Enter a valid Egyptian mobile number.",
                },
              })}
            />
            {errors.phone ? (
              <p className="mt-1 text-sm text-red-600" id="phone-error">
                {errors.phone.message}
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
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters.",
                },
                deps: "rePassword",
              })}
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-red-600" id="password-error">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              className="text-sm font-medium text-[#26382d]"
              htmlFor="rePassword"
            >
              Confirm password
            </label>
            <input
              className={inputClassName}
              id="rePassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.rePassword)}
              aria-describedby={
                errors.rePassword ? "rePassword-error" : undefined
              }
              {...register("rePassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match.",
              })}
            />
            {errors.rePassword ? (
              <p className="mt-1 text-sm text-red-600" id="rePassword-error">
                {errors.rePassword.message}
              </p>
            ) : null}
          </div>

          {serverError ? (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
              {serverError}
            </p>
          ) : null}
          {successMessage ? (
            <p
              className="rounded-md bg-green-50 p-3 text-sm text-green-700"
              role="status"
            >
              {successMessage}{" "}
              <Link
                className="font-semibold underline"
                href="/login"
              >
                Sign in
              </Link>
            </p>
          ) : null}

          <button
            className="w-full rounded-md bg-[#198754] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#157347] disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#7b887e]">
          Already have an account?{" "}
          <Link
            className="font-medium text-[#198754] hover:underline"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
