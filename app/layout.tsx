import type { Metadata } from "next";
import { Marcellus } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),
  title: {
    default: "Continental Home",
    template: "%s | Continental Home",
  },
  description: "",
  keywords: ["Rope lamps, Teak Lamps, Ceramic Sealife Lamps, Ceramic Sealife Vases"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>

      <body className={`${marcellus.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}