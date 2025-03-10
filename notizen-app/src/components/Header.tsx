"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Button from "./Button";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Notizen-App
              </Link>
            </div>
            <nav className="ml-6 flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Startseite
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Hallo, {session.user.name}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Abmelden
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="secondary" size="sm">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrieren</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
