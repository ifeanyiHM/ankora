import { Logo } from "@/components/brand/Logo";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-sm border border-line bg-white p-8 xl1:max-w-md xl1:p-10 xl2:max-w-lg xl3:max-w-xl xl3:p-12 xl4:max-w-2xl">
        <Logo className="mb-6 xl1:mb-8 xl3:mb-10 xl2:scale-105 xl3:scale-110 xl4:scale-125" />
        <h1 className="mb-1 text-2xl font-bold xl1:text-3xl xl3:text-4xl">
          Admin sign in
        </h1>
        <p className="mb-6 text-sm text-muted xl1:mb-8 xl1:text-base xl3:text-lg">
          Sign in to manage products, categories and orders.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
