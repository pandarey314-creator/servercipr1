import { useState, useEffect } from "react";
import { Sneaker, CartItem, Order, DBAdjustment, ReplitStore } from "./types";
import { queryShoopyCatalog, SHOOPY_TOTAL_PRODUCTS, SHOOPY_CATEGORIES, SHOOPY_CATALOGS, generateUnifiedInitialCatalog } from "./shoopyService";
import { generate1000Sneakers } from "./data";
import SneakerCard from "./components/SneakerCard";
import SneakerDetailModal from "./components/SneakerDetailModal";
import DatabaseExplorer from "./components/DatabaseExplorer";
import SgbdCentralGateway from "./components/SgbdCentralGateway";
import AdminLogin from "./components/AdminLogin";
import CartDrawer from "./components/CartDrawer";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Search,
  Database,
  Download,
  Grid,
  Filter,
  TrendingUp,
  Package,
  DollarSign,
  Award,
  Plus,
  RefreshCw,
  Heart,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";

const getSilhouettesForCategory = (category: string) => {
  if (category === "Todos") {
    return ["Todos", "Cargadores Rápidos", "Trípodes & Aros", "Sets de Brochas", "Juguetes Sensoriales", "Relojes Sencillos", "Humidificadores Mini"];
  }
  if (category === "Cargadores & Conectividad") {
    return ["Todos", "Cargadores Rápidos", "Cables Reforzados", "Bases Inalámbricas", "Cargadores de Auto", "Power Banks"];
  }
  if (category === "Accesorios de Telefonía") {
    return ["Todos", "Trípodes & Aros", "Protectores de Pantalla", "Fundas Especiales", "Soportes de Celular", "Lápices Ópticos"];
  }
  if (category === "Maquillaje & Cosmética") {
    return ["Todos", "Sets de Brochas", "Espejos Inteligentes", "Labiales Mate", "Rizadores Térmicos", "Organizadores Acrílicos"];
  }
  if (category === "Juguetes & Antiestrés") {
    return ["Todos", "Juguetes Sensoriales", "Peluches Reversibles", "Bloques de Construcción", "Consolas Retro", "Cubos de Velocidad"];
  }
  if (category === "Accesorios de Moda & Joyas") {
    return ["Todos", "Relojes Sencillos", "Gafas de Sol", "Pinzas de Gancho", "Joyeros de Viaje"];
  }
  if (category === "Hogar & Organización") {
    return ["Todos", "Humidificadores Mini", "Luces LED Ambientales", "Botellas Térmicas", "Bolsas de Almacenamiento"];
  }
  if (category === "Salud & Cuidado Personal") {
    return ["Todos", "Cepillos Sónicos", "Masajeadores Faciales", "Parches de Hidrogel"];
  }
  if (category === "Papelería & Escritorio") {
    return ["Todos", "Libretas de Cuero", "Plumas de Colores", "Notas Transparentes", "Marcadores"];
  }
  return ["Todos"];
};

// URL route/session parser to determine active store 
const getActiveStoreId = (): string | null => {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname;
  
  // Try pattern /store/store-1, etc.
  const match = path.match(/\/store\/([^/]+)/);
  if (match) return match[1];

  // Fallback search parameters: ?store=store-1
  const searchParams = new URLSearchParams(window.location.search);
  const fromQuery = searchParams.get("store") || searchParams.get("storeId");
  if (fromQuery) return fromQuery;

  return null;
};

export default function App() {
  // Client-side session state
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(() => getActiveStoreId());
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sgbd_admin_verified") === "true";
  });
  const [employeeName, setEmployeeName] = useState(() => {
    return localStorage.getItem("sgbd_employee_name") || "Empleado #1";
  });

  // DB State (Starts beautifully clean and empty as requested!)
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);

  // Cart State (persist to localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem("jordan_sneaker_cart");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("No se pudo cargar el carrito local.", e);
      }
    }
    return [];
  });

  // User Actions and Admin Logs Ticker
  const [dbLogs, setDbLogs] = useState<string[]>(["[SISTEMA] SGBD Nódulo activo e independiente. Todo listo para administrar."]);

  // DB adjustments state (for undo actions)
  const [adjustments, setAdjustments] = useState<DBAdjustment[]>(() => {
    const local = localStorage.getItem("sgbd_adjustments_history");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Replit store endpoints state (4 stores connected)
  const [replitStores, setReplitStores] = useState<ReplitStore[]>(() => {
    const local = localStorage.getItem("sgbd_replit_stores");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: "store-1", name: "Tienda Cipr1 A (Accesorios)", url: "https://tienda-a-accesorios.cipr1.app/api/products", selected: true, lastSyncStatus: "Inactiva", lastSyncTime: "-" },
      { id: "store-2", name: "Tienda Cipr1 B (Tecnología)", url: "https://tienda-b-tech.cipr1.app/api/products", selected: false, lastSyncStatus: "Inactiva", lastSyncTime: "-" },
      { id: "store-3", name: "Tienda Cipr1 C (Moda)", url: "https://tienda-c-fashion.cipr1.app/api/products", selected: false, lastSyncStatus: "Inactiva", lastSyncTime: "-" },
      { id: "store-4", name: "Tienda Cipr1 D (Hogar)", url: "https://tienda-d-hogar.cipr1.app/api/products", selected: false, lastSyncStatus: "Inactiva", lastSyncTime: "-" }
    ];
  });

  // Logs for replication terminal
  const [repLogs, setRepLogs] = useState<string[]>(["[DISPATCH] Sistema de réplica SGBD preparado."]);

  const appendRepLog = (msg: string) => {
    const timeStr = new Date().toLocaleTimeString("es-ES", { hour12: false });
    setRepLogs(prev => [`[${timeStr}] ${msg}`, ...prev.slice(0, 15)]);
  };

  useEffect(() => {
    localStorage.setItem("sgbd_replit_stores", JSON.stringify(replitStores));
  }, [replitStores]);

  // Navigation controller helper
  const navigateToStore = (storeId: string | null) => {
    const nextPath = storeId ? `/store/${storeId}` : "/";
    window.history.pushState(null, "", nextPath);
    setCurrentStoreId(storeId);
    setCart([]); // Clear mock shopping cart on switch
  };

  // Listen to popstate changes (browser backward/forward navigation)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentStoreId(getActiveStoreId());
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // Tab State ("tienda" | "base-de-datos")
  const [activeTab, setActiveTab] = useState<"tienda" | "base-de-datos">("base-de-datos");

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSilhouette, setSelectedSilhouette] = useState("Todos");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState(1200);
  const [visibleCount, setVisibleCount] = useState(24);

  // Integrated categories and sourcing catalogs
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedCatalog, setSelectedCatalog] = useState("Todos");

  // Reset pagination state when filters change
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, selectedSilhouette, sortBy, maxPrice, selectedCategory, selectedCatalog]);

  // Reset sub-filters if category changes
  useEffect(() => {
    setSelectedSilhouette("Todos");
  }, [selectedCategory]);

  // Focus modal & drawer states
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load products dynamically on startup or whenever active session changes
  useEffect(() => {
    const loadStoreProducts = async () => {
      try {
        const targetUrl = currentStoreId 
          ? `/api/stores/${currentStoreId}/products` 
          : `/api/products`;
        const res = await fetch(targetUrl);
        if (res.ok) {
          const list = await res.json();
          setSneakers(list);
          if (currentStoreId) {
            const activeStoreObj = replitStores.find(st => st.id === currentStoreId);
            setDbLogs([`[SISTEMA] Sesión Iniciada y Aislada: ${activeStoreObj?.name || currentStoreId}`]);
            addLog(`SGBD cargó catálogo exclusivo (${list.length} registros en línea).`);
          } else {
            setDbLogs(["[SISTEMA] Cargado portal de coordinación central."]);
          }
        }
      } catch (err) {
        console.error("Fallo cargando base de datos remota:", err);
      }
    };
    loadStoreProducts();
  }, [currentStoreId]);

  // Debounced backup sync of product modifications to our partitioned cloud JSON database file
  useEffect(() => {
    if (sneakers.length === 0) {
      localStorage.setItem("jordan_sneaker_catalog_db", "[]");
      return;
    }
    localStorage.setItem("jordan_sneaker_catalog_db", JSON.stringify(sneakers));

    const syncWithServer = async () => {
      try {
        const targetUrl = currentStoreId 
          ? `/api/stores/${currentStoreId}/sync-multiple` 
          : `/api/products/sync-multiple`;
        await fetch(targetUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-SGBD-Employee": employeeName
          },
          body: JSON.stringify(sneakers)
        });
      } catch (err) {
        console.warn("Fallo de conexión temporal con el SGBD Server:", err);
      }
    };

    const timer = setTimeout(syncWithServer, 1000);
    return () => clearTimeout(timer);
  }, [sneakers, currentStoreId, employeeName]);

  useEffect(() => {
    localStorage.setItem("jordan_sneaker_cart", JSON.stringify(cart));
  }, [cart]);

  // Push new logging statement helper
  const addLog = (message: string) => {
    const timeStr = new Date().toLocaleTimeString("es-ES", { hour12: false });
    setDbLogs((prev) => [`[${timeStr}] ${message}`, ...prev.slice(0, 7)]);
  };

  // Push adjustment to undo stack
  const pushAdjustment = (description: string, prevSneakers: Sneaker[]) => {
    const newAdjustment: DBAdjustment = {
      id: "adj-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toLocaleTimeString("es-ES", { hour12: false }),
      description,
      previousState: [...prevSneakers]
    };
    setAdjustments(prev => {
      const updated = [newAdjustment, ...prev].slice(0, 10);
      localStorage.setItem("sgbd_adjustments_history", JSON.stringify(updated));
      return updated;
    });
  };

  // Replicate dataset adjustments to selected Replit IA stores
  const replicateToSelectedStores = async (actionType: "INSERT" | "UPDATE" | "DELETE" | "SYNC_ALL", payload: any) => {
    const activeStores = replitStores.filter(s => s.selected);
    if (activeStores.length === 0) {
      appendRepLog(`⚠️ Réplica omitida: Ninguna de las 4 tiendas de Replit está seleccionada.`);
      return;
    }

    activeStores.forEach(async (store) => {
      const timeStr = new Date().toLocaleTimeString("es-ES", { hour12: false });
      appendRepLog(`📡 [${actionType}] Iniciando réplica en: ${store.name}...`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(store.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-SGBD-Action": actionType,
          },
          body: JSON.stringify({
            action: actionType,
            timestamp: new Date().toISOString(),
            data: payload
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        const statusText = response.ok ? "200 OK" : `${response.status} ${response.statusText}`;
        appendRepLog(`✅ [${store.name}] Réplica completada con éxito. Código: ${statusText}`);

        // Update last sync status dynamically
        setReplitStores(prev => prev.map(s => s.id === store.id ? { ...s, lastSyncStatus: "Conectado", lastSyncTime: timeStr } : s));
      } catch (err: any) {
        let errorMsg = err.message || "Error (CORS o inalcanzable)";
        if (err.name === 'AbortError') {
          errorMsg = "Excedió tiempo límite (Timeout 4s)";
        }
        appendRepLog(`❌ [${store.name}] Réplica fallida: ${errorMsg}`);
        setReplitStores(prev => prev.map(s => s.id === store.id ? { ...s, lastSyncStatus: "Error / CORS", lastSyncTime: timeStr } : s));
      }
    });
  };

  // Undo specific level actions
  const handleUndoLastAdjustment = () => {
    if (adjustments.length === 0) {
      alert("No hay ajustes guardados en el historial para deshacer.");
      return;
    }
    const [last, ...remaining] = adjustments;
    setSneakers(last.previousState);
    setAdjustments(remaining);
    localStorage.setItem("sgbd_adjustments_history", JSON.stringify(remaining));
    addLog(`UNDO: Se deshizo la última operación: "${last.description}".`);
    replicateToSelectedStores("SYNC_ALL", last.previousState);
  };

  const handleUndoLast10Adjustments = () => {
    if (adjustments.length === 0) {
      alert("No hay ajustes guardados en el historial.");
      return;
    }
    const oldest = adjustments[adjustments.length - 1];
    setSneakers(oldest.previousState);
    setAdjustments([]);
    localStorage.setItem("sgbd_adjustments_history", JSON.stringify([]));
    addLog(`UNDO_10: Se revirtieron todos los ajustes registrados.`);
    replicateToSelectedStores("SYNC_ALL", oldest.previousState);
  };

  const handleUndoSpecificAdjustment = (id: string) => {
    const idx = adjustments.findIndex(a => a.id === id);
    if (idx === -1) return;
    const target = adjustments[idx];
    setSneakers(target.previousState);
    const remaining = adjustments.slice(idx + 1);
    setAdjustments(remaining);
    localStorage.setItem("sgbd_adjustments_history", JSON.stringify(remaining));
    addLog(`UNDO_SPECIFIC: Catalogo revertido al punto: "${target.description}".`);
    replicateToSelectedStores("SYNC_ALL", target.previousState);
  };

  const handleClearAllSavedData = () => {
    localStorage.removeItem("jordan_sneaker_catalog_db");
    localStorage.removeItem("sgbd_adjustments_history");
    localStorage.removeItem("jordan_sneaker_cart");
    setSneakers([]);
    setCart([]);
    setAdjustments([]);
    setDbLogs(["[SISTEMA] Base de datos vaciada por completo a petición del administrador."]);
    addLog("DB_WIPE: Base de datos purgada de forma absoluta. Catálogo vacío.");
    replicateToSelectedStores("SYNC_ALL", []);
  };

  // Add customized sneaker to catalog
  const handleAddSneaker = (newSneaker: Sneaker) => {
    // Check duplication
    if (sneakers.some((s) => s.reference === newSneaker.reference)) {
      alert(`Ups, el código SKU de referencia ${newSneaker.reference} ya se encuentra registrado en la tienda.`);
      return;
    }
    pushAdjustment(`Insertar producto "${newSneaker.name}" (SKU: ${newSneaker.reference})`, sneakers);
    setSneakers((prev) => [newSneaker, ...prev]);
    addLog(`INSERT: Nuevo modelo '${newSneaker.name}' insertado bajo SKU: ${newSneaker.reference}.`);
    // Replicate updating
    replicateToSelectedStores("INSERT", newSneaker);
  };

  // Update existing database sneaker
  const handleUpdateSneaker = (updated: Sneaker) => {
    pushAdjustment(`Modificar producto "${updated.name}" (Ref: ${updated.reference})`, sneakers);
    setSneakers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    // Also update matching item info if still in current cart
    setCart((prev) =>
      prev.map((item) =>
        item.sneaker.id === updated.id ? { ...item, sneaker: updated } : item
      )
    );
    addLog(`UPDATE: Fila ID '${updated.id}' modificada. Nuevo Stock: ${updated.inventory} uds, Precio: ${updated.marketPrice} €.`);
    // Replicate updating
    replicateToSelectedStores("UPDATE", updated);
  };

  // Bulk update multiple database sneakers at once
  const handleUpdateMultipleSneakers = (updatedItems: Sneaker[], adjustmentDescription: string) => {
    pushAdjustment(adjustmentDescription, sneakers);
    const updatedMap = new Map(updatedItems.map(item => [item.id, item]));
    setSneakers((prev) => {
      const updatedList = prev.map((s) => {
        const matched = updatedMap.get(s.id);
        return matched ? { ...s, ...matched } : s;
      });
      // Replicate sync to active stores
      replicateToSelectedStores("SYNC_ALL", updatedList);
      return updatedList;
    });
    // Also update matching item info in current cart
    setCart((prev) =>
      prev.map((item) => {
        const matched = updatedMap.get(item.sneaker.id);
        return matched ? { ...item, sneaker: { ...item.sneaker, ...matched } } : item;
      })
    );
    addLog(`BULK_UPDATE: ${updatedItems.length} registros actualizados simultáneamente: ${adjustmentDescription}`);
  };

  // Delete matching sneaker from catalog
  const handleDeleteSneaker = (id: string) => {
    const target = sneakers.find((s) => s.id === id);
    if (target) {
      pushAdjustment(`Eliminar producto "${target.name}" (Ref: ${target.reference})`, sneakers);
    }
    setSneakers((prev) => prev.filter((s) => s.id !== id));
    // Remove from cart if deleted from store
    setCart((prev) => prev.filter((item) => item.sneaker.id !== id));
    if (target) {
      addLog(`DELETE: Modelo eliminado. Catálogo removió SKU: ${target.reference}.`);
      replicateToSelectedStores("DELETE", { id });
    }
  };

  // Reset local database completely
  const handleResetDatabase = () => {
    pushAdjustment("Vaciar base de datos por completo (Empezar de cero)", sneakers);
    localStorage.setItem("jordan_sneaker_catalog_db", "[]");
    setSneakers([]);
    setCart([]);
    setDbLogs(["[SISTEMA] Base de datos purgada de forma manual. Catálogo vacío listo para ingresar datos reales."]);
    addLog("DB_RESET: Catálogo vaciado por completo para iniciar desde cero.");
    replicateToSelectedStores("SYNC_ALL", []);
  };

  // Seed database to 1000 items
  const handleSeed1000Database = () => {
    pushAdjustment("Sembrar catálogo masivo (1.000)", sneakers);
    const thousand = generate1000Sneakers();
    setSneakers(thousand);
    setCart([]);
    setDbLogs(["[SISTEMA] Base de datos sembrada con 1.000 registros catalogados."]);
    addLog("DB_SEED: Base de datos recreada con un catálogo masivo de 1.000 zapatillas.");
    replicateToSelectedStores("SYNC_ALL", thousand);
  };

  // Restore database from Drive
  const handleRestoreDatabase = (restoredSneakers: Sneaker[]) => {
    pushAdjustment("Restaurar catálogo desde copia en Google Drive", sneakers);
    setSneakers(restoredSneakers);
    setCart([]);
    addLog("DB_RESTORE: Catálogo restaurado con éxito desde Google Drive.");
    replicateToSelectedStores("SYNC_ALL", restoredSneakers);
  };

  // Import multiple external items permanently
  const handleImportMultiple = (items: Sneaker[]) => {
    const existingRef = new Set(sneakers.map(s => s.reference));
    const toAdd = items.filter(item => !existingRef.has(item.reference));
    if (toAdd.length === 0) {
      return;
    }
    pushAdjustment(`Importar lote de ${toAdd.length} productos desde HTML/Externo`, sneakers);
    setSneakers((prev) => {
      addLog(`IMPORTADOR: Adquiridos y registrados de forma permanente ${toAdd.length} nuevos productos.`);
      const updatedList = [...toAdd, ...prev];
      replicateToSelectedStores("SYNC_ALL", updatedList);
      return updatedList;
    });
  };

  // Add to cart with specific size
  const handleAddToCartWithSize = (sneaker: Sneaker, size: string) => {
    // Verify inventory limit
    const existing = cart.find((item) => item.sneaker.id === sneaker.id && item.selectedSize === size);
    const requestedQty = existing ? existing.quantity + 1 : 1;

    if (requestedQty > sneaker.inventory) {
      alert(`Lo sentimos, el stock disponible para este modelo es limitado (${sneaker.inventory} uds).`);
      return;
    }

    setCart((prev) => {
      if (existing) {
        return prev.map((item) =>
          item.sneaker.id === sneaker.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { sneaker, selectedSize: size, quantity: 1 }];
      }
    });

    addLog(`CARRITO: Añadido modelo '${sneaker.name.split("'")[1] || sneaker.name}' en Talla ${size}.`);
  };

  // Simple Add to Cart overlay trigger (takes size US 9.5 default)
  const handleQuickAddToCart = (sneaker: Sneaker) => {
    const defaultSize = "US 9.5 (EU 43)";
    handleAddToCartWithSize(sneaker, defaultSize);
  };

  // Update cart item quantity
  const handleUpdateCartQuantity = (sneakerId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(sneakerId, size);
      return;
    }

    const sneakerInfo = sneakers.find((s) => s.id === sneakerId);
    if (sneakerInfo && quantity > sneakerInfo.inventory) {
      alert(`Ups! El stock actual de la base de datos está limitado a ${sneakerInfo.inventory} pares.`);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.sneaker.id === sneakerId && item.selectedSize === size ? { ...item, quantity } : item
      )
    );
  };

  // Remove individual cart item
  const handleRemoveCartItem = (sneakerId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.sneaker.id === sneakerId && item.selectedSize === size)));
  };

  // Simulating payment / decrease stock on successful order placement
  const handleCheckoutComplete = (order: Order) => {
    // Decrease inventory counts of sneakers in the storage catalog
    setSneakers((prev) => {
      return prev.map((sneaker) => {
        const itemOrdered = order.items.find((it) => it.sneakerId === sneaker.id);
        if (itemOrdered) {
          const finalInventory = Math.max(0, sneaker.inventory - itemOrdered.quantity);
          return { ...sneaker, inventory: finalInventory };
        }
        return sneaker;
      });
    });

    addLog(`PEDIDO: Orden registrada con éxito (#${order.id}). Destinatario: ${order.customerName}.`);
  };

  // Helper calculations mapped directly to the active store session
  const totalCatalogSize = sneakers.length;
  const totalInventoryUnits = sneakers.reduce((acc, curr) => acc + (curr.inventory || 0), 0);
  const averagePrice = sneakers.length > 0 ? (sneakers.reduce((acc, curr) => acc + (curr.marketPrice || 0), 0) / sneakers.length) : 0;
  
  // Real-time local array filtering over the active isolated store products
  const filteredSneakers = sneakers.filter((s) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === "" ||
      s.name.toLowerCase().includes(query) ||
      s.reference.toLowerCase().includes(query) ||
      s.designer.toLowerCase().includes(query) ||
      (s.colorway && s.colorway.toLowerCase().includes(query)) ||
      (s.description && s.description.toLowerCase().includes(query));

    const matchesCategory = selectedCategory === "Todos" || s.category === selectedCategory;
    const matchesCatalog = selectedCatalog === "Todos" || s.catalog === selectedCatalog;
    const matchesSilhouette = selectedSilhouette === "Todos" || s.silhouette === selectedSilhouette;
    const matchesPrice = s.marketPrice <= maxPrice;

    return matchesSearch && matchesCategory && matchesCatalog && matchesSilhouette && matchesPrice;
  });

  const displayTotalMatching = filteredSneakers.length;
  const displaySneakers = filteredSneakers.slice(0, visibleCount);

  const highestValueSneaker = filteredSneakers.length > 0 ? [...filteredSneakers].sort((a,b) => b.marketPrice - a.marketPrice)[0] : null;


  if (currentStoreId === null) {
    if (!isAdminVerified) {
      return (
        <AdminLogin
          replitStores={replitStores}
          onLoginSuccess={() => setIsAdminVerified(true)}
          onNavigateStore={(storeId) => navigateToStore(storeId)}
        />
      );
    }
    return (
      <SgbdCentralGateway
        replitStores={replitStores}
        onNavigate={navigateToStore}
        onLogout={() => {
          localStorage.removeItem("sgbd_admin_verified");
          setIsAdminVerified(false);
        }}
      />
    );
  }

  const activeStoreObj = replitStores.find((s) => s.id === currentStoreId);
  const activeStoreName = activeStoreObj ? activeStoreObj.name : "Sesión SGBD";

  return (
    <div className="min-h-screen bg-stone-950 font-sans flex flex-col justify-between">
      
      {/* Top Header Navigation bar */}
      <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo Container */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 text-black font-black px-2.5 py-1 rounded-xl flex items-center justify-center font-sans text-xs tracking-wider shadow-md shadow-amber-600/10">
              SGBD {currentStoreId?.toUpperCase()}
            </div>
            <div>
              <span className="font-sans font-black text-md tracking-tight text-white uppercase block leading-none">
                {activeStoreName}
              </span>
              <span className="text-[9px] font-mono font-medium text-amber-400 tracking-wider uppercase">
                Módulo Independiente Sincronizado
              </span>
            </div>

            {/* Close Session action to return to portal Central */}
            {isAdminVerified ? (
              <button
                onClick={() => navigateToStore(null)}
                className="ml-3 p-1.5 px-3 bg-stone-950 border border-stone-850 text-stone-450 hover:text-amber-400 hover:bg-stone-850 text-[10.5px] rounded-lg font-mono font-extrabold transition cursor-pointer flex items-center gap-1"
                title="Volver al Portal Central SGBD"
              >
                ← Portal Admin
              </button>
            ) : (
              <button
                onClick={() => {
                  const clave = prompt("Introduzca Clave de Administrador Jefe para volver al Portal Central:");
                  if (clave === "prestasi_sgbd_sec_8849-key" || clave === "admin123") {
                    localStorage.setItem("sgbd_admin_verified", "true");
                    setIsAdminVerified(true);
                    navigateToStore(null);
                  } else if (clave !== null) {
                    alert("Clave incorrecta. Solo el Administrador Jefe posee acceso al Portal Central.");
                  }
                }}
                className="ml-3 p-1.5 px-3 bg-stone-950 border border-stone-850 text-stone-500 hover:text-amber-500 hover:bg-stone-850 text-[10.5px] rounded-lg font-mono font-bold transition cursor-pointer flex items-center gap-1"
                title="Acceso restringido a Administrador"
              >
                🔒 Acceder Central
              </button>
            )}

            {/* Real-time Cloud Run SGBD Server active monitoring badge */}
            <div className="hidden lg:flex items-center gap-3 bg-stone-950 border border-stone-850 py-1.5 px-3 rounded-xl ml-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="font-mono text-[9.5px]">
                <div className="flex items-center gap-1.5 text-white font-extrabold tracking-tight uppercase">
                  <span>CANAL: {currentStoreId}</span>
                  <span className="text-emerald-400 text-[8px] bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.2 rounded font-black">ACTIVO</span>
                </div>
                <div className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1 text-[8px]">
                  <span>Aislado</span>
                  <span>•</span>
                  <span>Canal Cipr1</span>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggles Tab row */}
          <nav className="hidden md:flex bg-stone-950 p-1 rounded-xl border border-stone-850">
            <button
              id="tab-toggle-tienda"
              onClick={() => setActiveTab("tienda")}
              className={`px-5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
                activeTab === "tienda"
                  ? "bg-stone-900 border border-stone-800 text-amber-400 shadow-inner"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
              La Tienda
            </button>
            <button
              id="tab-toggle-db"
              onClick={() => setActiveTab("base-de-datos")}
              className={`px-5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
                activeTab === "base-de-datos"
                  ? "bg-stone-900 border border-stone-800 text-amber-400 shadow-inner"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Database className="w-4 h-4" />
              Base de Datos ({sneakers.length})
            </button>
          </nav>

          {/* Cart triggers and mobile menu indicators */}
          <div className="flex items-center gap-3">
            <button
              id="btn-open-cart-drawer"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-stone-800 bg-stone-950 hover:bg-stone-900 transition-colors text-white group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-amber-500 transition-colors" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black font-semibold font-mono text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cart.reduce((acu, it) => acu + it.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Submenu for active views */}
        <div className="md:hidden bg-stone-950 border-t border-stone-900 flex justify-around h-11 text-xs">
          <button
            onClick={() => setActiveTab("tienda")}
            className={`flex-1 font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 ${
              activeTab === "tienda" ? "text-amber-400" : "text-stone-400"
            }`}
          >
            <Grid className="w-4 h-4" />
            Catálogo
          </button>
          <div className="w-[1px] bg-stone-800 my-2" />
          <button
            onClick={() => setActiveTab("base-de-datos")}
            className={`flex-1 font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 ${
              activeTab === "base-de-datos" ? "text-amber-400" : "text-stone-400"
            }`}
          >
            <Database className="w-4 h-4" />
            Fichas DB
          </button>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* State Statistics Dashboard Bento style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Card: Total SKUs */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center gap-3.5">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Referencias SKU</span>
              <span className="text-xl font-mono font-black text-white">{totalCatalogSize}</span>
            </div>
          </div>

          {/* Card: Available Units */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center gap-3.5">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Stock Físico</span>
              <span className="text-xl font-mono font-black text-white">{totalInventoryUnits.toLocaleString()} unidades</span>
            </div>
          </div>

          {/* Card: Average valuation */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center gap-3.5">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Valor Promedio</span>
              <span className="text-xl font-mono font-black text-amber-400">{averagePrice} €</span>
            </div>
          </div>

          {/* Card: Grails Peak */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center gap-3.5 col-span-2 md:col-span-1">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Producto Top</span>
              <span className="text-sm font-semibold text-white block truncate">
                {highestValueSneaker ? highestValueSneaker.name.split("'")[1] || highestValueSneaker.name : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Panel Content viewports */}
        <AnimatePresence mode="wait">
          {activeTab === "tienda" ? (
            <motion.div
              key="tienda-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Banner de Base de Datos de Catálogos Integrada */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl mt-0.5 shrink-0">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans font-black text-sm text-white uppercase tracking-tight">
                        Base de Datos de Catálogos Integrada
                      </h4>
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold tracking-wide border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        PROPIEDAD DIRECTA
                      </span>
                    </div>
                    <p className="text-stone-400 text-xs mt-1.5 max-w-xl leading-relaxed">
                      Todos los productos de los catálogos y marcas internacionales están integrados de forma física y permanente en tu base de datos local. Modifica precios, stock y descripciones directamente. Todo se respalda de forma segura en la nube.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 font-mono hover:scale-[1.02] transition-transform">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Estado del Almacén</span>
                  <span className="text-xs text-amber-500 font-extrabold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-500" />
                    {sneakers.length} Artículos Registrados
                  </span>
                </div>
              </div>

              {/* Filter controls row */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-col gap-5">
                <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center">
                  
                  {/* Search Bar */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      placeholder="Buscar en tu base de datos integrada (por nombre, referencia SKU, marca, categoría, color, descripción)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-805 text-stone-200 text-xs font-mono font-medium rounded-xl pl-10 pr-4 py-3 outline-none focus:border-amber-500 focus:text-white transition-colors"
                    />
                  </div>

                  {/* Sorter Selector */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-stone-400 shrink-0">
                      <Filter className="w-3.5 h-3.5 text-amber-500" />
                      <span>Clasificar por:</span>
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-stone-950 border border-stone-805 text-stone-300 font-mono text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500"
                    >
                      <option value="default">Recomendados / Semilla</option>
                      <option value="price-asc">Precio: Más barato primero</option>
                      <option value="price-desc">Precio: Más caro primero</option>
                      <option value="newest">Fecha: Últimos lanzamientos</option>
                      <option value="rating">Popularidad: Mayor valoración</option>
                    </select>

                    {/* Price budget slider */}
                    <div className="flex items-center gap-2 font-mono text-xs shrink-0 text-stone-400">
                      <span>Precio Máx:</span>
                      <input
                        type="range"
                        min="10"
                        max="1200"
                        step="10"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-24 sm:w-32 accent-amber-500"
                      />
                      <span className="text-amber-500 font-bold min-w-[50px]">{maxPrice} €</span>
                    </div>
                  </div>
                </div>

                {/* Extra row for Integrated Categories & Sourcing Channels */}
                <div className="border-t border-stone-800/60 pt-4 flex flex-col xl:flex-row gap-5 items-stretch xl:items-center">
                  {/* Category selector */}
                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                      Categorías del Catálogo Integrado
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {SHOOPY_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-mono tracking-tight transition-all border ${
                            selectedCategory === cat
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-450 font-bold shadow-sm"
                              : "bg-stone-950/60 border-stone-850 text-stone-400 hover:text-stone-300"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Catalog selector */}
                  <div className="w-full xl:w-72 space-y-2 shrink-0">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                      Canal de Origen / Sourcing
                    </label>
                    <select
                      value={selectedCatalog}
                      onChange={(e) => setSelectedCatalog(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-805 text-stone-300 font-mono text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500"
                    >
                      {SHOOPY_CATALOGS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === "Todos" ? "Todos los canales de origen" : cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

               {/* Silhouette / Sub-categoría Filter Tabs */}
              <div className="flex gap-2 pb-2 overflow-x-auto">
                {getSilhouettesForCategory(selectedCategory).map((silhouette) => (
                  <button
                    key={silhouette}
                    onClick={() => setSelectedSilhouette(silhouette)}
                    className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-full border transition-all shrink-0 ${
                      selectedSilhouette === silhouette
                        ? "bg-amber-500 border-amber-500 text-black font-semibold shadow-md"
                        : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                    }`}
                  >
                    {silhouette}
                  </button>
                ))}
              </div>

              {/* Dynamic Sneaker grid block */}
              {displaySneakers.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 rounded-xl py-16 text-center text-stone-400">
                  <div className="w-12 h-12 rounded-full border border-stone-700/60 flex items-center justify-center mx-auto mb-4 bg-stone-950">
                    <Search className="w-5 h-5 text-stone-500" />
                  </div>
                  <h3 className="font-sans font-bold text-stone-300">Ninguna coincidencia encontrada</h3>
                  <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
                    No pudimos encontrar zapatillas que se ajusten a tus filtros activos actuales. Intenta mitigar el presupuesto de reventa o la búsqueda de texto.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displaySneakers.map((sneaker) => (
                      <SneakerCard
                        key={sneaker.id}
                        sneaker={sneaker}
                        onViewDetails={(s) => setSelectedSneaker(s)}
                        onAddToCart={(s) => handleQuickAddToCart(s)}
                      />
                    ))}
                  </div>

                  {displayTotalMatching > visibleCount && (
                    <div className="flex justify-center pt-2">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 24)}
                        className="px-6 py-3.5 bg-stone-900 hover:bg-stone-850 text-amber-500 hover:text-amber-400 border border-stone-800 hover:border-amber-500/20 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold hover:scale-[1.01] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <RefreshCw className="w-4 h-4 text-amber-500" />
                        Cargar más de la base de datos ({displayTotalMatching - visibleCount > 1000000 ? "999.000+" : displayTotalMatching - visibleCount} restantes)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            // Base de Datos tab
            <motion.div
              key="base-de-datos-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* DB Logs ticker terminal */}
              <div className="bg-stone-950 border border-stone-850 rounded-xl p-4 font-mono text-xs shadow-inner">
                <div className="flex items-center gap-2 text-stone-400 border-b border-stone-900 pb-2 mb-2 uppercase text-[10px] tracking-wider">
                  <Database className="w-3.5 h-3.5 text-amber-500" />
                  Bitácora de Eventos de Almacenamiento (Logs de Transacción)
                </div>
                <div className="h-28 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                  {dbLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`leading-relaxed text-[11px] ${
                        log.includes("INSERT")
                          ? "text-emerald-400"
                          : log.includes("UPDATE")
                          ? "text-sky-400"
                          : log.includes("DELETE")
                          ? "text-red-400"
                          : log.includes("CARRITO")
                          ? "text-amber-400 font-medium"
                          : "text-stone-400"
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main table and form container */}
              <DatabaseExplorer
                sneakers={sneakers}
                onAddSneaker={handleAddSneaker}
                onUpdateSneaker={handleUpdateSneaker}
                onUpdateMultipleSneakers={handleUpdateMultipleSneakers}
                onDeleteSneaker={handleDeleteSneaker}
                onResetDatabase={handleResetDatabase}
                onRestoreDatabase={handleRestoreDatabase}
                onSeed1000Database={handleSeed1000Database}
                onImportMultiple={handleImportMultiple}
                adjustments={adjustments}
                onUndoLastAdjustment={handleUndoLastAdjustment}
                onUndoLast10Adjustments={handleUndoLast10Adjustments}
                onUndoSpecificAdjustment={handleUndoSpecificAdjustment}
                onClearAllSavedData={handleClearAllSavedData}
                replitStores={replitStores}
                setReplitStores={setReplitStores}
                repLogs={repLogs}
                onReplicateToSelectedStores={replicateToSelectedStores}
                employeeName={employeeName}
                onSetEmployeeName={setEmployeeName}
                currentStoreId={currentStoreId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Styled Footer */}
      <footer className="bg-stone-950 border-t border-stone-850 py-8 text-center text-xs font-mono text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>© {new Date().getFullYear()} JORDAN VAULT INC.</span>
            <span className="mx-2">|</span>
            <span>Estilo Retro & Curaduría de Reventa Única</span>
          </div>
          <div className="flex gap-4">
            <span className="text-stone-400">Instrucciones de Compra Segura</span>
            <span>•</span>
            <span className="text-stone-400">Base de Datos Protegida de Forma Local</span>
          </div>
        </div>
      </footer>

      {/* Slide dialogs, sidebars, modal forms */}
      <SneakerDetailModal
        sneaker={selectedSneaker}
        onClose={() => setSelectedSneaker(null)}
        onAddToCartWithSize={handleAddToCartWithSize}
        isAlreadyInDb={selectedSneaker ? sneakers.some((s) => s.reference === selectedSneaker.reference) : false}
        onImportToDatabase={(s) => {
          handleImportMultiple([s]);
          // Re-trigger select to update the modal buttons dynamically
          setSelectedSneaker((prev) => (prev ? { ...prev } : null));
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckoutComplete={handleCheckoutComplete}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}
