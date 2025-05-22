import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";

import LayoutProvider from "@/components/layout/LayoutProvider";

import "@/styles/styles.scss";

const fontPlusJakarta = Plus_Jakarta_Sans({
  weight: ["400", "600"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-main",
});

const fontRany = localFont({
  variable: "--font-secondary",
  display: "swap",
  src: [
    {
      path: "../public/fonts/Rany/Rany-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Rany/Rany-Medium.woff",
      weight: "500",
      style: "normal",
    },
  ],
});

export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fontPlusJakarta.variable} ${fontRany.variable}`}
    >
      <body>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
