import { MenuItem, Testimonial } from "./types";

export const LUXURY_CATEGORIES = [
  "Luxury Paan",
  "Signature Protein Shakes",
  "Artisan Coffee",
  "Hot Beverages",
  "Cold Coffee",
  "Imported Chocolates",
  "Mocktails",
  "Desserts",
  "Seasonal Specials"
];

export const MENU_ITEMS: MenuItem[] = [
  // Luxury Paan
  {
    id: "paan-gold",
    name: "The 24K Royal Gold Paan",
    description: "Our crowning masterpiece. Premium betel leaf wrapped in 24-karat edible gold leaf, filled with organic Kashmiri saffron, house-infused rose petal preserve (gulkand), and premium slivered pistachios.",
    price: 150,
    category: "Luxury Paan",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600",
    badge: "Exclusively Royal",
    features: ["24K Edible Gold Leaf", "Organic Saffron Infusion", "Aged Gulkand"]
  },
  {
    id: "paan-pearl",
    name: "Madagascar Vanilla Pearl Paan",
    description: "Delicate betel leaf filled with candied fennel, crushed cardamom, roasted almonds, and genuine Madagascar vanilla bean pearls, offering a warm and modern sweet profile.",
    price: 85,
    category: "Luxury Paan",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600",
    badge: "Signature Classic"
  },
  {
    id: "paan-saffron",
    name: "Kashmiri Rose & Saffron Paan",
    description: "Saffron-soaked silver-dusted cardamom seeds paired with premium almond cream and freshly harvested Kashmiri red rose extract.",
    price: 95,
    category: "Luxury Paan",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    badge: "Popular Elite"
  },

  // Signature Protein Shakes
  {
    id: "shake-truffle",
    name: "The Gold Truffle Recovery Shake",
    description: "Highly refined grass-fed whey isolate whipped with house-made white truffle cream, cold-pressed almond milk, and dusted with golden cocoa powder. 45g of pure luxury protein.",
    price: 75,
    category: "Signature Protein Shakes",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600",
    badge: "Lounge Fit",
    features: ["Grass-fed Whey Isolate", "Genuine Black Truffle Oil", "45g Protein"]
  },
  {
    id: "shake-noir",
    name: "Belgian Noir Chocolate Shake",
    description: "Indulgent 85% Belgian dark chocolate blend with raw organic cacao nibs, maca root extract, and organic peanut butter. Clean energy, sophisticated taste.",
    price: 45,
    category: "Signature Protein Shakes",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600"
  },

  // Artisan Coffee
  {
    id: "coffee-geisha",
    name: "Single-Origin Geisha Hand-Drip",
    description: "Rare Panama Geisha beans hand-brewed over diamond-carved ice. Expresses delicate floral notes of jasmine, bergamot, and white peach sweetness.",
    price: 55,
    category: "Artisan Coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600",
    badge: "Limited Roast",
    features: ["Panama Geisha Micro-Lot", "92+ Coffee Score", "Pour-Over Mastery"]
  },
  {
    id: "coffee-gold-foam",
    name: "Richie Rich Gold Cappuccino",
    description: "Our signature blend espresso topped with velvety steamed milk foam and painted with a solid layer of shimmering 24K edible gold dust.",
    price: 35,
    category: "Artisan Coffee",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600",
    badge: "Instagram Icon"
  },

  // Hot Beverages
  {
    id: "hot-tea",
    name: "Royal Golden Saffron Kahwa",
    description: "Traditional Kashmiri green tea infused with organic saffron strands, cardamoms, cinnamon, and slivered organic pine nuts, served in high-fired luxury porcelain.",
    price: 40,
    category: "Hot Beverages",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600"
  },

  // Cold Coffee
  {
    id: "cold-affogato",
    name: "Bespoke Affogato Grand Cru",
    description: "House-churned organic vanilla bean gelato drowned in a freshly pulled double ristretto of our premium signature house blend.",
    price: 30,
    category: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1594911774802-8822a707cbb3?auto=format&fit=crop&q=80&w=600"
  },

  // Imported Chocolates
  {
    id: "chocolate-box",
    name: "The Richie Rich Praline Collection",
    description: "A private selection box of six artisanal chocolates from master Swiss and Belgian chocolatiers. Infused with pure organic lavender honey, Grand Marnier, and Himalayan pink salt.",
    price: 120,
    category: "Imported Chocolates",
    image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&q=80&w=600",
    badge: "Imported Direct",
    features: ["Aviation Transport Temp-controlled", "Swiss Master Chocolatier", "Belgian Grand Cru Filling"]
  },

  // Mocktails
  {
    id: "mocktail-amber",
    name: "Amber Gold Elixir",
    description: "A refreshing sensory blend of pressed organic yellow plums, cold-extracted white grape, ginger infusion, and gold leaf swirls.",
    price: 38,
    category: "Mocktails",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=600",
    badge: "Zero Proof"
  },

  // Desserts
  {
    id: "dessert-gold",
    name: "Golden Crème Brûlée",
    description: "Classic silk custard made with pure organic double cream and authentic Madagascar vanilla bean, crowned with a caramelized sugar glass disk and a gold foil rose petal.",
    price: 45,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?auto=format&fit=crop&q=80&w=600",
    badge: "Pastry Art"
  },

  // Seasonal Specials
  {
    id: "seasonal-white",
    name: "White Truffle Snow Affogato",
    description: "A seasonal sensation featuring white truffle ice cream, almond crumble, and a light hot white chocolate pour-over foam.",
    price: 60,
    category: "Seasonal Specials",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=600",
    badge: "Limited Winter Release"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Lord Alistair Sterling",
    role: "Collector & Lounge Patron",
    comment: "Richie Rich is not merely a destination; it is an immersive sensory experience. The Gold-Leaf Paan is absolute perfection, paired harmoniously with their Geisha cold brew. The ambient 24x7 service is exactly what upscale modern living dictates.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "2",
    name: "Victoria Fontaine",
    role: "Luxury Lifestyle Director",
    comment: "The Noir design language of this brand represents the pinnacle of hospitality. Their high-protein gold shake recovery after private training sessions has become my daily ritual. Absolute elegance in execution.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "3",
    name: "Devendra Rathore",
    role: "Royal Culinary Consultant",
    comment: "Handcrafting paan is a timeless heritage. To elevate it to the level of high-end Swiss chocolates and single-origin coffee with such sophisticated aesthetics is a stroke of absolute genius. Richie Rich stands unmatched.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  }
];

export const WHY_CHOOSE_US = [
  {
    title: "24/7 Exclusivity",
    description: "Our bespoke service never sleeps. Access our complete menu of handcrafted paan, shakes, and artisan coffee any hour of the day or night.",
    icon: "Clock"
  },
  {
    title: "Gold-Grade Ingredients",
    description: "From certified 24-karat edible gold leaves to rare Panama Geisha micro-lot beans and aged organic sweet gulkand.",
    icon: "Sparkles"
  },
  {
    title: "Master Craftsmanship",
    description: "Each paan and chocolate is prepared by hand with extreme precision, following a culinary philosophy inspired by haute couture fashion.",
    icon: "ShieldAlert"
  },
  {
    title: "Luxurious Lounge Atmosphere",
    description: "Designed like an upscale members-only club with high-end glassmorphism, private booths, secure parking, and premium concierge service.",
    icon: "Gem"
  }
];

export const INSTAGRAM_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600",
    likes: "2.4K",
    comments: "142",
    tag: "Artisan Pour"
  },
  {
    url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    likes: "4.1K",
    comments: "289",
    tag: "Royal Paan Prep"
  },
  {
    url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
    likes: "3.2K",
    comments: "190",
    tag: "Gourmet Chocolatier"
  },
  {
    url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600",
    likes: "1.8K",
    comments: "88",
    tag: "Bespoke Desserts"
  },
  {
    url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600",
    likes: "2.9K",
    comments: "155",
    tag: "Luxury Protein Shake"
  },
  {
    url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600",
    likes: "3.7K",
    comments: "210",
    tag: "Lounge Mixology"
  }
];
