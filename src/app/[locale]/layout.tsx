import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { ThemeProvider } from "next-themes"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import "@/app/globals.css"

const inter = Inter({
    subsets: ["latin", "latin-ext"],
    display: "swap",
    variable: "--font-inter",
})

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

const metaByLocale: Record<string, { title: string; description: string }> = {
    hu: {
        title: "Budapest Labs",
        description:
            "Prémium weboldal napokon belül, 0 Ft belépővel, havi 19 900 Ft-tól. Tervezés, kivitelezés és üzemeltetés egy kézből.",
    },
    en: {
        title: "Budapest Labs",
        description:
            "A premium website within days, €0 up front, from €49/month. Design, build, and hosting in one place.",
    },
    de: {
        title: "Budapest Labs",
        description:
            "Eine Premium-Website in wenigen Tagen, 0 € Startkosten, ab 49 €/Monat. Design, Umsetzung und Hosting aus einer Hand.",
    },
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const meta = metaByLocale[locale] ?? metaByLocale.hu

    return {
        title: {
            default: meta.title,
            template: "%s | Budapest Labs",
        },
        description: meta.description,
        metadataBase: new URL("https://budapestlabs.com"),
        alternates: {
            canonical: locale === "hu" ? "/" : `/${locale}`,
            languages: {
                hu: "/",
                en: "/en",
                de: "/de",
            },
        },
        openGraph: {
            title: meta.title,
            description: meta.description,
            url: locale === "hu" ? "/" : `/${locale}`,
            siteName: "Budapest Labs",
            locale:
                locale === "hu" ? "hu_HU" : locale === "de" ? "de_DE" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: meta.title,
            description: meta.description,
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    setRequestLocale(locale)

    const messages = (await import(`@/messages/${locale}.json`)).default

    return (
        <html lang={locale} className={inter.variable} suppressHydrationWarning>
            <body className="min-h-screen bg-background text-foreground antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                >
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        {children}
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
