/* ==========================================================================
   DIGNITY ART EDGE — PRODUCT DATA
   This file is the site's mock database. In a real backend this would come
   from an API; here it is a plain JS array so the whole frontend can be
   demoed without a server. Every page (home, shop, product details, admin)
   reads from DAE_PRODUCTS / DAE_CATEGORIES below.

   Images: royalty-free placeholder photography served by picsum.photos,
   seeded per product so the same item always shows the same image.
   ========================================================================== */

const DAE_CATEGORIES = [
  { slug: "paintings",  name: "Paintings",        icon: "bi-palette" },
  { slug: "sculpture",  name: "Sculpture",         icon: "bi-gem" },
  { slug: "ceramics",   name: "Pottery & Ceramics", icon: "bi-cup-hot" },
  { slug: "textile",    name: "Textile Art",       icon: "bi-bezier2" },
  { slug: "prints",     name: "Prints & Posters",  icon: "bi-image" },
  { slug: "decor",      name: "Wall Decor",        icon: "bi-border-all" },
];

/* Helper: build a stable placeholder image URL for a given seed + size */
function daeImg(seed, w = 700, h = 875) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const DAE_PRODUCTS = [
  {
    id: "DAE-014", name: "Ochre Horizon", category: "paintings",
    price: 18500, oldPrice: 21000, rating: 4.8, reviews: 32, stock: 6,
    medium: "Oil on canvas", origin: "Jaipur, IN", year: 2023, dims: "76 × 102 cm",
    image: daeImg("ochre-horizon"), gallery: [daeImg("ochre-horizon"), daeImg("ochre-horizon-2"), daeImg("ochre-horizon-3")],
    badge: "bestseller", featured: true,
    description: "A sweeping abstract landscape built in layered ochre and burnt sienna, evoking the desert dusk outside Jaipur. Hand-finished with a cold-wax varnish for a soft, museum-grade sheen."
  },
  {
    id: "DAE-021", name: "Bronze Wanderer", category: "sculpture",
    price: 42000, rating: 4.9, reviews: 18, stock: 3,
    medium: "Cast bronze, patina finish", origin: "Udaipur, IN", year: 2022, dims: "34 cm tall",
    image: daeImg("bronze-wanderer"), gallery: [daeImg("bronze-wanderer"), daeImg("bronze-wanderer-2")],
    badge: "limited", featured: true,
    description: "A solitary figure cast in lost-wax bronze, finished with a hand-applied verdigris patina. Each piece carries small surface variations that mark it as one of a kind."
  },
  {
    id: "DAE-007", name: "Terracotta Moon Vase", category: "ceramics",
    price: 6800, rating: 4.6, reviews: 54, stock: 14,
    medium: "Stoneware, matte glaze", origin: "Khanapur, IN", year: 2023, dims: "28 cm tall",
    image: daeImg("moon-vase"), gallery: [daeImg("moon-vase"), daeImg("moon-vase-2")],
    badge: "new", featured: true,
    description: "Wheel-thrown stoneware vase glazed in a soft matte terracotta. Subtle thumb-ridges left visible from the throwing process celebrate the maker's hand."
  },
  {
    id: "DAE-033", name: "Indigo Loom Tapestry", category: "textile",
    price: 12400, rating: 4.7, reviews: 21, stock: 9,
    medium: "Hand-woven cotton & wool", origin: "Bagru, IN", year: 2023, dims: "120 × 180 cm",
    image: daeImg("indigo-tapestry"), gallery: [daeImg("indigo-tapestry"), daeImg("indigo-tapestry-2")],
    badge: "", featured: true,
    description: "A large-format wall tapestry hand-woven on a traditional pit loom, dyed in natural indigo with a hand-block geometric border."
  },
  {
    id: "DAE-045", name: "Marble Dust Folio Print", category: "prints",
    price: 3200, rating: 4.4, reviews: 40, stock: 25,
    medium: "Giclée print, archival paper", origin: "Studio edition", year: 2024, dims: "42 × 59 cm",
    image: daeImg("marble-folio"), gallery: [daeImg("marble-folio"), daeImg("marble-folio-2")],
    badge: "new", featured: false,
    description: "A limited giclée print reproducing an original marble-dust mixed media work, printed on 310gsm archival cotton rag for true tonal depth."
  },
  {
    id: "DAE-052", name: "Brass Sunburst Mirror", category: "decor",
    price: 9600, rating: 4.5, reviews: 29, stock: 11,
    medium: "Hand-forged brass, mirror glass", origin: "Moradabad, IN", year: 2023, dims: "60 cm dia.",
    image: daeImg("sunburst-mirror"), gallery: [daeImg("sunburst-mirror"), daeImg("sunburst-mirror-2")],
    badge: "", featured: false,
    description: "A statement wall mirror with hand-hammered brass rays, individually shaped and polished by metalsmiths working in small batches."
  },
  {
    id: "DAE-061", name: "Cobalt Tide Painting", category: "paintings",
    price: 24500, rating: 4.9, reviews: 16, stock: 4,
    medium: "Acrylic & ink on canvas", origin: "Goa, IN", year: 2024, dims: "90 × 120 cm",
    image: daeImg("cobalt-tide"), gallery: [daeImg("cobalt-tide"), daeImg("cobalt-tide-2")],
    badge: "new", featured: true,
    description: "Layers of cobalt and titanium white poured and dragged across raw canvas to suggest tidal motion, finished unframed for a contemporary gallery edge."
  },
  {
    id: "DAE-073", name: "Stoneware Tea Set", category: "ceramics",
    price: 5400, rating: 4.3, reviews: 47, stock: 18,
    medium: "Stoneware, reactive glaze", origin: "Pondicherry, IN", year: 2023, dims: "Set of 5",
    image: daeImg("tea-set"), gallery: [daeImg("tea-set"), daeImg("tea-set-2")],
    badge: "bestseller", featured: false,
    description: "A five-piece tea set thrown in small batches with a reactive glaze that yields a unique pooled finish on every cup and pot."
  },
  {
    id: "DAE-088", name: "Marble Torso Study", category: "sculpture",
    price: 56000, rating: 5.0, reviews: 9, stock: 2,
    medium: "Hand-carved Makrana marble", origin: "Makrana, IN", year: 2022, dims: "48 cm tall",
    image: daeImg("marble-torso"), gallery: [daeImg("marble-torso"), daeImg("marble-torso-2")],
    badge: "limited", featured: false,
    description: "A contemporary torso study hand-carved from Makrana marble, the same quarry that supplied stone for the Taj Mahal."
  },
  {
    id: "DAE-095", name: "Kantha Stitch Wall Hanging", category: "textile",
    price: 7200, rating: 4.6, reviews: 33, stock: 13,
    medium: "Vintage cotton, kantha embroidery", origin: "West Bengal, IN", year: 2023, dims: "90 × 140 cm",
    image: daeImg("kantha-hanging"), gallery: [daeImg("kantha-hanging"), daeImg("kantha-hanging-2")],
    badge: "", featured: false,
    description: "Up-cycled vintage saris layered and stitched in the running kantha technique, creating a richly textured, one-of-a-kind wall piece."
  },
  {
    id: "DAE-102", name: "Monsoon Botanical Print", category: "prints",
    price: 2800, rating: 4.2, reviews: 61, stock: 30,
    medium: "Risograph print", origin: "Studio edition", year: 2024, dims: "30 × 42 cm",
    image: daeImg("botanical-print"), gallery: [daeImg("botanical-print"), daeImg("botanical-print-2")],
    badge: "new", featured: false,
    description: "A two-colour risograph print of native monsoon foliage, hand-fed through the press for soft grain and registration shift."
  },
  {
    id: "DAE-110", name: "Copper Leaf Wall Panel", category: "decor",
    price: 15800, rating: 4.7, reviews: 14, stock: 7,
    medium: "Repoussé copper on teak", origin: "Srinagar, IN", year: 2023, dims: "60 × 90 cm",
    image: daeImg("copper-panel"), gallery: [daeImg("copper-panel"), daeImg("copper-panel-2")],
    badge: "", featured: false,
    description: "A relief panel hammered by hand using the repoussé technique, mounted on a solid teak backing for a substantial gallery presence."
  },
  {
    id: "DAE-119", name: "Saffron Field Diptych", category: "paintings",
    price: 31000, rating: 4.8, reviews: 11, stock: 5,
    medium: "Oil on linen, two panels", origin: "Pampore, IN", year: 2024, dims: "2 × 60 × 90 cm",
    image: daeImg("saffron-diptych"), gallery: [daeImg("saffron-diptych"), daeImg("saffron-diptych-2")],
    badge: "", featured: false,
    description: "A two-panel oil painting capturing saffron fields in bloom, designed to be hung with a 6cm gap for a striking diptych composition."
  },
  {
    id: "DAE-126", name: "Raku Fired Bowl Trio", category: "ceramics",
    price: 4100, rating: 4.4, reviews: 38, stock: 16,
    medium: "Raku-fired stoneware", origin: "Auroville, IN", year: 2023, dims: "Set of 3",
    image: daeImg("raku-bowls"), gallery: [daeImg("raku-bowls"), daeImg("raku-bowls-2")],
    badge: "bestseller", featured: false,
    description: "Three nesting bowls finished using the raku firing method, prized for its unpredictable crackle glaze and smoky black undertones."
  },
  {
    id: "DAE-133", name: "Driftwood & Bronze Bird", category: "sculpture",
    price: 13600, rating: 4.5, reviews: 22, stock: 8,
    medium: "Reclaimed driftwood, cast bronze", origin: "Kerala, IN", year: 2023, dims: "22 cm tall",
    image: daeImg("driftwood-bird"), gallery: [daeImg("driftwood-bird"), daeImg("driftwood-bird-2")],
    badge: "new", featured: false,
    description: "A small tabletop sculpture pairing a hand-cast bronze bird with a found piece of coastal driftwood, no two bases alike."
  },
  {
    id: "DAE-141", name: "Madder Root Quilt", category: "textile",
    price: 16200, rating: 4.9, reviews: 12, stock: 6,
    medium: "Block-printed cotton quilt", origin: "Bagru, IN", year: 2024, dims: "150 × 220 cm",
    image: daeImg("madder-quilt"), gallery: [daeImg("madder-quilt"), daeImg("madder-quilt-2")],
    badge: "limited", featured: false,
    description: "A reversible quilt hand-block-printed using natural madder root dye, hand-quilted in a traditional running stitch."
  },
  {
    id: "DAE-150", name: "Geometric Form Study Print", category: "prints",
    price: 2400, rating: 4.1, reviews: 27, stock: 40,
    medium: "Archival inkjet print", origin: "Studio edition", year: 2024, dims: "30 × 30 cm",
    image: daeImg("form-study"), gallery: [daeImg("form-study"), daeImg("form-study-2")],
    badge: "", featured: false,
    description: "Part of a numbered edition exploring repeated geometric form, printed on matte archival stock with deckled edges."
  },
  {
    id: "DAE-158", name: "Hand-Knotted Wool Wall Rug", category: "decor",
    price: 19800, rating: 4.8, reviews: 19, stock: 5,
    medium: "Hand-knotted wool", origin: "Bhadohi, IN", year: 2023, dims: "90 × 150 cm",
    image: daeImg("wool-rug"), gallery: [daeImg("wool-rug"), daeImg("wool-rug-2")],
    badge: "bestseller", featured: false,
    description: "A wall-mountable rug hand-knotted at roughly 100 knots per square inch, designed as much for the wall as the floor."
  },
  {
    id: "DAE-167", name: "Vermilion Study No. 4", category: "paintings",
    price: 14200, rating: 4.6, reviews: 24, stock: 10,
    medium: "Acrylic on board", origin: "Mumbai, IN", year: 2024, dims: "50 × 70 cm",
    image: daeImg("vermilion-study"), gallery: [daeImg("vermilion-study"), daeImg("vermilion-study-2")],
    badge: "new", featured: false,
    description: "Fourth in a series of colour-field studies exploring vermilion against raw board, sealed with a museum-grade UV varnish."
  },
  {
    id: "DAE-174", name: "Smoked Clay Incense Tower", category: "ceramics",
    price: 2100, rating: 4.3, reviews: 66, stock: 22,
    medium: "Smoke-fired clay", origin: "Khanapur, IN", year: 2023, dims: "18 cm tall",
    image: daeImg("incense-tower"), gallery: [daeImg("incense-tower"), daeImg("incense-tower-2")],
    badge: "", featured: false,
    description: "A sculptural incense holder finished through pit-smoking, leaving organic black flame marks unique to each firing."
  },
  {
    id: "DAE-182", name: "Welded Steel Lotus", category: "sculpture",
    price: 27500, rating: 4.7, reviews: 13, stock: 4,
    medium: "Welded steel, brushed finish", origin: "Jodhpur, IN", year: 2023, dims: "70 cm dia.",
    image: daeImg("steel-lotus"), gallery: [daeImg("steel-lotus"), daeImg("steel-lotus-2")],
    badge: "", featured: false,
    description: "A large welded-steel lotus form for wall or pedestal display, hand-ground to a brushed satin finish."
  },
  {
    id: "DAE-190", name: "Sun-Dyed Linen Runner", category: "textile",
    price: 3600, rating: 4.4, reviews: 35, stock: 28,
    medium: "Sun-dyed linen", origin: "Auroville, IN", year: 2024, dims: "35 × 220 cm",
    image: daeImg("linen-runner"), gallery: [daeImg("linen-runner"), daeImg("linen-runner-2")],
    badge: "new", featured: false,
    description: "A table runner dyed using a slow sun-exposure technique with botanical pigments, each metre subtly different in tone."
  },
  {
    id: "DAE-198", name: "Architectural Line Print Set", category: "prints",
    price: 4600, rating: 4.5, reviews: 20, stock: 17,
    medium: "Set of 3 giclée prints", origin: "Studio edition", year: 2024, dims: "3 × 21 × 30 cm",
    image: daeImg("line-print-set"), gallery: [daeImg("line-print-set"), daeImg("line-print-set-2")],
    badge: "", featured: false,
    description: "A trio of minimal architectural line studies, sold as a matched set for a gallery wall grouping."
  },
  {
    id: "DAE-205", name: "Hammered Brass Wall Sconce Pair", category: "decor",
    price: 8200, rating: 4.6, reviews: 31, stock: 12,
    medium: "Hand-hammered brass", origin: "Moradabad, IN", year: 2023, dims: "Pair, 24 cm each",
    image: daeImg("brass-sconce"), gallery: [daeImg("brass-sconce"), daeImg("brass-sconce-2")],
    badge: "bestseller", featured: false,
    description: "A pair of wall sconces hand-hammered from raw brass sheet, sold together for symmetrical placement."
  },
];

/* Convenience lookups used throughout the app */
function daeGetProductById(id) {
  return DAE_PRODUCTS.find((p) => p.id === id);
}
function daeGetCategory(slug) {
  return DAE_CATEGORIES.find((c) => c.slug === slug);
}
function daeRelatedProducts(product, limit = 4) {
  return DAE_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}
