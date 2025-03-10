"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Prüfen, ob der Benutzer gerade registriert wurde
    const registered = searchParams.get("registered");
    if (registered === "true") {
      setSuccessMessage(
        "Registrierung erfolgreich! Bitte melde dich jetzt an."
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Bitte gib deine E-Mail und dein Passwort ein");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Erfolgreich angemeldet, zum Dashboard weiterleiten
      router.push("/dashboard");
    } catch (error) {
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Anmelden</h1>

      {successMessage && (
        <div className="bg-green-50 text-green-600 p-4 rounded mb-6">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <Input
            label="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <Input
            label="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Anmeldung läuft..." : "Anmelden"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Noch kein Konto?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
