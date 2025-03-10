"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold text-center mb-6">
        Willkommen bei der Notizen-App
      </h1>

      <p className="text-xl text-gray-600 text-center max-w-2xl mb-8">
        Erstelle, verwalte und teile deine Notizen. Markiere sie als erledigt,
        like Notizen anderer Benutzer und hinterlasse Kommentare.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        {session ? (
          <Link href="/dashboard">
            <Button size="lg">Zum Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Anmelden
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg">Registrieren</Button>
            </Link>
          </>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard
          title="Notizen erstellen"
          description="Erstelle und verwalte deine Notizen mit Titel und Inhalt."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          }
        />

        <FeatureCard
          title="Interaktionen"
          description="Markiere Notizen als erledigt und like Notizen anderer Benutzer."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
          }
        />

        <FeatureCard
          title="Kommentare"
          description="Hinterlasse Kommentare zu Notizen und tausche dich mit anderen aus."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
