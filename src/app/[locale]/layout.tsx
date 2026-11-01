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
            "Céges AI-asszisztens a saját adataiból, egyedi szoftver, folyamatautomatizálás és weboldal KKV-knak és nagyvállalatoknak. Ingyenes felmérés, szakaszonként fix ár.",
    },
    en: {
        title: "Budapest Labs",
        description:
            "Company AI assistants built on your own data, custom software, process automation, and websites for SMBs and enterprises. Free assessment, fixed price per phase.",
    },
    de: {
        title: "Budapest Labs",
        description:
            "KI-Assistenten auf Ihren eigenen Firmendaten, individuelle Software, Prozessautomatisierung und Websites für KMU und Großunternehmen. Kostenlose Analyse, Festpreis pro Phase.",
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
                    defaultTheme="light"
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
