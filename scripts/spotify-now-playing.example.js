/**
 * Spotify "now playing" — serverless handler (Vercel / Netlify style).
 *
 * Why a backend is required: the browser can never hold your Spotify refresh
 * token safely (anyone could read it and control your account). This function
 * keeps the token server-side, exchanges it for a short-lived access token on
 * each request, and returns only the safe, public fields your site needs.
 *
 * ── One-time setup ──────────────────────────────────────────────────────────
 * 1. Create an app at https://developer.spotify.com/dashboard
 *    Add a redirect URI (e.g. http://localhost:3000/callback).
 * 2. Get a refresh token with the `user-read-currently-playing` and
 *    `user-read-recently-played` scopes (do the auth-code flow once — plenty
 *    of small CLI helpers exist, or use the Spotify web console).
 * 3. Set these environment variables on your host (NOT prefixed REACT_APP_,
 *    so they stay server-only):
 *      SPOTIFY_CLIENT_ID
 *      SPOTIFY_CLIENT_SECRET
 *      SPOTIFY_REFRESH_TOKEN
 * 4. Deploy this file (e.g. as /api/now-playing) and point
 *    REACT_APP_NOWPLAYING_URL at its public URL.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;

  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const data = await res.json();
  return data.access_token;
}

function shapeTrack(item, isPlaying) {
  if (!item) return null;
  return {
    isPlaying,
    title: item.name,
    artist: (item.artists || []).map((a) => a.name).join(", "),
    album: item.album?.name,
    albumImageUrl: item.album?.images?.[0]?.url,
    songUrl: item.external_urls?.spotify ?? "#",
  };
}

module.exports = async function handler(req, res) {
  try {
    const token = await getAccessToken();
    const auth = { headers: { Authorization: `Bearer ${token}` } };

    // Currently playing first…
    const live = await fetch(NOW_PLAYING, auth);
    if (live.status === 200) {
      const data = await live.json();
      if (data?.item) {
        res.setHeader("Cache-Control", "public, s-maxage=30");
        return res.status(200).json(shapeTrack(data.item, Boolean(data.is_playing)));
      }
    }

    // …otherwise fall back to the most recently played track.
    const recent = await fetch(RECENT, auth);
    if (recent.status === 200) {
      const data = await recent.json();
      const item = data?.items?.[0]?.track;
      res.setHeader("Cache-Control", "public, s-maxage=300");
      return res.status(200).json(shapeTrack(item, false));
    }

    return res.status(200).json({});
  } catch (err) {
    return res.status(200).json({});
  }
};
