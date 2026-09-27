#!/usr/bin/env node
// Deja la imagen de una historia como la exige el build de mistorias-web:
// un JPEG real en stories/<slug>/principal.jpg. Convierte desde PNG (o desde
// cualquier formato que sharp lea) y ajusta tamaño y peso a los límites del
// sitio.
//
// Uso:
//   npm run imagen -- <imagen> [<slug>]
//
//   <imagen>  la imagen de origen: un PNG descargado, o un principal.jpg que
//             en realidad es PNG.
//   <slug>    el nombre de la historia sin .md. Se puede omitir si la imagen
//             ya está dentro de stories/<slug>/.
//
// Usa sharp, la misma librería con la que mistorias-web revisa la imagen: si
// aquí sale un JPEG válido, allá también. No necesita un checkout de
// mistorias-web.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Los mismos límites que story-image-requirements.ts en mistorias-web. Si
// allá cambian, hay que cambiarlos aquí.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION_PX = 4000;

const JPEG_QUALITY = 85;
// El JPEG no tiene transparencia: lo transparente de un PNG se rellena con el
// Off-White de la marca (fondo del modo claro) en vez de quedar negro.
const TRANSPARENT_FILL = "#f7f4ef";
const IMAGE_FILENAME = "principal.jpg";

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storiesDir = path.join(repoDir, "stories");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function resolveSlug(sourcePath, slugArgument) {
  if (slugArgument) {
    return slugArgument.replace(/\.md$/, "");
  }
  const parentDir = path.dirname(sourcePath);
  if (path.dirname(parentDir) === storiesDir) {
    return path.basename(parentDir);
  }
  fail(
    "no pude deducir la historia. Pasa el slug como segundo argumento:\n" +
      "  npm run imagen -- <imagen> <slug>"
  );
}

async function main() {
  const [sourceArgument, slugArgument] = process.argv.slice(2);
  if (!sourceArgument) {
    fail("falta la imagen de origen.\n  npm run imagen -- <imagen> [<slug>]");
  }

  const sourcePath = path.resolve(sourceArgument);
  if (!existsSync(sourcePath)) {
    fail(`no existe ${sourcePath}`);
  }

  const slug = resolveSlug(sourcePath, slugArgument);
  const storyPath = path.join(storiesDir, `${slug}.md`);
  if (!existsSync(storyPath)) {
    fail(
      `no existe la historia stories/${slug}.md. La carpeta de la imagen tiene ` +
        "que llamarse igual que su historia, o el build la rechaza."
    );
  }

  const targetPath = path.join(storiesDir, slug, IMAGE_FILENAME);
  // Se lee a memoria antes de escribir: origen y destino pueden ser el mismo
  // archivo (un principal.jpg que en realidad es PNG).
  const sourceBuffer = readFileSync(sourcePath);
  const sourceMetadata = await sharp(sourceBuffer).metadata();

  const output = await sharp(sourceBuffer)
    .rotate()
    .resize({
      width: MAX_IMAGE_DIMENSION_PX,
      height: MAX_IMAGE_DIMENSION_PX,
      fit: "inside",
      withoutEnlargement: true
    })
    .flatten({ background: TRANSPARENT_FILL })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  if (output.info.size > MAX_IMAGE_BYTES) {
    fail(
      `el JPEG resultante pesa ${output.info.size} bytes, más del máximo ` +
        `(${MAX_IMAGE_BYTES}). Reduce la imagen de origen y vuelve a intentarlo.`
    );
  }

  mkdirSync(path.dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, output.data);

  const written = await sharp(targetPath).metadata();
  if (written.format !== "jpeg") {
    fail(`${targetPath} no quedó como JPEG (se detectó "${written.format}").`);
  }

  // La carpeta de una historia solo admite principal.jpg: el original se va
  // si quedó dentro de ella con otro nombre.
  if (sourcePath !== targetPath && path.dirname(sourcePath) === path.dirname(targetPath)) {
    rmSync(sourcePath);
  }

  const relativeTarget = path.relative(repoDir, targetPath);
  console.log(
    `Listo: ${relativeTarget}\n` +
      `  ${sourceMetadata.format} ${sourceMetadata.width}x${sourceMetadata.height}, ` +
      `${sourceBuffer.length} bytes` +
      ` → jpeg ${written.width}x${written.height}, ${output.info.size} bytes\n` +
      "Recuerda declarar imageAlt, imageCredit e imageLicense en el frontmatter."
  );
}

main().catch((error) => fail(error.message));
