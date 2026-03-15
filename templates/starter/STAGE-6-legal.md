# Stage 6 — Legal Pages

## 6.1 Overview

Three legal pages are required for Hungarian businesses:
- **Privacy Policy** (`/privacy`) — GDPR compliance
- **Terms of Service** (`/terms`) — business terms
- **Imprint** (`/imprint`) — company information (required by Hungarian law)

All three use a minimal layout: no navbar, no footer — just a back link and content.

## 6.2 Page template

All three pages follow the same pattern. Example for privacy:

```tsx
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "hu"
        ? "Adatvédelmi nyilatkozat — {{BUSINESS_NAME}}"
        : "Privacy Policy — {{BUSINESS_NAME}}",
  };
}

export default function PrivacyPage() {
  const t = useTranslations("legal");

  const sectionKeys = [
    "collection",
    "purpose",
    "storage",
    "hosting",
    "rights",
    "contact",
  ] as const;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <a
        href="/"
        className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </a>

      <h1 className="text-3xl font-bold md:text-4xl">
        {t("privacy.title")}
      </h1>

      <p className="mt-4 text-sm text-muted-foreground">
        {t("privacy.lastUpdated")}
      </p>

      <p className="mt-6 text-foreground/70 leading-relaxed">
        {t("privacy.intro")}
      </p>

      <div className="mt-12 space-y-10">
        {sectionKeys.map((key) => (
          <section key={key}>
            <h2 className="mb-3 text-lg font-semibold">
              {t(`privacy.sections.${key}.title`)}
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              {t(`privacy.sections.${key}.content`)}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
```

## 6.3 Privacy Policy content (template)

Sections to include:
1. **What data we collect** — contact form fields only, no cookies/tracking
2. **Why we collect it** — to respond to inquiries, no third-party sharing
3. **How we store it** — encrypted EU servers, retention period
4. **Website hosting** — HTTPS, no personal data logged beyond access logs
5. **Your rights** — GDPR rights (access, correct, delete)
6. **Contact** — email for privacy requests

## 6.4 Terms of Service content (template)

Sections to include:
1. **Scope of services** — what the business provides
2. **Payment** — payment terms
3. **Revisions** — revision policy
4. **Delivery** — delivery timeline
5. **Ownership** — who owns the deliverables
6. **Limitation of liability** — standard liability cap
7. **Governing law** — Hungarian law, Budapest courts

## 6.5 Imprint content (template)

Sections to include:
1. **Company information** — business name, address
2. **Contact** — email, website
3. **Business registration** — tax number, registration number (can be `[To be added]`)
4. **Disclaimer** — accuracy disclaimer

Use `whitespace-pre-line` class on content paragraphs that contain `\n` for multi-line content (like addresses).

## 6.6 Footer integration

The footer links to these pages:

```tsx
<a href="/privacy">{t("footer.privacy")}</a>
<a href="/terms">{t("footer.terms")}</a>
<a href="/imprint">{t("footer.imprint")}</a>
```

next-intl handles locale prefixing automatically — `/privacy` becomes `/en/privacy` for English users.

## 6.7 Important note

All legal content is placeholder text. The client must review with a lawyer before going live. Mark registration numbers and specific legal details with `[To be added]` placeholders.
