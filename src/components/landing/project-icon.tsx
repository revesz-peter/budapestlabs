import type { Project } from "@/lib/projects";

// 16×16 pixel art, same spirit as the Claude critter. Fixed colours: they read on the pastel tiles in both themes.
const colors: Record<string, string> = {
  R: "#A9553A", // terracotta
  r: "#7E3D28", // dark terracotta
  W: "#F4EBDC", // linen
  B: "#5E7F8C", // window
  D: "#5A3A28", // espresso
  G: "#7C8B4F", // olive
  Y: "#E8BD5F", // ochre
  S: "#8E8578", // stone
};

type IconName = Project["slug"] | "lock";

const icons: Record<IconName, string[]> = {
  // a family house
  palbau: [
    "................",
    ".......RR.......",
    "......RRRR......",
    ".....RRRRRR.....",
    "....RRRRRRRR....",
    "...RRRRRRRRRR...",
    "..RRRRRRRRRRRR..",
    ".RRRRRRRRRRRRRR.",
    "..WWWWWWWWWWWW..",
    "..WBBWWWWWWBBW..",
    "..WBBWWDDWWBBW..",
    "..WWWWWDDWWWWW..",
    "..WWWWWDDWWWWW..",
    "..WWWWWDDWWWWW..",
    "GGGGGGGGGGGGGGGG",
    "................",
  ],
  // a horseshoe
  gaited: [
    "................",
    "....RRRRRRRR....",
    "...RRRRRRRRRR...",
    "..RRR......RRR..",
    "..RY........YR..",
    "..RR........RR..",
    "..RR........RR..",
    "..RY........YR..",
    "..RR........RR..",
    "..RR........RR..",
    "..RY........YR..",
    "...RR......RR...",
    "...RRR....RRR...",
    "...rrr....rrr...",
    "................",
    "................",
  ],
  // a t-shirt with a star: thrift finds as quests
  thrift: [
    "................",
    "....RRR..RRR....",
    "...RRRRrrRRRR...",
    "..RRRRRRRRRRRR..",
    ".RRRRRRRRRRRRRR.",
    ".RRR.RRRRRR.RRR.",
    "..R..RRYYRR..R..",
    ".....RYYYYR.....",
    ".....RRYYRR.....",
    ".....RRRRRR.....",
    ".....RRRRRR.....",
    ".....RRRRRR.....",
    ".....RRRRRR.....",
    ".....rrrrrr.....",
    "................",
    "................",
  ],
  // a barcode inside scanner corners
  scanner: [
    "................",
    ".RRR........RRR.",
    ".R............R.",
    ".R.WWWWWWWWWW.R.",
    "...WDWDDWDWDW...",
    "...WDWDDWDWDW...",
    "...WDWDDWDWDW...",
    "...WDWDDWDWDW...",
    "...WDWDDWDWDW...",
    "...WDWDDWDWDW...",
    "...WWWWWWWWWW...",
    ".R............R.",
    ".R............R.",
    ".RRR........RRR.",
    "................",
    "................",
  ],
  // a padlock, for work under NDA
  lock: [
    "................",
    "......SSSS......",
    ".....SSSSSS.....",
    ".....SS..SS.....",
    ".....SS..SS.....",
    ".....SS..SS.....",
    "...RRRRRRRRRR...",
    "...RRRRRRRRRR...",
    "...RRRRYYRRRR...",
    "...RRRRYYRRRR...",
    "...RRRRYYRRRR...",
    "...RRRRRRRRRR...",
    "...RRRRRRRRRR...",
    "...rrrrrrrrrr...",
    "................",
    "................",
  ],
  // a graduation cap
  gradio: [
    "................",
    "................",
    ".......RR.......",
    ".....RRRRRR.....",
    "...RRRRRRRRRR...",
    ".RRRRRRRRRRRRRR.",
    "...RRRRRRRRRRRY.",
    ".....RRRRRR...Y.",
    "....rrRRRRrr..Y.",
    "....rrrrrrrr..Y.",
    "....rrrrrrrr.YY.",
    "....rrrrrrrr.YY.",
    ".....rrrrrr.....",
    "................",
    "................",
    "................",
  ],
};

// One path per colour: separate rects show hairline gaps as soon as the icon rotates
function toPaths(rows: string[]) {
  const paths: Record<string, string> = {};
  rows.forEach((row, y) =>
    [...row].forEach((pixel, x) => {
      if (pixel !== ".") paths[pixel] = `${paths[pixel] ?? ""}M${x} ${y}h1v1h-1z`;
    })
  );
  return Object.entries(paths);
}

export function ProjectIcon({ slug, className }: { slug: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {toPaths(icons[slug]).map(([pixel, d]) => (
        <path key={pixel} d={d} fill={colors[pixel]} />
      ))}
    </svg>
  );
}
