import type { Metadata } from "next";
import { Lexend, Space_Grotesk } from "next/font/google";
import "./globals.css";
const lexend = Lexend({
    subsets: ["latin"],
    variable: "--font-display",
});
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-sans",
    weight: ["400", "500", "600"],
});
export const metadata: Metadata = {
    title: "RAG Command Center",
    description: "Multi-tenant document ingestion and retrieval-augmented chat interface.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className={`${lexend.variable} ${spaceGrotesk.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
