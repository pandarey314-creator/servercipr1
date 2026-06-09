import { useState, FormEvent } from "react";
import { CartItem, Order } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, ShoppingBag, Plus, Minus, CreditCard, Sparkles, AlertCircle, BadgeCheck } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (sneakerId: string, size: string, quantity: number) => void;
  onRemoveItem: (sneakerId: string, size: string) => void;
  onCheckoutComplete: (order: Order) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutComplete,
  onClearCart
}: CartDrawerProps) {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [bookedOrder, setBookedOrder] = useState<Order | null>(null);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.sneaker.marketPrice * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingPrice = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 15;
  const totalAmount = subtotal + shippingPrice;

  const handleProcessCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerAddress) {
      alert("Por favor rellene todos los campos de envío.");
      return;
    }

    const newOrderObj: Order = {
      id: "ord-jordan-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      items: cart.map((item) => ({
        sneakerId: item.sneaker.id,
        name: item.sneaker.name,
        reference: item.sneaker.reference,
        price: item.sneaker.marketPrice,
        size: item.selectedSize,
        quantity: item.quantity
      })),
      totalAmount,
      customerName,
      customerEmail,
      status: "Confirmado / Listo para Envío"
    };

    setBookedOrder(newOrderObj);
    onCheckoutComplete(newOrderObj);
  };

  const handleResetCheckoutState = () => {
    setBookedOrder(null);
    setShowCheckoutForm(false);
    setCustomerName("");
    setCustomerEmail("");
    setCustomerAddress("");
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer container panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="relative w-full max-w-md h-full bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col justify-between z-10 overflow-hidden"
          >
            {/* Header section with closing */}
            <div className="p-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <span className="font-sans font-bold text-stone-100 uppercase tracking-wider text-sm">
                  Mis Compras ({cart.reduce((acum, item) => acum + item.quantity, 0)})
                </span>
              </div>
              <button
                id="btn-close-cart"
                onClick={onClose}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If Order Booked successfully, show receipt screen */}
            {bookedOrder ? (
              <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-center items-center text-center font-mono">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500 flex items-center justify-center mb-5"
                >
                  <BadgeCheck className="w-8 h-8 stroke-[2]" />
                </motion.div>

                <h3 className="font-sans text-lg font-bold text-white mb-2">¡PEDIDO CONFIRMADO!</h3>
                <p className="text-xs text-stone-400 line-clamp-2 max-w-[280px] mb-6">
                  Se ha generado el boleto de reserva en base de datos.
                </p>

                {/* Ticket Receipt panel */}
                <div className="w-full bg-stone-950 border border-stone-800 rounded-xl p-4 text-left text-xs text-stone-300">
                  <div className="border-b border-dashed border-stone-800 pb-3 mb-3 text-[10px] text-stone-500 uppercase flex justify-between">
                    <span>ID: {bookedOrder.id}</span>
                    <span>{bookedOrder.date.split(" a las")[0]}</span>
                  </div>

                  {/* Customer info */}
                  <div className="mb-3">
                    <div className="text-[9px] text-stone-500 uppercase">Comprador:</div>
                    <span className="font-semibold text-stone-100">{bookedOrder.customerName}</span>
                    <span className="block text-[11px] text-stone-400">{bookedOrder.customerEmail}</span>
                  </div>

                  {/* List items */}
                  <div className="border-t border-dashed border-stone-800 pt-3 mb-3">
                    <div className="text-[9px] text-stone-500 uppercase mb-1.5">Artículos:</div>
                    {bookedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between py-1 text-stone-300">
                        <span>
                          {it.quantity}x {it.name.split("'")[1] || it.name.substring(0,20)} ({it.size.split(" ")[0]})
                        </span>
                        <span>{it.price * it.quantity} €</span>
                      </div>
                    ))}
                  </div>

                  {/* Total receipt value */}
                  <div className="border-t border-dashed border-stone-800 pt-3 flex justify-between items-center text-sm font-bold text-amber-400">
                    <span>Total Pagado:</span>
                    <span>{bookedOrder.totalAmount} €</span>
                  </div>
                </div>

                <button
                  id="btn-reset-order-state"
                  onClick={handleResetCheckoutState}
                  className="mt-8 w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold uppercase tracking-wider rounded-lg text-xs"
                >
                  Seguir Comprando
                </button>
              </div>
            ) : cart.length === 0 ? (
              /* Empty Cart Panel */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <ShoppingBag className="w-12 h-12 text-stone-600 mb-4 stroke-[1.5]" />
                <h4 className="font-sans font-bold text-stone-300 text-sm tracking-wide uppercase">Tu carrito está vacío</h4>
                <p className="text-xs text-stone-500 mt-2 max-w-[240px]">
                  Explora nuestra colección y añade tus siluetas favoritas con talla personalizada.
                </p>
              </div>
            ) : (
              /* Items exist, show item list or Checkout Form */
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {!showCheckoutForm ? (
                  /* Item List screen */
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.map((item) => (
                      <div
                        key={`${item.sneaker.id}-${item.selectedSize}`}
                        id={`cart-item-${item.sneaker.id}`}
                        className="bg-stone-950 border border-stone-900 rounded-xl p-3 flex gap-3 relative group"
                      >
                        {/* Thumbnail image */}
                        <div className="w-16 h-16 bg-stone-900 border border-stone-800 rounded-lg overflow-hidden flex items-center justify-center p-1 shrink-0">
                          <img
                            src={item.sneaker.imageUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Product simple description */}
                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className="font-sans text-stone-200 text-xs font-semibold truncate">
                            {item.sneaker.name}
                          </h4>
                          <span className="text-[10px] font-mono text-amber-500 block mt-0.5">
                            {item.selectedSize}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            Ref: {item.sneaker.reference}
                          </span>

                          {/* Incrementor buttons */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              id={`btn-dec-qty-${item.sneaker.id}`}
                              onClick={() => onUpdateQuantity(item.sneaker.id, item.selectedSize, item.quantity - 1)}
                              className="p-1 bg-stone-900 text-stone-300 rounded border border-stone-800 hover:border-stone-700 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono text-stone-300 px-1">{item.quantity}</span>
                            <button
                              id={`btn-inc-qty-${item.sneaker.id}`}
                              onClick={() => onUpdateQuantity(item.sneaker.id, item.selectedSize, item.quantity + 1)}
                              className="p-1 bg-stone-900 text-stone-300 rounded border border-stone-800 hover:border-stone-700 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Trash delete action */}
                        <button
                          id={`btn-remove-item-${item.sneaker.id}`}
                          onClick={() => onRemoveItem(item.sneaker.id, item.selectedSize)}
                          className="absolute top-3 right-3 text-stone-500 hover:text-red-400 p-1 rounded transition-colors"
                          title="Quitar artículo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-3 right-3 text-xs font-mono font-bold text-stone-200">
                          {item.sneaker.marketPrice * item.quantity} €
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Form Checkout Screen */
                  <div className="flex-1 overflow-y-auto p-4">
                    <form onSubmit={handleProcessCheckout} className="space-y-4 font-mono text-xs">
                      <div className="pb-2 border-b border-stone-800 mb-2">
                        <span className="text-amber-500 font-bold block">DATOS DE DESPACHO & ENVÍO</span>
                        <span className="text-[10px] text-stone-500">Completa para realizar la simulación</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-stone-400">Nombre Completo *</label>
                        <input
                          type="text"
                          placeholder="Ej: Michael Jordan"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="bg-stone-950 border border-stone-800 rounded p-2.5 text-white outline-none focus:border-amber-500"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-stone-400">Email de Contacto *</label>
                        <input
                          type="email"
                          placeholder="Ej: air23@bulls.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="bg-stone-950 border border-stone-800 rounded p-2.5 text-white outline-none focus:border-amber-500"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-stone-400">Dirección de Envío *</label>
                        <input
                          type="text"
                          placeholder="Ej: Madison Square Garden 4, NYC"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="bg-stone-950 border border-stone-800 rounded p-2.5 text-white outline-none focus:border-amber-500"
                          required
                        />
                      </div>

                      <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg flex gap-2.5 text-[11px] text-stone-400">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span>Esta es una pasarela de prueba simulada. Ningún cobro financiero real se llevará a cabo.</span>
                        </div>
                      </div>

                      <div className="pt-4 flex gap-2.5">
                        <button
                          type="button"
                          id="btn-back-to-list"
                          onClick={() => setShowCheckoutForm(false)}
                          className="flex-1 py-3 border border-stone-800 hover:bg-stone-800 text-stone-400 rounded-lg text-xs"
                        >
                          Atrás al Carrito
                        </button>
                        <button
                          type="submit"
                          id="btn-confirm-payment"
                          className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold uppercase rounded-lg text-xs flex items-center justify-center gap-1.5"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pagar {totalAmount} €
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Subtotal, tax, checkout controls bottom segment */}
                {!showCheckoutForm && (
                  <div className="p-4 bg-stone-950 border-t border-stone-800 font-mono text-xs space-y-2">
                    <div className="flex justify-between text-stone-400">
                      <span>Subtotal</span>
                      <span>{subtotal} €</span>
                    </div>
                    <div className="flex justify-between text-stone-400">
                      <span>Envío Asegurado</span>
                      <span>{shippingPrice === 0 ? "GRATIS" : `${shippingPrice} €`}</span>
                    </div>
                    {shippingPrice > 0 && (
                      <div className="text-[10px] text-stone-500 text-right">
                        * Envío gratis para pedidos superiores a 500 €
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-stone-900">
                      <span>Total Estimado:</span>
                      <span className="text-amber-400">{totalAmount} €</span>
                    </div>

                    <button
                      id="btn-proceed-to-checkout"
                      onClick={() => setShowCheckoutForm(true)}
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-lg flex items-center justify-center gap-2 mt-4"
                    >
                      <CreditCard className="w-4 h-4" />
                      Tramitar Pedido
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
