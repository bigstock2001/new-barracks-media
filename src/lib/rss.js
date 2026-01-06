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

  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  for (const block of itemBlocks.slice(0, limit)) {
    const title = pickTag(block, "title");
    const link = pickTag(block, "link") || pickTag(block, "guid");
    const pubDate = parsePubDate(pickTag(block, "pubDate"));
    const duration =
      pickTag(block, "itunes:duration") || pickTag(block, "duration");

    const enclosureUrl = pickAttr(block, "enclosure", "url");
    const image =
      pickAttr(block, "itunes:image", "href") ||
      pickAttr(block, "media:thumbnail", "url") ||
      pickAttr(block, "media:content", "url");

    const rawDesc =
      pickTag(block, "content:encoded") ||
      pickTag(block, "description") ||
      "";

    const description = stripHtml(decodeCdata(rawDesc));

    // Skip junk rows
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
  const res = await fetch(rssUrl, {
    // Cache on Vercel a bit to reduce load; tweak later
    next: { revalidate: 900 },
    headers: {
      "User-Agent": "BarracksMediaRSS/1.0 (+https://barracksmedia.com)",
      Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
  });

  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  return parseRss(xml, limit);
}
