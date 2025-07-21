import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

export const metadata: Metadata = {
  title: "EduTutor AI - Personalized Learning Platform",
  description:
    "AI-powered personalized learning with adaptive quizzing, explainability, and LMS integration.",
  generator: "v0.dev",
  authors: [{ name: "Bharadwaj Mallampati" }],
  keywords: [
    "AI Learning",
    "Personalized Education",
    "Adaptive Quizzes",
    "WatsonX",
    "Google Classroom",
    "EduTutor",
  ],
  robots: "index, follow",
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-foreground antialiased transition-colors duration-300`}
      >
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
