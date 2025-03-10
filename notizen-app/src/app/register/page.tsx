"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Fehler löschen, wenn der Benutzer das Feld bearbeitet
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name ist erforderlich";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ungültiges E-Mail-Format";
    }

    if (!formData.password) {
      newErrors.password = "Passwort ist erforderlich";
    } else if (formData.password.length < 6) {
      newErrors.password = "Passwort muss mindestens 6 Zeichen lang sein";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwörter stimmen nicht überein";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler bei der Registrierung");
      }

      // Erfolgreich registriert, zur Anmeldeseite weiterleiten
      router.push("/login?registered=true");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Ein unbekannter Fehler ist aufgetreten"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registrieren</h1>

      {serverError && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
          {serverError}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            fullWidth
          />

          <Input
            label="E-Mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            fullWidth
          />

          <Input
            label="Passwort"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            fullWidth
          />

          <Input
            label="Passwort bestätigen"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            fullWidth
          />

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Wird registriert..." : "Registrieren"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Bereits registriert?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Hier anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
