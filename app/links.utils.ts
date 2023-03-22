const maxSegmentsLength = 30;

export function shorten(link: string): string {
  const [protocol, address] = link.split("//");
  const [domain, ...segments] = address.split("/");

  let shortened = domain.replace("www.", "");

  for (const segment of segments) {
    if (shortened.length + segment.length > domain.length + maxSegmentsLength) {
      shortened += "/...";
      break;
    }
    shortened += `/${segment}`;
  }

  return shortened;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("shorten", () => {
    it("returns shortened links", () => {
      expect(shorten("http://localhost:3000")).toBe("localhost:3000");
      expect(shorten("https://www.youtube.com")).toBe("youtube.com");
      expect(shorten("https://example.com/videos?search=x")).toBe(
        "example.com/videos?search=x"
      );
      expect(
        shorten("https://example.com/videos/123456789012345678901234567890xxx")
      ).toBe("example.com/videos/...");
    });
  });
}
