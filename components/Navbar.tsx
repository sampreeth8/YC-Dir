import React from "react";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="bg-[#007cb9] p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="text-white text-xl font-bold cursor-pointer">
            <b>
              <i>Yr Dir</i>
            </b>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {session && session.user ? (
            <>
              <Link
                href="/startup/create/"
                className="text-white hover:underline"
              >
                Create
              </Link>
              <Link
                href={`/user/${session?.id}`}
                className="text-white hover:underline"
              >
                <span>{session?.user?.name}</span>
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">Sign Out</button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
