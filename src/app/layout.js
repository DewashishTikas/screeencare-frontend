import { Poppins, Open_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ConditionalNavbar from "./_components/ConditionalNavbar";
import { AuthProvider } from "./_context/AuthContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata = {
  title: "ScreenCare - Doorstep Screen Protector Installation",
  description: "Choose a compatible protector, pick a convenient time, and get professional installation at your doorstep within 1 hour.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${poppins.variable} ${openSans.variable}`}
    >
      <head>
        <link rel="icon" href="logo.ico" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <Suspense fallback={null}>
            <ConditionalNavbar />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
