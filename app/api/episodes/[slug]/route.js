import { NextResponse } from "next/server";
import { getShowBySlug } from "@/lib/shows";
import { fetchEpisodesFromRss } from "@/lib/rss";

export async function GET(_req, { params }) {
  const p = await params;
  const slug = p?.slug;

  const show = getShowBySlug(slug);
  if (!show || !show.rss) {
    return NextResponse.json(
      { error: "Show not found or missing RSS feed." },
      { status: 404 }
    );
  }

  try {
    const episodes = await fetchEpisodesFromRss(show.rss, 25);
    return NextResponse.json({
      slug: show.slug,
      title: show.title,
      episodes,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch episodes.",
        details: String(err?.message || err),
      },
      { status: 500 }
    );
  }
}
