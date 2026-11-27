"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

        setLoading(false);

        if (error) {
            if (error.message === "Invalid login credentials") {
                setError("Email atau password salah.");
            } else if (error.message === "Email not confirmed") {
                setError("Email kamu belum dikonfirmasi. Cek inbox emailmu.");
            } else {
                setError(error.message);
            }
        return;
        }

        window.location.href = "/";
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow"
        >
            <h1 className="text-2xl font-bold text-gray-900">Masuk CareerPlace</h1>

            <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
            </label>
            <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
            />
            </div>

            <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
            </label>
            <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
            />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
            {loading ? "Memproses..." : "Masuk"}
            </button>

            <p className="text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
                Daftar
            </Link>
            </p>
        </form>
        </main>
    );
}