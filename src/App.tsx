import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Sparkles,
  Gem,
  MapPin,
  Phone,
  MessageSquare,
  ShoppingBag,
  ChevronRight,
  Star,
  X,
  ChevronLeft,
  Plus,
  Minus,
  Heart,
  Check,
  Volume2,
  ArrowRight,
  ShieldAlert,
  Send,
  Sliders,
  Maximize2,
} from "lucide-react";
import {
  MENU_ITEMS,
  LUXURY_CATEGORIES,
  TESTIMONIALS,
  WHY_CHOOSE_US,
  INSTAGRAM_PHOTOS,
} from "./data";
import { MenuItem, CartItem, Message } from "./types";

export default function App() {
  // Navigation & States
  const [activeCategory, setActiveCategory] = useState<string>("Luxury Paan");
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [customizationText, setCustomizationText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // AI Concierge state
  const [conciergeMessages, setConciergeMessages] = useState<Message[]>([
    {
      role: "butler",
      text: "Salutations, Distinguished Guest. I am your Richie Rich virtual concierge, here at your service 24 hours a day, 7 days a week. How may I refine your selection this evening?",
      timestamp: new Date(),
    },
  ]);
  const [conciergeInput, setConciergeInput] = useState("");
  const [isConciergeTyping, setIsConciergeTyping] = useState(false);

  // Active testimonial slider index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);

  // Video/Hero transition state
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const logoImage = new URL("./assets/logo.png", import.meta.url).href;
  const heroBackgrounds = [
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=90&w=1600", // Paan Prep
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=90&w=1600", // Coffee Pour
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=90&w=1600", // Protein Shake
    "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&q=90&w=1600", // Premium Chocolates
  ];

  // Rotate hero background images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowSplash(false), 2400);
    return () => window.clearTimeout(timeout);
  }, []);

  // Show Toast helper
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle Favorite
  const toggleFavorite = (id: string, name: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
      triggerToast(`Removed ${name} from your wishlist.`);
    } else {
      setFavorites([...favorites, id]);
      triggerToast(`Added ${name} to your exclusive wishlist.`);
    }
  };

  // Add to Cart
  const addToCart = (item: MenuItem, quantity: number, custom: string = "") => {
    const existingIndex = cart.findIndex(
      (cartItem) =>
        cartItem.item.id === item.id && cartItem.customization === custom,
    );
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { item, quantity, customization: custom }]);
    }
    triggerToast(`Added ${quantity}x ${item.name} to your VIP Bag.`);
    setCustomizationText("");
    setSelectedProduct(null);
  };

  // Remove/update cart quantity
  const updateCartQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
      triggerToast("Removed item from VIP Bag.");
    }
    setCart(newCart);
  };

  // Checkout simulation
  const handleCheckout = () => {
    triggerToast(
      "Initiating secure private courier dispatch. Your receipt is prepared.",
    );
    setCart([]);
    setIsCartOpen(false);
  };

  // Call Concierge API
  const sendConciergeMessage = async () => {
    if (!conciergeInput.trim()) return;
    const userMsg: Message = {
      role: "user",
      text: conciergeInput,
      timestamp: new Date(),
    };
    setConciergeMessages((prev) => [...prev, userMsg]);
    const promptToSend = conciergeInput;
    setConciergeInput("");
    setIsConciergeTyping(true);

    try {
      // Create conversation history structure
      const history = conciergeMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToSend, history }),
      });
      const data = await res.json();

      setConciergeMessages((prev) => [
        ...prev,
        {
          role: "butler",
          text:
            data.text ||
            "Pardon me, my network is experiencing high security. Please let me assist you again.",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setConciergeMessages((prev) => [
        ...prev,
        {
          role: "butler",
          text: "Pardon me, esteemed guest. My connection to the central servers is temporarily suspended. May I suggest our signature 24K Royal Gold Paan while I resolve this?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsConciergeTyping(false);
    }
  };

  // Total price calculator
  const totalAmount = cart.reduce(
    (acc, current) => acc + current.item.price * current.quantity,
    0,
  );

  // Filtered Menu Items
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-noir text-[#e9e1d9] antialiased selection:bg-gold selection:text-noir overflow-hidden">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-noir"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.75, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center justify-center gap-4 px-6 py-8 rounded-3xl bg-noir/95 border border-gold/20 shadow-[0_0_80px_rgba(200,164,93,0.35)]"
            >
              <img
                src={logoImage}
                alt="Richie Rich Logo"
                className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_40px_rgba(200,164,93,0.55)]"
              />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center uppercase tracking-[0.35em] text-sm text-gold"
              >
                RICHIE RICH
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* BACKGROUND LUXURY PATTERN / NOISE */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,164,93,0.06),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(15,15,15,0.9),transparent_80%)] pointer-events-none z-0" />

      {/* FIXED HEADER / NAVIGATION */}
      <nav
        id="navbar"
        className="fixed top-0 left-0 w-full z-40 bg-noir/90 backdrop-blur-xl border-b border-gold/10 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-3 lg:px-5 h-14 flex justify-between items-center">
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center bg-noir p-1 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105">
              <img
                src={logoImage}
                alt="Richie Rich Logo"
                className="w-full h-full object-contain gold-glow"
              />
            </div>
            <div className="whitespace-nowrap">
              <span className="font-display text-sm md:text-base font-bold tracking-[0.12em] text-gold inline-block group-hover:text-gold-light transition-colors leading-none">
                RICHIE RICH
              </span>
              <span className="text-[8px] uppercase tracking-[0.18em] text-gray-500 block -mt-0.5 font-mono">
                24/7 Invisible Excellence
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="#about"
              className="text-[11px] font-medium text-gray-400 hover:text-gold transition-colors tracking-[0.18em] uppercase"
            >
              The Legend
            </a>
            <a
              href="#categories"
              className="text-[11px] font-medium text-gray-400 hover:text-gold transition-colors tracking-[0.18em] uppercase"
            >
              Bespoke Menu
            </a>
            <a
              href="#why-choose"
              className="text-[11px] font-medium text-gray-400 hover:text-gold transition-colors tracking-[0.18em] uppercase"
            >
              Our Pillars
            </a>
            <a
              href="#vault"
              className="text-[11px] font-medium text-gray-400 hover:text-gold transition-colors tracking-[0.18em] uppercase"
            >
              The Vault
            </a>
            <a
              href="#lounges"
              className="text-[11px] font-medium text-gray-400 hover:text-gold transition-colors tracking-[0.18em] uppercase"
            >
              Lounge Hours
            </a>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {/* Search query input */}
            <div className="relative hidden xl:block">
              <input
                type="text"
                placeholder="Search premium menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-noir-card text-[10px] border border-gold/25 rounded-full pl-3 pr-9 py-1.5 w-44 text-gold focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
              <Sparkles className="absolute right-2 top-2 w-3 h-3 text-gold/60" />
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-noir-card border border-gold/20 hover:border-gold hover:text-gold transition-all duration-300"
              aria-label="VIP Bag"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-[#e9e1d9] group-hover:text-gold" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-noir text-[9px] font-bold font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-noir animate-pulse">
                  {cart.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              )}
            </button>

            {/* AI Concierge floating button trigger */}
            <button
              onClick={() => setIsConciergeOpen(true)}
              className="relative hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/40 hover:bg-gold/20 transition-all text-gold text-[10px] font-mono uppercase tracking-[0.18em]"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span>24/7 Concierge</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - IMMERSIVE CINEMATIC BACKGROUND */}
      <section className="relative min-h-[120vh] md:min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden z-10 pt-20 pb-20">
        {/* Background Images with smooth transitions */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroImageIndex}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 0.35, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroBackgrounds[heroImageIndex]})`,
              }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/80 to-noir/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 mt-8 flex flex-col items-center">
          {/* Logo emblem */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-24 md:w-32 mb-6 pointer-events-none hover:scale-105 transition-transform duration-500"
          >
            <img
              src={logoImage}
              alt="Richie Rich Logo Crown"
              className="w-full object-contain gold-glow"
            />
          </motion.div>

          {/* 24/7 OPEN PILL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/45 mb-4 text-xs font-mono uppercase tracking-[0.25em] text-gold"
          >
            <span className="w-1.5 h-1.5 bg-gold rounded-full animate-ping"></span>
            <span>Serving Excellence 24×7</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-5xl md:text-8xl font-extrabold tracking-widest text-[#FFF] relative leading-tight"
          >
            RICHIE RICH
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"></span>
          </motion.h1>

          {/* Subtitle list */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 text-sm md:text-lg tracking-[0.2em] text-gray-300 font-display font-medium max-w-2xl uppercase"
          >
            Luxury Paan <span className="text-gold mx-1">•</span> Signature
            Protein Shakes <span className="text-gold mx-1">•</span> Artisan
            Coffee <span className="text-gold mx-1">•</span> Imported Chocolates
          </motion.p>

          {/* Luxury intro paragraph */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="mt-4 text-xs md:text-sm text-gray-400 font-sans max-w-xl leading-relaxed tracking-wide italic"
          >
            "A modern sanctuary where ancient royalty meets contemporary
            indulgence. Handcrafted recipes prepared continuously for the
            discerning connoisseur."
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center z-20"
          >
            <a
              href="#categories"
              className="px-8 py-3.5 rounded-full bg-gold hover:bg-gold-light text-noir font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_0_20px_rgba(200,164,93,0.3)] hover:shadow-[0_0_35px_rgba(200,164,93,0.6)] hover:-translate-y-0.5"
            >
              Explore Menu
            </a>

            <button
              onClick={() => {
                setIsConciergeOpen(true);
                triggerToast("Connected with Richie Rich Private Concierge.");
              }}
              className="px-8 py-3.5 rounded-full bg-noir-card border border-gold/40 hover:border-gold hover:bg-gold/5 text-gold font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Consult Concierge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative mt-16 md:mt-20 flex flex-col items-center cursor-pointer"
        >
          <a
            href="#about"
            className="text-[10px] uppercase tracking-[0.3em] text-gold/60 hover:text-gold transition-colors font-mono mb-2"
          >
            Scroll To Discover
          </a>
          <div className="w-5 h-8 rounded-full border border-gold/30 flex justify-center p-1">
            <div className="w-1 h-2 bg-gold rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: ABOUT RICHIE RICH */}
      <section
        id="about"
        className="relative py-24 px-6 border-t border-gold/10 z-10"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* About Text */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold block">
                The Heritage
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-widest text-[#FFF] leading-tight">
                AN UNCOMPROMISING PARADIGM OF LUXURY
              </h2>
              <div className="w-20 h-1 bg-gold"></div>
            </div>

            <p className="text-gray-300 font-sans leading-relaxed text-sm md:text-base">
              Richie Rich represents the intersection of gourmet heritage and
              contemporary lounge sophistication. Founded on the principle of
              "Invisible Excellence," we reject traditional, noisy street-side
              models in favor of a secluded, ultra-premium destination. Here,
              every ingredient is selected like rare gemstones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-gold/10 border border-gold/20 text-gold shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-wider text-gold uppercase">
                    Gilded Culinary Art
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Authentic 24K edible gold leaves, pure saffron infusions,
                    and Swiss precision baking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-gold/10 border border-gold/20 text-gold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-wider text-gold uppercase">
                    24/7 Elite Lounge
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Our kitchens, coffee bar, and lounge service run
                    uninterrupted, accommodating your private timetable.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <blockquote className="border-l-2 border-gold pl-4 py-2 italic text-gray-400 text-xs md:text-sm">
                "We do not merely handcraft paan or pull espresso; we organize
                moments of absolute peace for modern pioneers."
              </blockquote>
            </div>
          </div>

          {/* Graphic Mosaic */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Main image with golden border glow */}
              <div className="absolute inset-4 rounded-2xl overflow-hidden border border-gold/30 shadow-[0_0_30px_rgba(200,164,93,0.15)] bg-noir">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"
                  alt="Richie Rich Paan Preparation"
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Float badge 1 */}
              <div className="absolute -top-2 right-0 bg-noir-card backdrop-blur-md border border-gold/45 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
                <Gem className="w-5 h-5 text-gold animate-bounce" />
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gold">
                    Edible Gold
                  </div>
                  <div className="text-[11px] font-bold text-white">
                    24K Certified
                  </div>
                </div>
              </div>

              {/* Float badge 2 */}
              <div className="absolute -bottom-2 -left-2 bg-noir-card backdrop-blur-md border border-gold/45 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold animate-pulse" />
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gold">
                    Continuous Service
                  </div>
                  <div className="text-[11px] font-bold text-white">
                    Open 24 Hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PREMIUM CATEGORIES */}
      <section
        id="categories"
        className="relative py-24 px-6 bg-noir/40 border-t border-gold/10 z-10"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold">
              The Bespoke Catalog
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-widest text-white uppercase">
              PREMIUM CATEGORIES
            </h2>
            <div className="w-24 h-0.5 bg-gold mx-auto"></div>
            <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
              Select an exquisite genre below to view our hand-crafted,
              limited-run creations.
            </p>
          </div>

          {/* Category Tabs list */}
          <div className="flex overflow-x-auto gap-3 pb-8 no-scrollbar scroll-smooth justify-start px-4">
            {LUXURY_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 shrink-0 border ${
                    isActive
                      ? "bg-gold text-noir border-gold font-bold shadow-[0_0_15px_rgba(200,164,93,0.35)]"
                      : "bg-noir-card text-gray-400 border-gold/20 hover:border-gold/60 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            <AnimatePresence mode="popLayout">
              {filteredMenuItems.map((item) => {
                const isFavorite = favorites.includes(item.id);
                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group"
                  >
                    {/* Card Media */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-noir">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />

                      {/* Badge overlay */}
                      {item.badge && (
                        <div className="absolute top-4 left-4 bg-gold text-noir text-[9px] font-bold font-mono px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                          {item.badge}
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id, item.name);
                        }}
                        className="absolute top-4 right-4 p-2 rounded-full bg-noir-card/80 backdrop-blur-md border border-gold/20 text-gold hover:scale-110 active:scale-95 transition-all"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 ${isFavorite ? "fill-gold text-gold" : "text-[#e9e1d9]"}`}
                        />
                      </button>

                      {/* Overlaid quick customization hint */}
                      <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent opacity-60 pointer-events-none" />
                    </div>

                    {/* Card Details */}
                    <div className="p-6 flex flex-col flex-grow space-y-4">
                      {/* Name & price */}
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-display text-base font-bold text-white tracking-wide uppercase group-hover:text-gold transition-colors">
                          {item.name}
                        </h3>
                        <span className="font-mono text-gold font-bold text-sm bg-gold/10 px-3 py-1 rounded-full border border-gold/20 shrink-0">
                          ${item.price}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed flex-grow">
                        {item.description}
                      </p>

                      {/* Premium feature dots */}
                      {item.features && item.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-mono bg-noir px-2 py-1 rounded text-gold/80 border border-gold/10"
                            >
                              ★ {feature}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setCustomizationText("");
                          }}
                          className="flex-grow py-2.5 rounded-xl bg-gold/10 hover:bg-gold text-gold hover:text-noir text-xs font-mono font-bold tracking-wider uppercase border border-gold/30 hover:border-gold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <span>Bespoke Customize</span>
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => addToCart(item, 1)}
                          className="p-2.5 rounded-xl bg-gold hover:bg-gold-light text-noir transition-all"
                          aria-label="Add to VIP Bag"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty search fallback */}
            {filteredMenuItems.length === 0 && (
              <div className="col-span-full py-16 text-center glass-card rounded-2xl border border-gold/15 flex flex-col items-center justify-center space-y-4">
                <ShieldAlert className="w-12 h-12 text-gold/50" />
                <h3 className="font-display text-lg text-white font-semibold">
                  NO SPECIMENS LOCATED
                </h3>
                <p className="text-xs text-gray-500 max-w-md">
                  Our grand vault is temporarily empty of items matching your
                  particular query. Please filter by other premium categories
                  above.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("Luxury Paan");
                  }}
                  className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-lg text-xs font-mono text-gold hover:bg-gold/20 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: BEST SELLERS */}
      <section className="relative py-24 px-6 border-t border-gold/10 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold block">
                The Sovereign Selections
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-widest text-white uppercase">
                OUR BEST SELLERS
              </h2>
              <div className="w-16 h-1 bg-gold"></div>
            </div>
            <p className="text-gray-400 text-xs md:text-sm max-w-sm font-light leading-relaxed">
              These three crown jewels represent the absolute peak of modern
              luxury paan, coffee roasting, and high-nutrition wellness
              recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MENU_ITEMS.filter((x) => x.badge)
              .slice(0, 3)
              .map((item, index) => (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl overflow-hidden relative group flex flex-col h-full border border-gold/20 hover:border-gold transition-all duration-500"
                >
                  {/* Ranking Emblem */}
                  <div className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-gold text-noir flex items-center justify-center font-display font-bold text-xs shadow-lg">
                    0{index + 1}
                  </div>

                  {/* Hero image container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-noir">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent opacity-70" />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold block">
                      {item.category}
                    </span>
                    <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide group-hover:text-gold transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed flex-grow">
                      {item.description}
                    </p>

                    <div className="pt-2 flex justify-between items-center border-t border-gold/10">
                      <span className="font-mono text-sm font-bold text-gold">
                        ${item.price}
                      </span>
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="text-xs font-mono uppercase font-bold tracking-wider text-white hover:text-gold transition-colors flex items-center gap-1.5"
                      >
                        <span>Acquire Now</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY CHOOSE RICHIE RICH */}
      <section
        id="why-choose"
        className="relative py-24 px-6 bg-noir/50 border-t border-gold/10 z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold">
              Aristocratic Standards
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-widest text-white uppercase">
              THE RICHIE RICH PILLARS
            </h2>
            <div className="w-24 h-0.5 bg-gold mx-auto"></div>
            <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
              How we reinvented a traditional sweet heritage into a 24/7
              world-class gastronomic retreat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US.map((pillar, idx) => {
              // Map icons dynamically
              const IconComponent = () => {
                switch (pillar.icon) {
                  case "Clock":
                    return <Clock className="w-8 h-8 text-gold" />;
                  case "Sparkles":
                    return <Sparkles className="w-8 h-8 text-gold" />;
                  case "Gem":
                    return <Gem className="w-8 h-8 text-gold" />;
                  default:
                    return <ShieldAlert className="w-8 h-8 text-gold" />;
                }
              };

              return (
                <div
                  key={idx}
                  className="glass-card p-8 rounded-2xl border border-gold/15 flex flex-col space-y-4 hover:-translate-y-1 transition-transform"
                >
                  <div className="p-3 bg-gold/10 rounded-xl w-fit border border-gold/25">
                    <IconComponent />
                  </div>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: THE LUXURY VAULT / PRIVATE EVENTS */}
      <section
        id="vault"
        className="relative py-24 px-6 border-t border-gold/10 z-10 overflow-hidden"
      >
        {/* Absolute Background Graphics */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto glass-card rounded-3xl p-8 md:p-16 border border-gold/25 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-color-dodge"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800')",
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold bg-gold/10 px-4 py-1.5 rounded-full w-fit block border border-gold/20">
                The Vault Selection
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-widest text-white leading-tight">
                THE RICHIE RICH ULTRA-LOYALTY VAULT
              </h2>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                Unlock secure, private access to our most restricted culinary
                creations. This includes the exclusive seasonal white truffle
                chocolate collection, rare limited-roast geisha espresso lots,
                and private catering by our grand master chef at your estate or
                superyacht.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-xs text-gray-300 font-mono">
                    Guaranteed 24K Gold Sourcing
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-xs text-gray-300 font-mono">
                    Temperature-Controlled Delivery
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-xs text-gray-300 font-mono">
                    Bespoke Concierge Packaging
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsConciergeOpen(true);
                    triggerToast(
                      "Private Butler Concierge has been alerted to your request.",
                    );
                  }}
                  className="px-8 py-3.5 bg-gold hover:bg-gold-light text-noir font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg"
                >
                  Request Private Key Access
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 border border-gold/30 rounded-2xl flex items-center justify-center bg-noir/95 shadow-[0_0_50px_rgba(200,164,93,0.1)] group hover:border-gold transition-colors duration-500">
                <Gem className="w-24 h-24 text-gold/35 group-hover:text-gold transition-colors duration-500 animate-pulse" />
                <div className="absolute inset-x-0 bottom-6 text-center">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold">
                    Status: Restrictive
                  </span>
                  <p className="text-white text-xs font-bold mt-1 font-display">
                    VAULT CODE REQUIRED
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CUSTOMER TESTIMONIALS */}
      <section className="relative py-24 px-6 bg-noir/30 border-t border-gold/10 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold animate-pulse">
              Sovereign Appraisals
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-widest text-white uppercase">
              PATRON TESTIMONIALS
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto"></div>
          </div>

          <div className="relative glass-card p-8 md:p-12 rounded-3xl border border-gold/20 shadow-2xl">
            {/* Custom Quote Marks */}
            <span className="absolute -top-6 -left-2 text-[120px] text-gold/10 font-serif leading-none select-none">
              “
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 relative z-10"
              >
                {/* Rating stars */}
                <div className="flex gap-1 justify-center md:justify-start">
                  {[...Array(TESTIMONIALS[activeTestimonial].rating)].map(
                    (_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ),
                  )}
                </div>

                {/* Comment text */}
                <p className="text-sm md:text-base text-gray-200 leading-relaxed italic text-center md:text-left">
                  "{TESTIMONIALS[activeTestimonial].comment}"
                </p>

                {/* Patron Avatar & Name */}
                <div className="flex flex-col md:flex-row items-center gap-4 pt-4 border-t border-gold/10">
                  <img
                    src={TESTIMONIALS[activeTestimonial].avatar}
                    alt={TESTIMONIALS[activeTestimonial].name}
                    className="w-12 h-12 rounded-full border border-gold/30 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center md:text-left">
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                      {TESTIMONIALS[activeTestimonial].name}
                    </h4>
                    <span className="text-[10px] font-mono text-gold uppercase tracking-widest">
                      {TESTIMONIALS[activeTestimonial].role}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav Arrows */}
            <div className="absolute bottom-8 right-8 flex gap-2">
              <button
                onClick={() =>
                  setActiveTestimonial(
                    (prev) =>
                      (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                  )
                }
                className="p-2 rounded-full bg-noir hover:bg-gold/10 border border-gold/25 text-gold hover:text-white transition-all"
                aria-label="Previous Appraisal"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveTestimonial(
                    (prev) => (prev + 1) % TESTIMONIALS.length,
                  )
                }
                className="p-2 rounded-full bg-noir hover:bg-gold/10 border border-gold/25 text-gold hover:text-white transition-all"
                aria-label="Next Appraisal"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: INSTAGRAM INSTANT FEED */}
      <section className="relative py-24 px-6 border-t border-gold/10 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold">
              The Visual Chronicle
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-widest text-white uppercase">
              INSTAGRAM PORTRAIT
            </h2>
            <div className="w-20 h-0.5 bg-gold mx-auto"></div>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              A sensory preview of continuous excellence. Use hashtag{" "}
              <span className="text-gold font-mono">#RichieRichLuxe</span> to be
              chronicled.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {INSTAGRAM_PHOTOS.map((photo, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl overflow-hidden group bg-noir border border-gold/10 hover:border-gold transition-all duration-500"
              >
                <img
                  src={photo.url}
                  alt={photo.tag}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid stat hover */}
                <div className="absolute inset-0 bg-noir/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-3">
                  <span className="text-[10px] font-mono text-gold uppercase tracking-wider mb-2">
                    {photo.tag}
                  </span>
                  <div className="flex gap-4 text-[10px] font-mono text-white">
                    <span className="flex items-center gap-1">
                      ❤ {photo.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      💬 {photo.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: STORE LOCATION, CONTACT & MAP */}
      <section
        id="lounges"
        className="relative py-24 px-6 bg-noir/50 border-t border-gold/10 z-10"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Location details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold block">
                Bespoke Sanctuary
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-widest text-white uppercase">
                VISIT THE LOUNGE
              </h2>
              <div className="w-20 h-1 bg-gold"></div>
            </div>

            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              Our boutique parlor features an intimate modern fireplace,
              luxurious acoustic treatment, gold-leaf accents, secure VIP
              underground valet parking, and high-security access. No
              reservations required, though custom pairings can be ordered in
              advance.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                    The Golden Pavilion
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Suite 100, Imperial Heights Tower, Luxury Boulevard Phase-1
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                    Lounge Private Wire
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    +1 (800) RICHIE-247 / +91 99999 99999
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                    Operation Hours
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    24 Hours a Day / 7 Days a Week / 365 Days Uninterrupted
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-full bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500 text-emerald-400 hover:text-white transition-all duration-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Bespoke Dispatch</span>
              </a>
              <a
                href="tel:+919999999999"
                className="px-6 py-2.5 rounded-full bg-gold/10 hover:bg-gold border border-gold text-gold hover:text-noir transition-all duration-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call VIP Desk</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Map Mockup */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl overflow-hidden border border-gold/25 relative aspect-[16/10] bg-noir p-1.5 shadow-[0_0_40px_rgba(200,164,93,0.15)]">
              {/* Maps representation */}
              <div className="w-full h-full rounded-xl relative overflow-hidden flex items-center justify-center">
                {/* Elegant noir style map placeholder */}
                <div className="absolute inset-0 bg-[#0c0c0c] flex flex-col justify-center items-center p-6 pb-24 md:pb-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-gold animate-bounce" />
                  </div>
                  <h3 className="font-display text-white font-bold tracking-widest uppercase text-base">
                    RICHIE RICH HQ
                  </h3>
                  <p className="text-xs text-gold font-mono mt-1">
                    24/7 ULTRALUXURY LOUNGE PAVILION
                  </p>

                  {/* Subtle map line graphics */}
                  <svg
                    className="w-full h-48 absolute inset-0 opacity-15 pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,50 Q25,30 50,50 T100,50"
                      fill="none"
                      stroke="#C8A45D"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M10,0 L90,100"
                      fill="none"
                      stroke="#C8A45D"
                      strokeWidth="0.3"
                    />
                    <path
                      d="M0,90 L100,10"
                      fill="none"
                      stroke="#C8A45D"
                      strokeWidth="0.3"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="8"
                      fill="#C8A45D"
                      fillOpacity="0.4"
                    />
                    <circle cx="50" cy="50" r="3" fill="#C8A45D" />
                  </svg>

                  <div className="absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-6 bg-noir-card border border-gold/30 px-4 py-2.5 rounded-lg text-[11px] max-w-sm md:max-w-md w-full max-w-[90%] md:w-auto md:static md:translate-x-0 md:flex md:justify-center">
                    <p className="text-gray-300 font-mono">
                      Valet attendants stand ready at the Tower Entrance 24
                      hours a day to receive your vehicle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-noir text-gray-500 py-16 px-6 border-t border-gold/15 z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-4">
              <span className="font-display text-xl font-bold tracking-widest text-gold block">
                RICHIE RICH
              </span>
              <p className="text-xs text-gray-400 leading-relaxed">
                Reinventing authentic paan craft, specialized coffee, and
                upscale luxury lounge lifestyle continuous 24 hours.
              </p>
              <div className="text-[11px] font-mono text-gold uppercase tracking-widest">
                ★ CERTIFIED SEVEN-STAR STANDARD
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                The Experience
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#about"
                    className="hover:text-gold transition-colors"
                  >
                    The Legend Heritage
                  </a>
                </li>
                <li>
                  <a
                    href="#categories"
                    className="hover:text-gold transition-colors"
                  >
                    Gilded Menu Curations
                  </a>
                </li>
                <li>
                  <a
                    href="#why-choose"
                    className="hover:text-gold transition-colors"
                  >
                    Four Pillars of Quality
                  </a>
                </li>
                <li>
                  <a
                    href="#vault"
                    className="hover:text-gold transition-colors"
                  >
                    Private Vault Access
                  </a>
                </li>
              </ul>
            </div>

            {/* Culinary Category shortcuts */}
            <div className="space-y-4">
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Gourmet Curations
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#categories"
                    className="hover:text-gold transition-colors"
                  >
                    Luxury Edible Gold Paan
                  </a>
                </li>
                <li>
                  <a
                    href="#categories"
                    className="hover:text-gold transition-colors"
                  >
                    Signature Protein Recovery
                  </a>
                </li>
                <li>
                  <a
                    href="#categories"
                    className="hover:text-gold transition-colors"
                  >
                    Panama Geisha Micro-Lots
                  </a>
                </li>
                <li>
                  <a
                    href="#categories"
                    className="hover:text-gold transition-colors"
                  >
                    Swiss & Belgian Pralines
                  </a>
                </li>
              </ul>
            </div>

            {/* Luxury dispatch news */}
            <div className="space-y-4">
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                The Sovereign Dispatch
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Subscribe to private tasting alerts and seasonal menu releases.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  triggerToast("Privileged subscription finalized.");
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter private email address"
                  className="bg-noir-card border border-gold/25 rounded-lg px-3 py-1.5 text-xs text-gold flex-grow focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold-light text-noir px-3 rounded-lg font-bold text-xs"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gold/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono">
            <p>
              © 2026 Richie Rich Lounge Destination. All Rights Reserved.
              Prepared Continuously.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gold transition-colors">
                Terms of Sanctuary
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                Privacy Paradigm
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                Bespoke Protocol
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 24/7 PRIVATE AI CONCIERGE CHAT DRAWER */}
      <AnimatePresence>
        {isConciergeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-noir/80 backdrop-blur-md flex justify-end"
          >
            {/* Click outside target */}
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setIsConciergeOpen(false)}
            />

            {/* Chat Box */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="w-full max-w-md bg-noir border-l border-gold/25 h-full shadow-[0_0_50px_rgba(200,164,93,0.15)] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gold/15 flex justify-between items-center bg-noir-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-gold/45 bg-noir flex items-center justify-center p-1">
                    <img
                      src={logoImage}
                      alt="Concierge Crown"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                      The Private Butler
                    </h3>
                    <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Secure 24x7 Wire Active
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsConciergeOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gold/10 text-gold transition-colors"
                  aria-label="Close wire"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat wire instructions banner */}
              <div className="bg-gold/5 border-b border-gold/15 px-6 py-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="text-[10px] font-mono text-gold uppercase tracking-widest">
                  ASK FOR PARINGS, PAAN INGREDIENTS OR RECOMMENDATIONS
                </span>
              </div>

              {/* Chat History */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
                {conciergeMessages.map((msg, index) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1 px-1">
                        {isUser ? "Esteemed Guest" : "Private Butler"} •{" "}
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <div
                        className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                          isUser
                            ? "bg-gold text-noir font-medium rounded-tr-none"
                            : "bg-noir-card border border-gold/20 text-[#e9e1d9] rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isConciergeTyping && (
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-mono text-gold uppercase tracking-widest mb-1 animate-pulse">
                      Butler is pondering...
                    </span>
                    <div className="bg-noir-card border border-gold/20 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                      <span
                        className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Input */}
              <div className="p-4 border-t border-gold/15 bg-noir-card">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendConciergeMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={conciergeInput}
                    onChange={(e) => setConciergeInput(e.target.value)}
                    placeholder="Inquire about gold paan ingredients..."
                    className="flex-grow bg-noir border border-gold/20 rounded-xl px-4 py-3 text-xs text-gold focus:outline-none focus:border-gold placeholder:text-gray-600 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!conciergeInput.trim() || isConciergeTyping}
                    className="p-3 rounded-xl bg-gold text-noir hover:bg-gold-light transition-all disabled:opacity-40"
                    aria-label="Send wire"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[9px] text-center text-gray-500 font-mono mt-3">
                  RICHIE RICH PRIVILEGED CHAT SERVICE 24x7
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 24/7 PRIVATE SHOPPING BAG / CHECKOUT DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-noir/85 backdrop-blur-md flex justify-end"
          >
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setIsCartOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="w-full max-w-md bg-noir border-l border-gold/25 h-full shadow-[0_0_50px_rgba(200,164,93,0.15)] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gold/15 flex justify-between items-center bg-noir-card">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                    YOUR VIP DESPATCH BAG
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gold/10 text-gold transition-colors"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
                {cart.length > 0 ? (
                  cart.map((cartItem, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-6 border-b border-gold/10 items-start"
                    >
                      {/* Product thumbnail */}
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gold/20 shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      {/* Detail block */}
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider line-clamp-1">
                            {cartItem.item.name}
                          </h4>
                          <span className="font-mono text-xs text-gold font-bold shrink-0">
                            ${cartItem.item.price * cartItem.quantity}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          {cartItem.item.category}
                        </p>

                        {cartItem.customization && (
                          <div className="text-[10px] font-mono text-gold/80 italic bg-gold/5 p-1 px-2 rounded border border-gold/10">
                            Custom: {cartItem.customization}
                          </div>
                        )}

                        {/* Adjust qty */}
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => updateCartQuantity(index, -1)}
                            className="p-1 rounded bg-gold/10 hover:bg-gold/20 text-gold"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold text-white px-1.5">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(index, 1)}
                            className="p-1 rounded bg-gold/10 hover:bg-gold/20 text-gold"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                    <ShoppingBag className="w-16 h-16 text-gold/20 stroke-[1]" />
                    <h4 className="font-display text-white font-bold tracking-widest uppercase text-sm">
                      YOUR BAG IS VACANT
                    </h4>
                    <p className="text-xs text-gray-400 max-w-xs">
                      Select any gold paan, single-origin espresso, or chocolate
                      collection from our menu to begin your luxury dispatch
                      ritual.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2 bg-gold text-noir font-mono text-xs font-bold uppercase tracking-widest rounded-full shadow-lg"
                    >
                      Return to Menu
                    </button>
                  </div>
                )}
              </div>

              {/* Summary Block */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-gold/15 bg-noir-card space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Gourmet Subtotal</span>
                      <span className="text-white">${totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span>Courier Dispatch (Secure/Priority)</span>
                      <span className="text-gold uppercase font-bold">
                        Complimentary VIP
                      </span>
                    </div>
                    <div className="h-px bg-gold/15 my-2"></div>
                    <div className="flex justify-between text-sm font-display font-bold">
                      <span className="text-white">TOTAL VALUE</span>
                      <span className="text-gold">${totalAmount}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 rounded-full bg-gold hover:bg-gold-light text-noir font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl"
                  >
                    Confirm Private Dispatch
                  </button>
                  <p className="text-[9px] text-center text-gray-500 font-mono">
                    VALET DISPATCH 24/7 • COURIER ARRIVAL WITHIN 45 MINUTES
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED BESPOKE CUSTOMIZATION MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-noir/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-noir border border-gold/25 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gold/15 bg-noir-card flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gold block">
                    {selectedProduct.category}
                  </span>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                    {selectedProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 rounded-full hover:bg-gold/10 text-gold transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] no-scrollbar">
                {/* Product Info */}
                <div className="flex gap-4 items-start pb-4 border-b border-gold/10">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-24 h-24 rounded-lg object-cover border border-gold/20 shadow-md shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 leading-relaxed italic">
                      "{selectedProduct.description}"
                    </p>
                    <span className="font-mono text-sm text-gold font-bold block pt-1">
                      Unit Price: ${selectedProduct.price}
                    </span>
                  </div>
                </div>

                {/* Custom Options inputs */}
                <div className="space-y-4">
                  <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-gold" />
                    <span>Bespoke Instructions</span>
                  </h4>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                      Personalize Ingredients (e.g., Extra Gold Leaf, No Sweet
                      Supari, Warm/Cold Blend):
                    </label>
                    <textarea
                      value={customizationText}
                      onChange={(e) => setCustomizationText(e.target.value)}
                      placeholder="Specify your exact dining preference..."
                      className="w-full bg-noir-card border border-gold/20 rounded-xl p-3 text-xs text-gold focus:outline-none focus:border-gold placeholder:text-gray-600 font-mono h-24 resize-none"
                    />
                  </div>

                  {/* Suggestion tags */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">
                      Gourmet Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Extra 24K Gold Leaf",
                        "Low-Sugar Splenda",
                        "Double Shot Ristretto",
                        "Aged Saffron Reserve",
                        "French Vanilla Foam",
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setCustomizationText((prev) =>
                              prev ? `${prev}, ${tag}` : tag,
                            )
                          }
                          className="text-[9px] font-mono px-2.5 py-1 rounded bg-gold/10 border border-gold/20 text-gold hover:bg-gold/25 transition-all"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-6 border-t border-gold/15 bg-noir-card flex gap-4">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-grow py-3 rounded-xl bg-noir border border-gold/30 text-gold font-mono text-xs font-bold uppercase tracking-wider hover:bg-gold/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    addToCart(selectedProduct, 1, customizationText)
                  }
                  className="flex-grow py-3 rounded-xl bg-gold hover:bg-gold-light text-noir font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
                >
                  Confirm & Add to Bag
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATIC FLOATING CONCIERGE MARGIN ACTIONS */}
      <div className="fixed left-6 bottom-6 z-30 flex flex-col gap-3">
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-full bg-emerald-600 border border-emerald-500 text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl flex items-center justify-center hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
          title="WhatsApp Bespoke Wire"
        >
          <MessageSquare className="w-5 h-5" />
        </a>
        <a
          href="tel:+919999999999"
          className="p-3.5 rounded-full bg-gold border border-gold-light text-noir hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl flex items-center justify-center hover:shadow-[0_0_20px_rgba(200,164,93,0.5)]"
          title="VIP Private Line"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {/* CHAT BUBBLE QUICK ACTION ON RIGHT */}
      <div className="fixed right-6 bottom-6 z-30">
        <button
          onClick={() => {
            setIsConciergeOpen(true);
            triggerToast("Consulting Richie Rich Lounge Concierge.");
          }}
          className="p-4 rounded-full bg-noir border border-gold hover:border-gold-light hover:text-gold text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl flex items-center justify-center hover:shadow-[0_0_20px_rgba(200,164,93,0.4)] animate-bounce"
          title="Chat with Private Butler"
        >
          <Sparkles className="w-6 h-6 text-gold" />
        </button>
      </div>

      {/* SYSTEM TOAST ALERTS */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-noir border border-gold/50 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(200,164,93,0.25)] flex items-center gap-2 max-w-sm whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-gold shrink-0 animate-pulse" />
            <span className="text-xs text-white font-mono tracking-wide">
              {toast}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
