# Notizen-App

Eine moderne Webanwendung zur Verwaltung von Notizen mit Benutzerauthentifizierung, Likes, Kommentaren und mehr.

## Funktionen

- **Benutzerauthentifizierung**: Registrierung und Anmeldung mit E-Mail und Passwort
- **Notizenverwaltung**: Erstellen und Löschen von Notizen
- **Interaktionen**: Notizen liken und als erledigt markieren
- **Kommentare**: Kommentare zu Notizen hinzufügen und löschen
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobilgeräte

## Technologiestack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes (serverlose Architektur)
- **Datenbank**: MongoDB
- **Authentifizierung**: NextAuth.js
- **Deployment**: Netlify (empfohlen)

## Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn
- MongoDB-Datenbank (z.B. MongoDB Atlas)

## Installation

1. Repository klonen:

   ```bash
   git clone https://github.com/dein-benutzername/notizen-app.git
   cd notizen-app
   ```

2. Abhängigkeiten installieren:

   ```bash
   npm install
   # oder
   yarn install
   ```

3. Umgebungsvariablen konfigurieren:

   - Kopiere die Datei `.env.local.example` zu `.env.local`
   - Fülle die erforderlichen Umgebungsvariablen aus:
     - `MONGODB_URI`: Verbindungs-URL zu deiner MongoDB-Datenbank
     - `NEXTAUTH_URL`: URL deiner Anwendung (im Entwicklungsmodus: http://localhost:3000)
     - `NEXTAUTH_SECRET`: Ein sicherer zufälliger String für die Verschlüsselung

4. Entwicklungsserver starten:

   ```bash
   npm run dev
   # oder
   yarn dev
   ```

5. Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## Deployment

### Netlify

1. Erstelle ein neues Projekt in Netlify
2. Verbinde es mit deinem GitHub-Repository
3. Setze die Umgebungsvariablen in den Netlify-Projekteinstellungen
4. Deploye die Anwendung

## Projektstruktur

```
notizen-app/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API-Routen
│   │   │   ├── auth/         # Authentifizierungs-API
│   │   │   ├── notes/        # Notizen-API
│   │   │   └── comments/     # Kommentare-API
│   │   ├── dashboard/        # Dashboard-Seite
│   │   ├── login/            # Login-Seite
│   │   └── register/         # Registrierungsseite
│   ├── components/           # Wiederverwendbare Komponenten
│   ├── models/               # Datenbankmodelle
│   ├── types/                # TypeScript-Typdefinitionen
│   └── utils/                # Hilfsfunktionen
├── public/                   # Statische Dateien
└── ...
```

## Lizenz

MIT

## Autor

Dein Name
