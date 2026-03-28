import { cookies } from "next/headers";
import { CTA } from "./CTA"

export const Navbar = async () => {
    const token = (await cookies()).get("access_token");

    return <header className="z-navbar border-b-1 py-4 border-b-border">
        <nav className="wrapper flex justify-between items-center">
            <a href="/" className="heading">Mini EMR</a>
            {token && <CTA />}
        </nav>
    </header>
}