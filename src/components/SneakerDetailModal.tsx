import { useState, useEffect } from "react";
import { Sneaker } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, User, Tag, ShieldCheck, Heart, Sparkles, Check, ShoppingCart } from "lucide-react";
import { getOptionsForCategory } from "../shoopyService";

const DEFAULT_OPTIONS = ["Estándar", "Edición Premium", "Lote de Ahorro x2"];

interface SneakerDetailModalProps {
  sneaker: Sneaker | null;
  onClose: () => void;
  onAddToCartWithSize: (sneaker: Sneaker, size: string) => void;
  isAlreadyInDb?: boolean;
  onImportToDatabase?: (sneaker: Sneaker) => void;
}

export default function SneakerDetailModal({
  sneaker,
  onClose,
  onAddToCartWithSize,
  isAlreadyInDb = false,
  onImportToDatabase
}: SneakerDetailModalProps) {
  const options = sneaker?.category 
    ? getOptionsForCategory(sneaker.category)
    : DEFAULT_OPTIONS;

  const [selectedSize, setSelectedSize] = useState<string>(options[0] || "Estándar");
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Sync size selection state when a new product is selected
  useEffect(() => {
    if (sneaker) {
      const activeOptions = sneaker.category 
        ? getOptionsForCategory(sneaker.category)
        : DEFAULT_OPTIONS;
      setSelectedSize(activeOptions[0] || "Estándar");
    }
  }, [sneaker]);

  if (!sneaker) return null;

  const handleAddToCart = () => {
    onAddToCartWithSize(sneaker, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 2000);
  };

  // Determine label titles based on category
  const selectionTitle = "Elegir Variante / Presentación";
  const designerTitle = "Firma / Distribuidor";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal content container */}
        <motion.div
          id={`sneaker-modal-container-${sneaker.id}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row z-10"
        >
          {/* Close Button */}
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white p-2 rounded-full border border-stone-700 backdrop-blur-sm transition-all shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Picture Canvas & Detailed specs */}
          <div className="w-full md:w-1/2 bg-stone-950 p-6 flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-stone-800">
            {/* Spotlight Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

            <div className="relative w-full aspect-square flex items-center justify-center">
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={sneaker.imageUrl}
                alt={sneaker.name}
                referrerPolicy="no-referrer"
                className="max-h-[350px] object-contain rounded-lg drop-shadow-[0_15px_35px_rgba(245,158,11,0.2)]"
              />
            </div>

            {/* Simulated Multi-Angle Angles indicator */}
            <div className="flex gap-2.5 mt-4 z-10">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
            </div>

            {/* Quick Metadata Rib */}
            <div className="grid grid-cols-2 gap-4 w-full mt-6 bg-stone-900/60 p-4 rounded-xl border border-stone-800/80 text-xs font-mono">
              <div className="flex items-center gap-2 text-stone-300">
                <Calendar className="w-4 h-4 text-amber-500 uppercase shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase">Lanzamiento</span>
                  <span>{sneaker.releaseDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-300">
                <User className="w-4 h-4 text-amber-500 uppercase shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase">{designerTitle}</span>
                  <span className="truncate max-w-[120px] inline-block">{sneaker.designer}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Description, Sizes, Purchase controls */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Reference SKU & Silhouette */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono px-2.5 py-1 bg-stone-800 border border-stone-700 rounded-md text-stone-400 tracking-wider">
                  Código SKU: {sneaker.reference}
                </span>
                <span className="text-[11px] font-mono font-bold tracking-widest text-amber-500 uppercase">
                  {sneaker.silhouette}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-sans font-bold text-white tracking-tight mb-3">
                {sneaker.name}
              </h2>

              {/* Price Panel */}
              <div className="flex items-end gap-4 mb-4 pb-4 border-b border-stone-800">
                <div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest leading-none mb-1">
                    Precio Reventa Mínimo
                  </div>
                  <span className="text-3xl font-mono font-bold text-amber-400">
                    {sneaker.marketPrice} €
                  </span>
                </div>
                <div className="mb-1">
                  <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest leading-none mb-1">
                    Precio Retail Inicial
                  </div>
                  <span className="text-stone-400 font-mono text-sm line-through">
                    {sneaker.retailPrice} €
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-5">
                <h4 className="text-xs uppercase font-mono text-stone-300 tracking-wider mb-2">
                  Especificación de Catálogo
                </h4>
                <p className="text-sm text-stone-400 leading-relaxed">
                  {sneaker.description}
                </p>
              </div>

              {/* Technology badges */}
              <div className="mb-6">
                <h4 className="text-xs uppercase font-mono text-stone-300 tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Especificaciones Técnicas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {sneaker.technology.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-stone-950 text-stone-300 px-2.5 py-1 rounded-md border border-stone-800 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Colorway Info */}
              <div className="mb-6 bg-stone-950 p-3.5 rounded-lg border border-stone-800 text-xs flex justify-between items-center font-mono">
                <span className="text-stone-500 uppercase">Combinación de Colores:</span>
                <span className="text-stone-200 font-semibold">{sneaker.colorway}</span>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <h4 className="text-xs uppercase font-mono text-stone-300 tracking-wider">
                    {selectionTitle}
                  </h4>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {sneaker.category === "Electrónica & Gadgets" ? "Garantía oficial" : sneaker.category === "Moda & Streetwear" ? "Ajuste standard" : "Unisex / US & EU"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {options.map((size) => (
                    <button
                      key={size}
                      id={`btn-size-${size.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setSelectedSize(size)}
                      className={`text-[12px] font-mono py-2 rounded-lg border transition-all ${
                        selectedSize === size
                          ? "bg-amber-500 border-amber-500 text-black font-semibold shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                          : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permanent Database Import Toggle */}
              {sneaker.id.startsWith("shoopy") && (
                <div className="mt-3 mb-5 bg-stone-950 p-4 rounded-xl border border-stone-800/80 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isAlreadyInDb ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                      {isAlreadyInDb ? "PROPIEDAD CONFIRMADA EN TU BD" : "CATÁLOGO EXTERNO TEMPORAL"}
                    </span>
                    <span className="text-[9px] font-mono text-stone-500">BASE DE DATOS SGBD</span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                    {isAlreadyInDb 
                      ? "¡Este artículo ya es tuyo! Está guardado permanentemente en tu base de datos local. Puedes modificar su precio, stock o datos en la pestaña de Base de Datos."
                      : "Este producto es temporal. Haz click abajo para importarlo y guardarlo de forma permanente en tu propia base de datos física."
                    }
                  </p>
                  {!isAlreadyInDb && onImportToDatabase && (
                    <button
                      type="button"
                      onClick={() => onImportToDatabase(sneaker)}
                      className="mt-1 w-full py-2 bg-gradient-to-r from-amber-500/10 to-amber-500/20 hover:from-amber-500 hover:to-amber-400 border border-amber-500/30 hover:border-amber-500 text-amber-500 hover:text-black font-mono text-xs uppercase tracking-wider rounded-lg transition-all font-bold cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Hacer mío permanentemente (Importar a mi BD)
                    </button>
                  )}
                  {isAlreadyInDb && (
                    <div className="mt-1 w-full py-2 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 font-mono text-xs uppercase tracking-wider rounded-lg text-center font-bold flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Producto propio permanente
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Bottom Rib */}
            <div className="pt-4 border-t border-stone-800 flex items-center gap-3 mt-4">
              <button
                id="btn-favorite-item"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center ${
                  isFavorite
                    ? "bg-red-950/40 border-red-900 text-red-500"
                    : "bg-stone-950 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                id="btn-add-to-cart-action"
                onClick={handleAddToCart}
                disabled={sneaker.inventory === 0 || addedAnimation}
                className={`flex-1 py-3.5 px-6 rounded-xl font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  sneaker.inventory === 0
                    ? "bg-stone-800 border border-stone-700 text-stone-500 cursor-not-allowed"
                    : addedAnimation
                    ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black shadow-lg hover:shadow-xl"
                }`}
              >
                {sneaker.inventory === 0 ? (
                  "Sin Stock Disponible"
                ) : addedAnimation ? (
                  <>
                    <Check className="w-5 h-5 stroke-[2.5]" />
                    ¡Añadido con éxito!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Añadir al Carrito ({selectedSize.split(" ")[0]})
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
