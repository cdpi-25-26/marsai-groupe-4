import { describe, it, expect } from "vitest";

// Test helper: extractYoutubeId (logic extracted for testing)
function extractYoutubeId(link) {
  if (!link) return "";
  try {
    if (link.includes("youtu.be/")) {
      return link.split("youtu.be/")[1].split(/[?&]/)[0];
    }
    if (link.includes("youtube.com/watch")) {
      const url = new URL(link);
      return url.searchParams.get("v") || "";
    }
    if (link.includes("youtube.com/embed/")) {
      return link.split("embed/")[1].split(/[?&]/)[0];
    }
  } catch {}
  if (/^[a-zA-Z0-9_-]{6,}$/.test(link)) return link;
  return "";
}

describe("extractYoutubeId", () => {
  it("extrait l'ID depuis youtu.be", () => {
    expect(extractYoutubeId("https://youtu.be/abc123XYZ")).toBe("abc123XYZ");
  });

  it("extrait l'ID depuis youtube.com/watch", () => {
    expect(extractYoutubeId("https://www.youtube.com/watch?v=def456ABC")).toBe("def456ABC");
  });

  it("extrait l'ID depuis embed URL", () => {
    expect(extractYoutubeId("https://www.youtube.com/embed/ghi789DEF")).toBe("ghi789DEF");
  });

  it("retourne l'ID direct si format valide", () => {
    expect(extractYoutubeId("abc123XYZ")).toBe("abc123XYZ");
  });

  it("retourne vide si link est null", () => {
    expect(extractYoutubeId(null)).toBe("");
  });

  it("retourne vide si link est vide", () => {
    expect(extractYoutubeId("")).toBe("");
  });
});
