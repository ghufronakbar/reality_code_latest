// --- Demo Video Preview ---
export function getVideoEmbed(url: string | undefined | null): string | null {
  if (!url) return null;
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id = url.match(/(?:v=|be\/)([\w-]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes("vimeo.com")) {
    const id = url.split("/").pop();
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return url;
}
