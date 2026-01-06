function decodeCdata(value) {
  if (!value) return "";
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function pickTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(re);
  return decodeCdata(m?.[1]?.trim() || "");
}

function pickAttr(block, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*\\b${attr}="([^"]+)"[^>]*>`, "i");
  const m = block.match(re);
  return decodeCdata(m?.[1]?.trim() || "");
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePubDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function parseRss(xml, limit = 20) {
  const items = [];

  // Captivate/Podcast RSS should have <item> blocks, but this makes it tolerant.
  const itemBlocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];

  for (const block of itemBlocks.slice(0, limit)) {
    const title = pickTag(block, "title");
    const link = pickTag(block, "link") || pickTag(block, "guid");
    const pubDate = parsePubDate(pickTag(block, "pubDate"));
    const duration = pickTag(block, "itunes:duration") || pickTag(block, "duration");

    const enclosureUrl = pickAttr(block, "enclosure", "url");
    const image =
      pickAttr(block, "itunes:image", "href") ||
      pickAttr(block, "media:thumbnail", "url") ||
      pickAttr(block, "media:content", "url");

    const rawDesc =
      pickTag(block, "content:encoded") || pickTag(block, "description") || "";

    const description = stripHtml(decodeCdata(rawDesc));

    if (!title) continue;

    items.push({
      title,
      link,
      pubDate,
      duration,
      audioUrl: enclosureUrl || "",
      image: image || "",
      description,
    });
  }

  return items;
}

export async function fetchEpisodesFromRss(rssUrl, limit = 20) {
  const url = String(rssUrl || "").trim();
  if (!url) throw new Error("Missing RSS URL.");

  const res = await fetch(url, {
    next: { revalidate: 900 },
    headers: {
      "User-Agent": "BarracksMediaRSS/1.0 (+https://barracksmedia.com)",
      Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 120)}` : ""}`);
  }

  const xml = await res.text();
  const episodes = parseRss(xml, limit);

  if (!episodes.length) {
    // Help diagnose quickly if Captivate responds but structure differs
    throw new Error("RSS parsed but returned zero episodes (no <item> blocks found or unexpected format).");
  }

  return episodes;
}
