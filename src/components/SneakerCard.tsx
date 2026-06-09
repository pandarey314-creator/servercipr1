import React from "react";
import { Sneaker } from "../types";
import { motion } from "motion/react";
import { Star, Eye, Tag, ShoppingCart } from "lucide-react";

interface SneakerCardProps {
  key?: string;
  sneaker: Sneaker;
  onViewDetails: (sneaker: Sneaker) => void;
  onAddToCart: (sneaker: Sneaker) => void;
}

export default function SneakerCard({ sneaker, onViewDetails, onAddToCart }: SneakerCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const fallbackBase = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600";
    if (target.src === fallbackBase) return; // Prevent loop

    const cat = sneaker.category || "Calzado Deportivo";
    if (cat.includes("Ropa") || cat.includes("Moda") || cat.includes("Infantil")) {
      target.src = "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop";
    } else if (cat.includes("Reloj") || cat.includes("Smartwatch")) {
      target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop";
    } else if (cat.includes("Electrónica") || cat.includes("Gadget")) {
      target.src = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop";
    } else if (cat.includes("Hogar") || cat.includes("Decohogar")) {
      target.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop";
    } else {
      target.src = fallbackBase;
    }
  };

  return (
    <motion.div
      id={`sneaker-card-${sneaker.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-stone-700 flex flex-col group"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-950 flex items-center justify-center p-4">
        {/* Release Year Tag */}
        <div className="absolute top-3 left-3 z-10 bg-stone-900/95 backdrop-blur-sm border border-stone-800 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-stone-300 tracking-wider">
          {sneaker.releaseDate.substring(0, 4)}
        </div>

        {/* Style Reference Tag */}
        <div className="absolute top-3 right-3 z-10 bg-black/85 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono font-medium text-stone-400 group-hover:text-amber-500 transition-colors">
          Ref: {sneaker.reference}
        </div>

        {/* Main Product Image */}
        <img
          src={sneaker.imageUrl}
          alt={sneaker.name}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="object-cover w-full h-full rounded-md group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Hover Hover Overlay Action buttons */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            id={`btn-view-${sneaker.id}`}
            onClick={() => onViewDetails(sneaker)}
            className="p-3 bg-white hover:bg-stone-200 text-black rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
            title="Ver Detalles"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            id={`btn-add-cart-overlay-${sneaker.id}`}
            onClick={() => onAddToCart(sneaker)}
            disabled={sneaker.inventory === 0}
            className={`p-3 bg-amber-500 hover:bg-amber-400 text-black rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center ${sneaker.inventory === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Añadir al Carrito"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {sneaker.inventory === 0 && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600/90 text-white px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest font-bold border border-red-500">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-stone-400 tracking-wider uppercase">
              {sneaker.silhouette}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-mono font-bold text-stone-200">{sneaker.rating}</span>
            </div>
          </div>

          <h3 className="font-sans font-semibold text-base text-stone-100 line-clamp-2 tracking-tight group-hover:text-white transition-colors mb-2 min-h-[3rem]">
            {sneaker.name}
          </h3>

          <p className="text-xs text-stone-400 line-clamp-2 mb-4">
            {sneaker.description}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-stone-500 uppercase">Valor de Mercado</div>
            <div className="font-mono text-lg font-bold text-amber-400">
              {sneaker.marketPrice} €
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-stone-500 uppercase">Precio Original</div>
            <div className="font-mono text-sm text-stone-300 line-through">
              {sneaker.retailPrice} €
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
