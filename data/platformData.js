const destinations = [
  {
    name: "Bali workation coast",
    location: "Canggu, Indonesia",
    weather: "29 C, breezy",
    match: 96,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&auto=format&fit=crop",
    tags: ["Surf mornings", "Villa stays", "Creator cafes"],
    href: "/search?q=Bali"
  },
  {
    name: "Himalayan slow travel",
    location: "Himachal Pradesh, India",
    weather: "18 C, clear",
    match: 92,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop",
    tags: ["Homestays", "Treks", "Local farms"],
    href: "/search?q=Himachal"
  },
  {
    name: "Tokyo culture sprint",
    location: "Tokyo, Japan",
    weather: "24 C, light rain",
    match: 89,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&auto=format&fit=crop",
    tags: ["Events", "Food walks", "Boutique hotels"],
    href: "/search?q=Tokyo"
  }
];

const experiences = [
  {
    title: "Sunrise ridge trek",
    type: "Adventure",
    location: "Manali",
    duration: "6 hours",
    price: 2400,
    score: 94,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop"
  },
  {
    title: "Old city food trail",
    type: "Culture",
    location: "Jaipur",
    duration: "3 hours",
    price: 1800,
    score: 91,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop"
  },
  {
    title: "Mangrove kayak safari",
    type: "Eco",
    location: "Goa",
    duration: "4 hours",
    price: 3200,
    score: 88,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop"
  }
];

const events = [
  {
    title: "Desert music weekend",
    date: "Jul 18",
    location: "Jaisalmer",
    price: 4999,
    demand: "High",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop"
  },
  {
    title: "Coastal chef's table",
    date: "Aug 03",
    location: "Kochi",
    price: 3499,
    demand: "Trending",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop"
  },
  {
    title: "Mountain film night",
    date: "Aug 22",
    location: "Leh",
    price: 2199,
    demand: "Limited",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop"
  }
];

const products = [
  {
    title: "Handwoven Kullu stole",
    maker: "Devi Loom Collective",
    location: "Kullu",
    price: 2600,
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&auto=format&fit=crop"
  },
  {
    title: "Blue pottery dinner set",
    maker: "Pink City Studio",
    location: "Jaipur",
    price: 3900,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop"
  },
  {
    title: "Single estate spice box",
    maker: "Malabar Harvest",
    location: "Wayanad",
    price: 1450,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop"
  }
];

const cartItems = [
  { label: "2 nights at Cedar Glasshouse", type: "Stay", price: 15800 },
  { label: "Sunrise ridge trek", type: "Activity", price: 2400 },
  { label: "Desert music weekend", type: "Event ticket", price: 4999 },
  { label: "Handwoven Kullu stole", type: "Marketplace", price: 2600 }
];

const roles = [
  {
    id: "tourist",
    label: "Tourist",
    metric: "AI trip score",
    value: "94",
    actions: ["Plan itinerary", "Book stays", "Save events", "Emergency SOS"]
  },
  {
    id: "host",
    label: "Host",
    metric: "Occupancy lift",
    value: "18%",
    actions: ["Manage stays", "Set availability", "Track payouts", "Improve eco score"]
  },
  {
    id: "vendor",
    label: "Vendor",
    metric: "Local sales",
    value: "Rs. 2.4L",
    actions: ["List products", "Bundle with trips", "Ship orders", "View demand"]
  },
  {
    id: "organizer",
    label: "Event Organizer",
    metric: "Tickets sold",
    value: "1,248",
    actions: ["Publish events", "Scan QR tickets", "Manage guests", "Track revenue"]
  },
  {
    id: "admin",
    label: "Admin",
    metric: "Trust queue",
    value: "12",
    actions: ["Moderate listings", "Review reports", "Manage roles", "Audit payments"]
  }
];

const impactMetrics = [
  { label: "Local income routed", value: "Rs. 42.8L", detail: "Host, guide, vendor, and organizer payouts" },
  { label: "Eco stays booked", value: "68%", detail: "Bookings with renewable energy or low-waste practices" },
  { label: "Community partners", value: "214", detail: "Verified small businesses across destinations" },
  { label: "Plastic avoided", value: "9.6k kg", detail: "Estimated from refill, transit, and stay choices" }
];

const itineraryLibrary = {
  nature: ["Eco homestay check-in", "Guided forest walk", "Local farm lunch", "Sunset viewpoint"],
  culture: ["Heritage walk", "Artisan studio visit", "Regional tasting menu", "Evening performance"],
  adventure: ["Trail briefing", "Ridge trek", "Kayak or cycling session", "Recovery spa"],
  luxury: ["Airport concierge", "Private villa arrival", "Chef-led dinner", "Curated boutique crawl"]
};

function buildItinerary(body = {}) {
  const destination = body.destination || "Himachal Pradesh";
  const vibe = body.vibe || "culture";
  const days = Math.min(Math.max(Number(body.days) || 4, 2), 10);
  const travelers = body.travelers || "2 travelers";
  const budget = body.budget || "Premium";
  const base = itineraryLibrary[vibe] || itineraryLibrary.culture;

  return {
    destination,
    vibe,
    days,
    travelers,
    budget,
    confidence: 93,
    route: `${destination} arrival -> verified stay -> local experiences -> marketplace pickup`,
    daysPlan: Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      title: base[index % base.length],
      weather: index % 2 === 0 ? "Best before 3 PM" : "Indoor backup ready",
      impact: index % 2 === 0 ? "Supports local guide network" : "Low-transfer route"
    }))
  };
}

module.exports = {
  destinations,
  experiences,
  events,
  products,
  cartItems,
  roles,
  impactMetrics,
  buildItinerary
};
