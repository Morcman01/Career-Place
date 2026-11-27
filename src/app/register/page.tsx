"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setInfo("");

        if (username.trim().length < 3) {
            setError("Username minimal 3 karakter.");
            return;
        }
        if (password.length < 8) {
            setError("Password minimal 8 karakter.");
            return;
        }

        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username: username.trim() } },
        });
        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        if (data.session) {
            window.location.href = "/";
        } else {
            setInfo("Akun dibuat. Cek email kamu untuk konfirmasi, lalu login.");
            }
        }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow"
        >
            <h1 className="text-2xl font-bold text-gray-900">Daftar CareerPlace</h1>

        <div className="space-y-1">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username
            </label>
            <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
            />
        </div>

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
            <p className="text-xs text-gray-500">Minimal 8 karakter.</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-green-600">{info}</p>}

        <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
            {loading ? "Memproses..." : "Daftar"}
        </button>

        <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
            Masuk
            </Link>
        </p>
        </form>
    </main>
    );
}