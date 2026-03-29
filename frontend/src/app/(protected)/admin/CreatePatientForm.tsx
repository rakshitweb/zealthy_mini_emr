"use client";

import { useState } from "react";
import { createPatient } from "@/lib/patients";
import { useRouter } from "next/navigation";

export const CreatePatientForm = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPatient({ name, email, password });
        setName("");
        setEmail("");
        setPassword("");
        setOpen(false);
        router.refresh();
    };

    if (!open) {
        return <button className="btn-primary text-sm" onClick={() => setOpen(true)}>+ Patient</button>;
    }

    return (
        <form onSubmit={handleSubmit} className="border border-border p-4 mb-6 flex gap-4 flex-wrap items-end">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted uppercase tracking-wide">Name</span>
                <input className="border border-border p-2" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted uppercase tracking-wide">Email</span>
                <input className="border border-border p-2 min-w-80" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted uppercase tracking-wide">Password</span>
                <input className="border border-border p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            </div>
            <div className="flex gap-2">
                <button type="submit" className="btn-primary text-sm">Create</button>
                <button type="button" className="btn-secondary text-sm" onClick={() => setOpen(false)}>Cancel</button>
            </div>
        </form>
    );
};
