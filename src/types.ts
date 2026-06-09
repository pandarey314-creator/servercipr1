export interface Sneaker {
  id: string;
  name: string;
  reference: string;
  silhouette: string;
  colorway: string;
  releaseDate: string;
  designer: string;
  retailPrice: number;
  marketPrice: number;
  imageUrl: string;
  description: string;
  technology: string[];
  inventory: number;
  featured: boolean;
  rating: number;
  category?: string; // e.g. "Calzado Deportivo", "Electrónica & Gadgets", "Moda & Streetwear"
  catalog?: string;  // e.g. "Shoopy Express Directo", "Proveedor Premium Asia", etc.
  images?: string[]; // Array of 1 to 5 images for the product
  productUrl?: string; // Original URL of the product
}

export interface CartItem {
  sneaker: Sneaker;
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: {
    sneakerId: string;
    name: string;
    reference: string;
    price: number;
    size: string;
    quantity: number;
  }[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  status: string;
}

export interface DBAdjustment {
  id: string;
  timestamp: string;
  description: string;
  previousState: Sneaker[];
}

export interface ReplitStore {
  id: string;
  name: string;
  url: string;
  selected: boolean;
  lastSyncStatus: string;
  lastSyncTime: string;
}
