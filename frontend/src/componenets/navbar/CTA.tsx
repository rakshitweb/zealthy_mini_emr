"use client";

import { logout } from "@/lib/auth";
import { usePathname } from "next/navigation";

export const CTA = () => {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith("/admin");

    return <div className="flex gap-5 items-center">
        {isAdminPage ? <a href="/">Home Portal</a> : <a href="/admin">Admin Portal</a>}
        <a className="cursor-pointer" onClick={logout}>Logout</a>
    </div>
}