/**
 * Curated Pressroom homepage content — the same real label content the
 * `d-press-gallery` prototype uses (press photos + cover art live under
 * `public/reference/`). Rendered as a graceful fallback whenever the database
 * is empty or unreachable, so the public face of the label never looks broken.
 *
 * Image paths are URL-encoded (spaces → %20) so they resolve when served from
 * `/reference/...`.
 */

export type HeroArtist = {
  name: string;
  slug: string;
  /** Press photo for the hero stage. */
  photo: string;
  loc?: string;
  genre?: string;
  bio?: string;
};

export type PressRelease = {
  title: string;
  slug: string;
  artist: string;
  cover: string;
  /** Vinyl · CD · Tape — physical format badge (optional). */
  format?: string;
  /** Short, human label e.g. "Mar 2026" or "2024". */
  date: string;
  featured?: boolean;
};

export type PressNewsItem = {
  title: string;
  slug: string;
  excerpt: string;
  /** Human label e.g. "June 17, 2026". */
  date: string;
  thumb: string;
  /** Full dispatch body (paragraphs split on blank lines), for the detail page. */
  body?: string;
};

export const PRESS_HERO_ARTISTS: HeroArtist[] = [
  {
    name: "Teenage Wrist",
    slug: "teenage-wrist",
    photo:
      "/reference/artists/Teenage%20Wrist/01-epitaph-press-photo-joe-calixto.png",
    loc: "Los Angeles, CA",
    genre: "Alternative / shoegaze",
    bio: "Fuzzed-out, melodic alt from Marshall Gallagher and Anthony Salazar — longtime Epitaph travelers.",
  },
  {
    name: "Mascara",
    slug: "mascara",
    photo: "/reference/artists/Mascara/04-press-photo-releasewave.jpg",
    loc: "Paris, France",
    genre: "Alt-gaze / heavy shoegaze",
    bio: "A Paris four-piece turning shoegaze heavy; debut LP 'Going Postal' arrived in 2026.",
  },
  {
    name: "Valley of Doves",
    slug: "valley-of-doves",
    photo: "/reference/artists/Valley%20of%20Doves/08-promo-r6i9710.jpg",
    loc: "Birmingham, AL",
    genre: "Post-hardcore",
    bio: "Birmingham, Alabama post-hardcore — patient and cathartic, built for the room's last song.",
  },
  {
    name: "Fly Over States",
    slug: "fly-over-states",
    photo: "/reference/artists/Fly%20Over%20States/05-press-photo-2024.jpg",
    loc: "Montana",
    genre: "Post-hardcore / screamo",
    bio: "A Montana screamo quartet — urgent, raw, and (yes) the band, not the country song.",
  },
  {
    name: "En Masse",
    slug: "en-masse",
    photo: "/reference/artists/En%20Masse/02-press-photo-frontview.jpg",
    loc: "Connecticut",
    genre: "Post-hardcore",
    bio: "Connecticut post-hardcore fronted by Zack Santiago; the 'newviolenttrends' EP, 2025.",
  },
  {
    name: "Muted Color",
    slug: "muted-color",
    photo: "/reference/artists/Muted%20Color/01-band-photo-bandcamp.jpg",
    loc: "Chicago, IL",
    genre: "Shoegaze / dream-pop",
    bio: "A Chicago five-piece washing dream-pop in shoegaze haze across 'Take I Lovely You' and 'Radial'.",
  },
];

export const PRESS_RELEASES: PressRelease[] = [
  {
    title: "Going Postal",
    slug: "going-postal",
    artist: "Mascara",
    cover: "/reference/artists/Mascara/03-going-postal-cover.jpg",
    format: "Vinyl",
    date: "Mar 2026",
    featured: true,
  },
  {
    title: "Constant Remembrance",
    slug: "constant-remembrance-of-wanting-nothing",
    artist: "Valley of Doves",
    cover: "/reference/artists/Valley%20of%20Doves/04-feverltd-cd-product.png",
    format: "CD",
    date: "Mar 2026",
  },
  {
    title: "Normal",
    slug: "normal",
    artist: "Dogs Run Free",
    cover: "/reference/artists/Dogs%20Run%20Free/03-normal-album-art.jpg",
    format: "Tape",
    date: "2024",
  },
  {
    title: "newviolenttrends",
    slug: "newviolenttrends",
    artist: "En Masse",
    cover: "/reference/artists/En%20Masse/04-album-art-newviolenttrends.jpg",
    format: "CD",
    date: "Jun 2025",
  },
  {
    title: "Ghosts",
    slug: "ghosts",
    artist: "Fly Over States",
    cover: "/reference/artists/Fly%20Over%20States/04-ghosts-cover-art.png",
    format: "CD",
    date: "May 2024",
  },
  {
    title: "Take I Lovely You",
    slug: "take-i-lovely-you",
    artist: "Muted Color",
    cover: "/reference/artists/Muted%20Color/03-take-i-lovely-you-cover.jpg",
    format: "Vinyl",
    date: "2023",
  },
  {
    title: "Radial",
    slug: "radial",
    artist: "Muted Color",
    cover: "/reference/artists/Muted%20Color/04-radial-cover.jpg",
    format: "Tape",
    date: "2023",
  },
];

export const PRESS_NEWS: PressNewsItem[] = [
  {
    title: "15,000 Streams in 48 Hours",
    slug: "chain-gang-15k-streams",
    excerpt:
      "The Chain Gang of 1974's new single landed on All New Rock and YouTube's Your New Alternative.",
    date: "June 17, 2026",
    thumb: "/reference/artists/Chain%20Gang%20of%201974/05-spotify-artist.jpg",
    body: "The Chain Gang of 1974's new single cleared 15,000 streams in its first 48 hours, picking up early adds on Spotify's All New Rock and YouTube's Your New Alternative.\n\nIt's the strongest opening week yet for Kamtin Mohager's synth-rock project — and a good omen for the run of records landing on Fever LTD this year.",
  },
  {
    title: "Mascara — 'Going Postal' Out Now",
    slug: "mascara-going-postal-out-now",
    excerpt: "The Paris shoegaze outfit's first full-length, pressed to vinyl.",
    date: "March 13, 2026",
    thumb: "/reference/artists/Mascara/03-going-postal-cover.jpg",
    body: "Mascara's debut LP 'Going Postal' is out now on Fever LTD, pressed to vinyl. The Paris four-piece turn shoegaze heavy across ten tracks — all blown-out low end and melody buried in the haze.\n\nThe vinyl is a limited pressing. When it's gone, it's gone.",
  },
  {
    title: "Valley of Doves on CD",
    slug: "valley-of-doves-on-cd",
    excerpt:
      "The Birmingham post-hardcore record 'Constant Remembrance of Wanting Nothing' arrives.",
    date: "March 1, 2026",
    thumb: "/reference/artists/Valley%20of%20Doves/04-feverltd-cd-product.png",
    body: "Valley of Doves' 'Constant Remembrance of Wanting Nothing' arrives on CD via Fever LTD. The Birmingham, Alabama post-hardcore band built this one patient and cathartic — made for the room's last song.\n\nPressed to CD and shipping now from the Fever LTD shop.",
  },
  {
    title: "Muted Color — 'Radial' Lands on Cassette",
    slug: "muted-color-radial-cassette",
    excerpt:
      "The Chicago dream-pop five-piece's 'Radial' gets a limited tape run.",
    date: "January 15, 2026",
    thumb: "/reference/artists/Muted%20Color/04-radial-cover.jpg",
    body: "Muted Color's 'Radial' is out on cassette via Fever LTD — a limited tape run for the Chicago five-piece washing dream-pop in shoegaze haze.\n\nIt follows their vinyl LP 'Take I Lovely You', also on the label.",
  },
  {
    title: "Muted Color — 'Take I Lovely You' on Vinyl",
    slug: "muted-color-take-i-lovely-you-vinyl",
    excerpt: "The Chicago band's full-length gets a Fever LTD vinyl pressing.",
    date: "November 1, 2025",
    thumb: "/reference/artists/Muted%20Color/03-take-i-lovely-you-cover.jpg",
    body: "Muted Color's 'Take I Lovely You' is out on vinyl via Fever LTD. The Chicago five-piece — Tom Aparici, David Bieschke, Tyler Gargula, Brandon Montemayor and Jethro Tacuboy — turn in their fullest statement yet.\n\nA limited pressing; grab one from the shop.",
  },
  {
    title: "The Chain Gang of 1974 — 'Honey Moon Drips'",
    slug: "chain-gang-honey-moon-drips",
    excerpt: "Signed and unsigned vinyl editions of the new record, out now.",
    date: "September 1, 2025",
    thumb: "/reference/artists/Chain%20Gang%20of%201974/04-bandcamp-profile.jpg",
    body: "'Honey Moon Drips' is out now on Fever LTD — the latest from label founder Kamtin Mohager's The Chain Gang of 1974, pressed to vinyl in signed and unsigned editions.\n\nSigned copies are strictly limited.",
  },
  {
    title: "Teenage Wrist — 'Dazed' Returns on Vinyl",
    slug: "teenage-wrist-dazed-remaster",
    excerpt:
      "The 2025 remaster lands in two color variants — Neon Green already sold out.",
    date: "July 1, 2025",
    thumb: "/reference/artists/Teenage%20Wrist/04-newnoise-by-joe-calixto.jpg",
    body: "Teenage Wrist's 'Dazed' returns as a 2025 remaster on Fever LTD, pressed in two color variants: a Neon Green / Black Swirl and an Opaque Neon Green.\n\nThe Neon Green / Black Swirl variant has already sold out. Opaque Neon Green remains while supplies last.",
  },
  {
    title: "En Masse — 'newviolenttrends' EP",
    slug: "en-masse-newviolenttrends",
    excerpt: "Connecticut post-hardcore from Zack Santiago and co., on CD.",
    date: "June 20, 2025",
    thumb: "/reference/artists/En%20Masse/04-album-art-newviolenttrends.jpg",
    body: "En Masse's 'newviolenttrends' EP is out on CD via Fever LTD. The Connecticut post-hardcore band — fronted by Zack Santiago — keep it urgent and direct across the EP.\n\nCDs are shipping now from the shop.",
  },
  {
    title: "Dogs Run Free — 'Normal' on Cassette",
    slug: "dogs-run-free-normal-tape",
    excerpt: "The Cleveland alt-rock duo's EP gets a Fever LTD tape pressing.",
    date: "September 1, 2024",
    thumb: "/reference/artists/Dogs%20Run%20Free/03-normal-album-art.jpg",
    body: "Dogs Run Free's 'Normal' EP is out on cassette via Fever LTD. The Cleveland, Ohio alt-rock duo of Austyn Benyak and Zac Breitbach keep it lean across the tape.\n\nLimited cassette run — available from the Fever LTD shop.",
  },
];
