import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { ReactNode } from "react";
import Header from "@/components/layout/header";
import "../globals.css";

const font = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  params: {locale}
}: Props) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body className={font.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header background={true} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}