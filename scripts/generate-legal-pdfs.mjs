import PDFDocument from "pdfkit";
import { readFileSync, createWriteStream, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = join(root, "public", "legal");
const locales = ["en", "hu", "de"];

const docs = {
  privacy: {
    file: "privacy-policy.pdf",
    sectionKeys: [
      "controller",
      "collection",
      "basis",
      "purpose",
      "storage",
      "thirdparty",
      "rights",
    ],
  },
  terms: {
    file: "terms-of-service.pdf",
    sectionKeys: [
      "provider",
      "scope",
      "payment",
      "revisions",
      "delivery",
      "client",
      "ownership",
      "thirdparty",
      "cancellation",
      "warranty",
      "liability",
      "law",
    ],
  },
  imprint: {
    file: "imprint.pdf",
    sectionKeys: ["company", "contact", "responsible"],
  },
};

function writePdf(path, blocks) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = createWriteStream(path);
    doc.pipe(stream);

    for (const block of blocks) {
      if (block.type === "title") {
        doc.fontSize(20).font("Helvetica-Bold").text(block.text).moveDown();
      } else if (block.type === "meta") {
        doc
          .fontSize(10)
          .font("Helvetica")
          .fillColor("#666666")
          .text(block.text)
          .fillColor("#000000")
          .moveDown();
      } else if (block.type === "intro") {
        doc.fontSize(11).font("Helvetica").text(block.text).moveDown();
      } else if (block.type === "h2") {
        doc.moveDown(0.5).fontSize(13).font("Helvetica-Bold").text(block.text).moveDown(0.3);
      } else if (block.type === "p") {
        doc.fontSize(11).font("Helvetica").text(block.text).moveDown();
      }
    }

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

for (const locale of locales) {
  const messages = JSON.parse(
    readFileSync(join(root, "src/messages", `${locale}.json`), "utf8")
  );
  const legal = messages.legal;
  mkdirSync(join(outRoot, locale), { recursive: true });

  for (const [key, cfg] of Object.entries(docs)) {
    const section = legal[key];
    const blocks = [{ type: "title", text: section.title }];

    if (section.lastUpdated) {
      blocks.push({ type: "meta", text: section.lastUpdated });
    }
    if (section.intro) {
      blocks.push({ type: "intro", text: section.intro });
    }

    for (const sectionKey of cfg.sectionKeys) {
      const item = section.sections[sectionKey];
      blocks.push({ type: "h2", text: item.title });
      blocks.push({ type: "p", text: item.content });
    }

    const outPath = join(outRoot, locale, cfg.file);
    await writePdf(outPath, blocks);
    console.log(`Wrote ${outPath}`);
  }
}

console.log("Legal PDFs generated.");
