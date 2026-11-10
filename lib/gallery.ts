import fs from "node:fs";
import path from "node:path";

const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Photo folders (under public/projects) whose images feed a project's flipbook.
 * Drop a photo into one of these folders and it joins the book on the next build.
 */
const GALLERIES: Record<string, string[]> = {
  makerlabs: ["makerlabs/gallery", "cars-go-burr/gallery", "robo-expo/gallery"],
  "cars-go-burr": ["cars-go-burr/gallery"],
  "robo-expo": ["robo-expo/gallery"],
};

export type GalleryImage = { src: string; alt: string };

export function getGallery(slug: string): GalleryImage[] {
  const out: GalleryImage[] = [];
  for (const rel of GALLERIES[slug] ?? []) {
    const dir = path.join(process.cwd(), "public", "projects", rel);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
      if (!IMAGE.test(file)) continue;
      out.push({ src: `/projects/${rel}/${encodeURIComponent(file)}`, alt: "A photo from MakerLabs" });
    }
  }
  return out;
}

export type VideoItem = { src: string; poster: string; w: number; h: number };

/**
 * Videos for a project live in public/projects/<slug>/videos/ as NN.mp4 with a
 * matching NN.jpg poster, plus a manifest.json listing each file's size.
 */
export function getVideos(slug: string): VideoItem[] {
  const dir = path.join(process.cwd(), "public", "projects", slug, "videos");
  const manifest = path.join(dir, "manifest.json");
  if (!fs.existsSync(manifest)) return [];
  const items = JSON.parse(fs.readFileSync(manifest, "utf8")) as { file: string; w: number; h: number }[];
  return items.map((v) => ({
    src: `/projects/${slug}/videos/${v.file}`,
    poster: `/projects/${slug}/videos/${v.file.replace(/\.mp4$/i, ".jpg")}`,
    w: v.w,
    h: v.h,
  }));
}
