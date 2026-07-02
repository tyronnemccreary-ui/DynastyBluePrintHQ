import { spawn } from "node:child_process";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

type OCRResult = {
  imagePath: string;
  transcriptPath: string;
  created: boolean;
  characterCount: number;
  error: string | null;
  visionSucceeded?: boolean;
};

type OCRReport = {
  generatedAt: string;
  totalScreenshotsProcessed: number;
  totalOCRTranscriptsCreated: number;
  emptyTranscripts: number;
  failedTranscripts: number;
  commonOCRIssues: string[];
  results: Array<Omit<OCRResult, "imagePath" | "transcriptPath"> & {
    imagePath: string;
    transcriptPath: string;
  }>;
};

const builderRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const inputDir = join(builderRoot, "input");
const outputDir = join(builderRoot, "output");
const swiftScript = join(builderRoot, "src/ocr-sidecar.swift");
const prestigeFolders = ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"] as const;
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".heic"]);

export async function generateOCRSidecars() {
  const imagePaths = await findImages();
  await mkdir(join(outputDir, ".swift-module-cache"), { recursive: true });
  const initialResults = imagePaths.length > 0 ? await runSwiftOCR(imagePaths) : [];
  const results = await ensureTranscriptSidecars(initialResults);
  const report = buildReport(results);

  await writeFile(
    join(outputDir, "ocr-transcript-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8"
  );

  return report;
}

async function ensureTranscriptSidecars(results: OCRResult[]) {
  return Promise.all(
    results.map(async (result) => {
      if (result.created) {
        return {
          ...result,
          visionSucceeded: true
        };
      }

      const fallbackTranscript = buildFallbackTranscript(result);
      await writeFile(result.transcriptPath, fallbackTranscript, "utf8");

      return {
        ...result,
        created: true,
        characterCount: fallbackTranscript.length,
        visionSucceeded: false
      };
    })
  );
}

function buildFallbackTranscript(result: OCRResult) {
  const folder = result.imagePath.split("/").at(-2) ?? "";
  const prestige = folder.match(/^([1-5]) Star$/)?.[1] ?? "Not Available";
  const school = result.imagePath
    .split("/")
    .at(-1)
    ?.replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() ?? "Not Available";

  return [
    "OCR Status: Failed",
    `OCR Error: ${result.error ?? "Unknown OCR error"}`,
    "Review Required: Yes",
    `School: ${school}`,
    `Team Prestige: ${prestige}`,
    "Conference: Not Available",
    "Mascot: Not Available",
    "Overall: Not Available",
    "Offense: Not Available",
    "Defense: Not Available",
    "Dynasty Points Total: Not Available",
    "Dynasty Points Allocated: Not Available",
    "Dynasty Points Used: Not Available",
    "Dynasty Points Available: Not Available"
  ].join("\n");
}

async function findImages() {
  const folderImages = await Promise.all(
    prestigeFolders.map(async (folder) => {
      const folderPath = join(inputDir, folder);
      const entries = await readdir(folderPath, { withFileTypes: true });

      return entries
        .filter(
          (entry) =>
            entry.isFile() && imageExtensions.has(extname(entry.name).toLowerCase())
        )
        .map((entry) => join(folderPath, entry.name));
    })
  );

  return folderImages.flat();
}

function runSwiftOCR(imagePaths: string[]) {
  return new Promise<OCRResult[]>((resolve, reject) => {
    const moduleCachePath = join(outputDir, ".swift-module-cache");
    const child = spawn("/usr/bin/swift", [swiftScript, ...imagePaths], {
      cwd: builderRoot,
      env: {
        ...process.env,
        CLANG_MODULE_CACHE_PATH: moduleCachePath
      }
    });
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk));
    child.on("error", reject);
    child.on("close", (code: number | null) => {
      if (code !== 0) {
        reject(
          new Error(
            `Swift OCR exited with code ${code}: ${Buffer.concat(stderrChunks).toString("utf8")}`
          )
        );
        return;
      }

      try {
        resolve(JSON.parse(Buffer.concat(stdoutChunks).toString("utf8")) as OCRResult[]);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function buildReport(results: OCRResult[]): OCRReport {
  const failed = results.filter((result) => !result.created);
  const failedVision = results.filter((result) => result.visionSucceeded === false);
  const empty = results.filter((result) => result.created && result.characterCount === 0);
  const commonOCRIssues = [
    ...(failedVision.length > 0
      ? ["Apple Vision OCR failed in this environment; fallback review transcripts were created."]
      : []),
    ...(failed.length > 0 ? ["Some transcript files could not be created."] : []),
    ...(empty.length > 0 ? ["Some OCR transcripts were empty."] : []),
    "OCR output is not trusted automatically; extraction still flags uncertain fields for review."
  ];

  return {
    generatedAt: new Date().toISOString(),
    totalScreenshotsProcessed: results.length,
    totalOCRTranscriptsCreated: results.filter((result) => result.created).length,
    emptyTranscripts: empty.length,
    failedTranscripts: failed.length,
    commonOCRIssues,
    results: results.map((result) => ({
      ...result,
      imagePath: relative(builderRoot, result.imagePath),
      transcriptPath: relative(builderRoot, result.transcriptPath)
    }))
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateOCRSidecars()
    .then((report) => {
      console.log(JSON.stringify(report, null, 2));
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
