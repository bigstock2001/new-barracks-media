"use client";

import { useMemo, useState } from "react";

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ShowEpisodes({ show, episodes }) {
  const safeEpisodes = Array.isArray(episodes) ? episodes : [];

  const firstPlayable = useMemo(() => {
    return safeEpisodes.find((e) => e.audioUrl) || safeEpisodes[0] || null;
  }, [safeEpisodes]);

  const [current, setCurrent] = useState(firstPlayable);

  const hasSubscribe = Boolean(show?.spotify || show?.apple);

  return (
    <>
      {hasSubscribe && (
        <section className="container-card section">
          <div className="subscribeHeader">
            <h2 className="h1" style={{ fontSize: 18 }}>
              Subscribe
            </h2>
            <p className="p" style={{ marginTop: 8 }}>
              The goal is simple: grow Spotify and Apple subscribers. Pick your platform.
            </p>
          </div>

          <div className="subscribeGrid">
            {show?.spotify && (
              <a className="subscribeCard" href={show.spotify} target="_blank" rel="noreferrer">
                <div className="subscribeIcon">♪</div>
                <div className="subscribeText">
                  <div className="subscribeTitle">Listen on Spotify</div>
                  <div className="subscribeSmall">Follow the show + turn on notifications</div>
                </div>
                <div className="subscribeArrow">→</div>
              </a>
            )}

            {show?.apple && (
              <a className="subscribeCard" href={show.apple} target="_blank" rel="noreferrer">
                <div className="subscribeIcon"></div>
                <div className="subscribeText">
                  <div className="subscribeTitle">Listen on Apple Podcasts</div>
                  <div className="subscribeSmall">Follow + leave a rating when you can</div>
                </div>
                <div className="subscribeArrow">→</div>
              </a>
            )}
          </div>
        </section>
      )}

      <section className="container-card section">
        <div className="episodesHeader">
          <h2 className="h1" style={{ fontSize: 18 }}>
            Episodes
          </h2>
          <div className="episodesMeta">
            {safeEpisodes.length ? `${safeEpisodes.length} loaded` : "No episodes found yet"}
          </div>
        </div>

        {current?.audioUrl ? (
          <div className="playerWrap">
            <div className="playerNow">
              <div className="playerLabel">Now Playing</div>
              <div className="playerTitle">{current.title}</div>
              <div className="playerSub">
                {current.pubDate ? formatDate(current.pubDate) : ""}
                {current.duration ? ` • ${current.duration}` : ""}
              </div>
            </div>

            <audio className="audioPlayer" controls preload="none" src={current.audioUrl} />

            <div className="playerActions">
              {current.link && (
                <a className="tab" href={current.link} target="_blank" rel="noreferrer">
                  Open episode page
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="p" style={{ marginTop: 10 }}>
            No playable audio URL found in the RSS feed yet.
          </p>
        )}

        <div className="divider" style={{ marginTop: 18, marginBottom: 18 }} />

        <div className="episodeList">
          {safeEpisodes.map((ep, idx) => {
            const active = current?.title === ep.title && current?.audioUrl === ep.audioUrl;
            return (
              <button
                key={`${ep.title}-${idx}`}
                className={`episodeCard ${active ? "episodeActive" : ""}`}
                onClick={() => setCurrent(ep)}
                type="button"
              >
                <div className="episodeLeft">
                  <div className="episodeTitle">{ep.title}</div>
                  <div className="episodeSub">
                    {ep.pubDate ? formatDate(ep.pubDate) : ""}
                    {ep.duration ? ` • ${ep.duration}` : ""}
                  </div>
                  {ep.description ? (
                    <div className="episodeDesc">{ep.description}</div>
                  ) : null}
                </div>

                <div className="episodeRight">
                  <div className="episodePlay">{active ? "Playing" : "Play"}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {show?.youtubePlaylist && (
        <section className="container-card section">
          <h2 className="h1" style={{ fontSize: 18 }}>
            Watch on YouTube
          </h2>
          <p className="p" style={{ marginTop: 10 }}>
            This show also has a YouTube playlist for video episodes.
          </p>

          <div className="youtubeWrap">
            <iframe
              className="youtubeFrame"
              src={`https://www.youtube.com/embed/videoseries?list=${new URL(show.youtubePlaylist).searchParams.get("list")}`}
              title={`${show.title} YouTube Playlist`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}
    </>
  );
}
