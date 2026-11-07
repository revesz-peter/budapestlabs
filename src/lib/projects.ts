// To add a project: an entry here, a screenshot in public/projects/ (any proportions: imageSize keeps it uncropped), a pixel icon in project-icon.tsx, and projects.items.<slug> in all 3 message files.
// url: the live site, or null to leave the link out of the modal.
// image: null shows the pixel icon large instead; tech: [] hides that block. Only list tech the project really uses.
// status: a key under projects.status, shown in the modal. "building" = not launched yet: those are named "Project <one word>".
export const projects = [
  {
    slug: "palbau",
    url: "https://palbau-hazak.vercel.app",
    image: "/projects/palbau.jpg",
    imageSize: [2880, 1800],
    tint: "bg-ochre/55",
    tech: ["Next.js", "Three.js", "Resend", "Vercel"],
    status: null,
  },
  {
    slug: "gaited",
    url: "https://gaited-monorepo.vercel.app",
    image: "/projects/gaited.jpg",
    imageSize: [2400, 1499],
    tint: "bg-olive/55",
    tech: ["Next.js", "Neon Postgres", "Neon Auth", "Drizzle", "Vercel"],
    status: "preflight",
  },
  {
    slug: "gradio",
    url: null,
    image: "/projects/gradio.jpg",
    imageSize: [2400, 1433],
    tint: "bg-moss/55",
    tech: ["Next.js", "Expo", "tRPC", "Better Auth", "Neon"],
    status: "building",
  },
  {
    slug: "thrift",
    url: null,
    image: null,
    imageSize: null,
    tint: "bg-clay/55",
    tech: [],
    status: "building",
  },
  {
    slug: "scanner",
    url: null,
    image: null,
    imageSize: null,
    tint: "bg-sand",
    tech: [],
    status: "building",
  },
] as const;

export type Project = (typeof projects)[number];

// Work we can't talk about: a square with a lock, no modal and no details.
export const lockedProjects = [{ key: "nda-1", tint: "bg-stone/55" }] as const;
