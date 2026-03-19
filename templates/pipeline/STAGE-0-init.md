# Stage 0 — Project Initialization

This is the entry point for the entire pipeline. When someone says "here's the data, start building," begin here.

## 0.1 Parse the brief

Extract from the user's input:

- **Business name** → convert to kebab-case for the project folder (e.g., "Peti Pékség" → `peti-pekseg`, "MosolyDent Fogászat" → `mosolydent-fogaszat`)
- **Industry / business type** → feeds into the UI/UX skill search (Section 2 of CLIENT.md)
- **Client data** → any questionnaire answers, reference URLs, color preferences, logos, mood, content
- **Locale** → which languages (default: HU + EN)

If the user provides a filled-out CLIENT.md, use it directly. If they provide freeform data, mentally map it to CLIENT.md sections and note any gaps to fill with defaults or ask about later.

## 0.2 Create the project

All client projects live as siblings to budapestlabs in `/Users/mac/labs/`.

```bash
cd /Users/mac/labs
bunx create-next-app@latest <project-name> --typescript --eslint --app --src-dir --no-tailwind --turbopack
cd <project-name>
```

Replace `<project-name>` with the kebab-case business name from 0.1.

When prompted by create-next-app, answer:
- TypeScript? **Yes**
- ESLint? **Yes**
- `src/` directory? **Yes**
- App Router? **Yes**
- Turbopack? **Yes**

## 0.3 Determine site type

Based on the client questionnaire (Section 2) and business type:

- **Landing** (default): Service, Catalog, most Brand businesses. Single page with anchor sections.
- **Multi-page**: Showcase businesses with large portfolios, Accommodation with multiple rooms/properties, agencies, any client who explicitly requested multi-page.

This decision affects folder structure (Stage 1), navigation patterns (Stage 3), and content organization (Stage 4). Document the choice in the Visual Direction (Stage 2).

## 0.4 Git setup

`create-next-app` auto-initializes a git repo. Make the initial commit:

```bash
git add -A
git commit -m "Initial Next.js scaffold"
```

> **GitHub:** `gh` CLI is not currently installed. When the project is ready to deploy, the user will create the GitHub repo manually and push:
> ```bash
> git remote add origin <github-url>
> git push -u origin main
> ```

## 0.5 Template reference

The agent reads template files from `/Users/mac/labs/budapestlabs/templates/` as build instructions — they are NOT copied into the client project. The templates stay in budapestlabs:

- `templates/pipeline/STAGE-1-setup.md` through `STAGE-6-deploy.md` — build pipeline instructions
- `templates/pipeline/CLIENT.md` — questionnaire (fill with client data from 0.1)
- `templates/pipeline/CUSTOMIZATION.md` — design customization reference
- `templates/pipeline/RULES.md` — stack-specific constraints
- `templates/themes/*.css` — CSS theme files to copy into the project's `globals.css`

## 0.6 Proceed to Stage 1

You are now in `/Users/mac/labs/<project-name>`. Continue with [STAGE-1-setup.md](STAGE-1-setup.md) — install dependencies, create configs, set up the folder structure.
