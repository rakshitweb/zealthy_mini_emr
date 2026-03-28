"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth";

const getCookie = (name: string) => {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='))
        ?.split('=')[1];
};

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (!searchParams.get("expired") && getCookie("access_token") != null) {
            router.replace("/")
        }
    }, [])

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 wrapper flex flex-col gap-8 justify-center">
            <div>
                <h1 className="heading">Sign in</h1>
                <p className="caption">Enter your credentials to access your record.</p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-96">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="border border-border rounded px-3 py-2 text-sm outline-none focus:ring-2"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="border border-border rounded px-3 py-2 text-sm outline-none focus:ring-2"
                    />
                </div>
                <div className="text-right">
                    <button
                        type={loading ? "button" : "submit"}
                        disabled={loading}
                        className="text-white rounded px-4 py-2 text-sm font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Loading..." : "Sign in"}
                    </button>
                </div>
            </form>
        </main>
    );
}
