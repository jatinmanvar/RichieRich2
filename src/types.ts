export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
  features?: string[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  customization?: string;
}

export interface Message {
  role: "user" | "butler";
  text: string;
  timestamp: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

export type Category = 
  | "Luxury Paan"
  | "Signature Protein Shakes"
  | "Artisan Coffee"
  | "Hot Beverages"
  | "Cold Coffee"
  | "Imported Chocolates"
  | "Mocktails"
  | "Desserts"
  | "Seasonal Specials";
