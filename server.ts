import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { generateUnifiedInitialCatalog } from "./src/shoopyService";
import { Sneaker } from "./src/types";
import localtunnel from "localtunnel";
import { syncStoreToFirestore, fetchStoreFromFirestore } from "./src/firebase-sync";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

let currTunnelUrl = "";

// Helper function to get database file path for a specific store or central SGBD
function getStoreDbPath(storeId: string): string {
  const safeId = storeId.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(process.cwd(), "src", `database_${safeId}.json`);
}

// Helper function to load products for a specific store
function loadStoreSneakersDB(storeId: string): Sneaker[] {
  const filePath = getStoreDbPath(storeId);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      if (raw && raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading database for store ${storeId}:`, error);
  }
  
  // Clean empty array by default to satisfy "borra toda la informacion de productos que tenga este proyecto"
  const empty: Sneaker[] = [];
  saveStoreSneakersDB(storeId, empty);
  return empty;
}

// Helper function to save products for a specific store
function saveStoreSneakersDB(storeId: string, data: Sneaker[]) {
  const filePath = getStoreDbPath(storeId);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    // Hook up async Firebase Firestore synchronization
    syncStoreToFirestore(storeId, data).catch(err => {
      console.error("[Firebase Sync Hook Error]", err);
    });
  } catch (error) {
    console.error(`Failed to write database for store ${storeId}:`, error);
  }
}

// Global master database file path
const DB_FILE_PATH = path.join(process.cwd(), "src", "database_sgbd.json");
const AUDIT_LOG_PATH = path.join(process.cwd(), "src", "sgbd_operations_audit.json");

export interface AuditLog {
  id: string;
  timestamp: string;
  storeId: string;
  employee: string;
  action: string;
  details: string;
}

// Helper function to read audit logs
function loadAuditLogs(): AuditLog[] {
  try {
    if (fs.existsSync(AUDIT_LOG_PATH)) {
      const raw = fs.readFileSync(AUDIT_LOG_PATH, "utf-8");
      if (raw && raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch (error) {
    console.error("Error reading sgbd_operations_audit.json:", error);
  }
  return [];
}

// Helper function to write audit logs
function saveAuditLogs(logs: AuditLog[]) {
  try {
    fs.writeFileSync(AUDIT_LOG_PATH, JSON.stringify(logs, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to sgbd_operations_audit.json:", error);
  }
}

// Utility to push an audit log entry on request
function recordLog(storeId: string, employee: string, action: string, details: string) {
  const newLog: AuditLog = {
    id: Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
    storeId: storeId,
    employee: employee || "Administrador",
    action: action,
    details: details
  };
  const logs = loadAuditLogs();
  logs.unshift(newLog);
  if (logs.length > 500) {
    logs.length = 500; // Cap to prevent infinite file size
  }
  saveAuditLogs(logs);
}

// Helper function to load global master sneakers database
function loadSneakersDB(): Sneaker[] {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      if (raw && raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Return empty to comply with deleting existing products
          return [];
        }
      }
    }
  } catch (error) {
    console.error("Error reading database_sgbd.json:", error);
  }
  
  return [];
}

// Helper function to save global master sneakers database
function saveSneakersDB(data: Sneaker[]) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to database_sgbd.json:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // RESTORE AND SYNC DATABASES WITH FIREBASE FIRESTORE ON STARTUP
  const storesToSync = ["store-1", "store-2", "store-3", "store-4"];
  for (const stId of storesToSync) {
    try {
      const dbPath = getStoreDbPath(stId);
      let localExists = fs.existsSync(dbPath);
      let localProducts: Sneaker[] = [];
      if (localExists) {
        const raw = fs.readFileSync(dbPath, "utf-8");
        if (raw && raw.trim()) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            localProducts = parsed;
          }
        }
      }
      
      // If local database file is empty/non-existent, recover from cloud Firestore
      if (localProducts.length === 0) {
        console.log(`[Startup Recovery] El almacén local de la tienda ${stId} está vacío. Buscando restauración en Firestore...`);
        const cloudProducts = await fetchStoreFromFirestore(stId);
        if (cloudProducts && cloudProducts.length > 0) {
          fs.writeFileSync(dbPath, JSON.stringify(cloudProducts, null, 2), "utf-8");
          console.log(`[Startup Recovery] ¡Tienda ${stId} restaurada exitosamente con ${cloudProducts.length} productos desde Firestore!`);
        } else {
          console.log(`[Startup Recovery] No se encontraron registros consolidados en la nube para la tienda ${stId}.`);
        }
      } else {
        console.log(`[Startup Coordinator] La tienda ${stId} ya cuenta con ${localProducts.length} productos locales. Resincronizando hacia Firestore...`);
        // Force sync local back to Firestore to ensure cloud is perfectly coordinated with our master disk copy
        syncStoreToFirestore(stId, localProducts).catch(err => {
          console.error(`[Startup Re-sync error for ${stId}]`, err);
        });
      }
    } catch (restoreErr) {
      console.error(`[Startup Recovery Error] Error restaurando tienda ${stId} con Firestore:`, restoreErr);
    }
  }

  // Initialize server database cache
  let sneakersCache = loadSneakersDB();

  // CORS-like behavior for local connections or cross-subdomains
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-SGBD-Auth, x-sgbd-employee");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Tunnel endpoint for external access
  app.get("/api/tunnel", (req, res) => {
    res.json({ url: currTunnelUrl });
  });

  // REST API Endpoints

  // --- COMPREHENSIVE DIRECT API ROUTES FOR EACH STORE SESSION ---
  
  // Helper to extract employee name from request headers, query parameters or body
  const getEmployeeName = (req: express.Request): string => {
    return (req.headers["x-sgbd-employee"] || req.query.employee || req.body._employeeName || "Empleado de Tienda") as string;
  };

  // 1. Get products of a specific store
  app.get("/api/stores/:storeId/products", (req, res) => {
    const storeId = req.params.storeId;
    const storeProducts = loadStoreSneakersDB(storeId);
    res.json(storeProducts);
  });

  // 2. Get diagnostic status for a specific store session
  app.get("/api/stores/:storeId/status", (req, res) => {
    const storeId = req.params.storeId;
    const storeProducts = loadStoreSneakersDB(storeId);
    res.json({
      status: "online",
      storeId: storeId,
      totalProducts: storeProducts.length,
      databaseFile: `database_${storeId}.json`,
      version: "4.2-Secure (Partitioned)",
      timestamp: new Date().toISOString()
    });
  });

  // 3. Add single product to a specific store
  app.post("/api/stores/:storeId/products", (req, res) => {
    const storeId = req.params.storeId;
    const newProduct: Sneaker = req.body;
    if (!newProduct || !newProduct.id) {
      return res.status(400).json({ error: "Datos de producto no válidos" });
    }

    const storeProducts = loadStoreSneakersDB(storeId);
    
    // Check if duplicate SKU exists in this store
    if (storeProducts.some(s => s.reference === newProduct.reference)) {
      return res.status(409).json({ error: `El código SKU ${newProduct.reference} ya existe de forma exclusiva en esta tienda.` });
    }

    storeProducts.unshift(newProduct);
    saveStoreSneakersDB(storeId, storeProducts);

    // Save Audit Log
    const employee = getEmployeeName(req);
    recordLog(storeId, employee, "AGREGAR_PRODUCTO", `Se agregó el producto: "${newProduct.name}" | Referencia/SKU: ${newProduct.reference} | Precio: $${newProduct.marketPrice}.`);

    res.status(201).json({ success: true, product: newProduct });
  });

  // 4. Update single product in a specific store
  app.put("/api/stores/:storeId/products/:id", (req, res) => {
    const storeId = req.params.storeId;
    const id = req.params.id;
    const body: Sneaker = req.body;
    
    const storeProducts = loadStoreSneakersDB(storeId);
    const index = storeProducts.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el almacén de esta tienda" });
    }

    const oldName = storeProducts[index].name;
    storeProducts[index] = { ...storeProducts[index], ...body };
    saveStoreSneakersDB(storeId, storeProducts);

    // Save Audit Log
    const employee = getEmployeeName(req);
    recordLog(storeId, employee, "MODIFICAR_PRODUCTO", `Se modificó el producto: "${oldName}" (ID: ${id}) | Campos actualizados de forma exclusiva.`);

    res.json({ success: true, product: storeProducts[index] });
  });

  // 5. Delete single product of a specific store
  app.delete("/api/stores/:storeId/products/:id", (req, res) => {
    const storeId = req.params.storeId;
    const id = req.params.id;
    
    let storeProducts = loadStoreSneakersDB(storeId);
    const initialLen = storeProducts.length;
    const removedItem = storeProducts.find(s => s.id === id);
    storeProducts = storeProducts.filter(s => s.id !== id);
    
    if (storeProducts.length === initialLen) {
      return res.status(404).json({ error: "Producto no encontrado en esta tienda" });
    }

    saveStoreSneakersDB(storeId, storeProducts);

    // Save Audit Log
    const employee = getEmployeeName(req);
    const details = removedItem 
      ? `Se eliminó el producto: "${removedItem.name}" | Referencia/SKU: ${removedItem.reference}`
      : `Se eliminó el producto con ID: ${id}`;
    recordLog(storeId, employee, "ELIMINAR_PRODUCTO", details);

    res.json({ success: true, id });
  });

  // 6. Synchronize complete catalog for a specific store session
  app.post("/api/stores/:storeId/sync-multiple", (req, res) => {
    const storeId = req.params.storeId;
    const list = req.body;
    if (Array.isArray(list)) {
      saveStoreSneakersDB(storeId, list);

      // Save Audit Log
      const employee = getEmployeeName(req);
      recordLog(storeId, employee, "SINCRONIZAR_CATALOGO", `Se cargó/sincronizó base de datos. Total registros: ${list.length} productos guardados.`);

      return res.json({ success: true, count: list.length, message: `Catálogo de tienda ${storeId} sincronizado con éxito.` });
    }
    res.status(400).json({ error: "Formato no válido. Se esperaba una lista de productos en formato JSON." });
  });

  // 7. Get global audit logs (for Master Admin)
  app.get("/api/audit-logs", (req, res) => {
    res.json(loadAuditLogs());
  });

  // 8. Clear audit logs
  app.post("/api/audit-logs/clear", (req, res) => {
    saveAuditLogs([]);
    res.json({ success: true });
  });

  // --- GENERAL SGBD PORTAL ENDPOINTS ---

  // 1. Get status diagnostic info
  app.get("/api/status", (req, res) => {
    res.json({
      status: "online",
      service: "CONSOLA INDUSTRIAL SGBD SERVER PRESTASI",
      version: "3.2.0-LTS",
      environment: process.env.NODE_ENV || "development",
      totalProducts: sneakersCache.length,
      databaseFileExists: fs.existsSync(DB_FILE_PATH),
      databaseFileBytes: fs.existsSync(DB_FILE_PATH) ? fs.statSync(DB_FILE_PATH).size : 0,
      timestamp: new Date().toISOString()
    });
  });

  // 2. Get all products (with pagination & filter helpers if needed)
  app.get("/api/products", (req, res) => {
    res.json(sneakersCache);
  });

  // 3. Get single product by ID
  app.get("/api/products/:id", (req, res) => {
    const item = sneakersCache.find(s => s.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Product not found inside SGBD database" });
    }
    res.json(item);
  });

  // 4. Synchronize complete catalog from frontend updates
  app.post("/api/products/sync-multiple", (req, res) => {
    const list = req.body;
    if (Array.isArray(list)) {
      sneakersCache = list;
      saveSneakersDB(sneakersCache);
      return res.json({ success: true, count: sneakersCache.length, message: "Host DB synchronized successfully." });
    }
    res.status(400).json({ error: "Invalid payload format. Expected Sneaker[] array." });
  });

  // 5. Add single product
  app.post("/api/products", (req, res) => {
    const newProduct: Sneaker = req.body;
    if (!newProduct || !newProduct.id) {
      return res.status(400).json({ error: "Invalid product fields" });
    }
    
    // Check if duplicate SKU exists
    if (sneakersCache.some(s => s.reference === newProduct.reference)) {
      return res.status(409).json({ error: `El código SKU ${newProduct.reference} ya existe.` });
    }

    sneakersCache.unshift(newProduct);
    saveSneakersDB(sneakersCache);
    res.status(201).json({ success: true, product: newProduct });
  });

  // 6. Update single product
  app.put("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const body: Sneaker = req.body;
    
    const index = sneakersCache.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Product not found inside SGBD database" });
    }

    sneakersCache[index] = { ...sneakersCache[index], ...body };
    saveSneakersDB(sneakersCache);
    res.json({ success: true, product: sneakersCache[index] });
  });

  // URL Crawler Scraper powered by server-side Gemini 3.5 Flash
  app.post("/api/products/import-url", async (req, res) => {
    const { url, storeId } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Debe proporcionar una URL válida de producto" });
    }

    console.log(`[Crawler SGBD] Solicitando escaneo de producto de la URL: ${url} para la tienda ${storeId || "central"}`);
    
    // Step 1: Attempt direct server-side fetch of the HTML content
    let htmlText = "";
    try {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        const fetchRes = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
          }
        });
        if (fetchRes.ok) {
          const rawText = await fetchRes.text();
          // Crop raw text to avoid overflowing context window, taking first 30,000 chars which contains full body metadata
          htmlText = rawText.slice(0, 30000);
          console.log(`[Crawler SGBD] Descargado contenido HTML con longitud: ${rawText.length} bytes. Recortado a: ${htmlText.length}`);
        } else {
          console.log(`[Crawler SGBD] Servidor remoto respondió con estado: ${fetchRes.status}. Usando inferencia profunda.`);
        }
      }
    } catch (err) {
      console.warn(`[Crawler SGBD Warning] Error al intentar descargar directamente del origen:`, err);
    }

    // Step 2: Query Gemini 3.5 Flash using structured output formats matching our Sneaker interface
    try {
      const userPrompt = `
Analiza y extrae el 100% de la información comercial de este producto de comercio electrónico.
URL original del producto: ${url}

Contenido HTML o texto crudo obtenido de la página (parcial):
${htmlText || "No se pudo descargar el html directamente debido a restricciones de seguridad del servidor remoto. Por favor, infiere de forma fidedigna y con máxima calidad los atributos basándote en el formato y nombre de la URL."}

Genera una representación de tipo Sneaker completando de forma fidedigna todos los campos de las características del producto como imagen principal, carrusel de fotos secundarias (de 1 a 5 imágenes fidedignas o URLs libres de alta calidad), precio de venta al público en USD/EUR (marketPrice), precio de venta minorista listado (retailPrice), descripción técnica detallada, especificaciones/tecnologías o etiquetas, categoría de pertenencia, silueta de clasificación, valoración de usuarios (rating), etc.

Asegúrate de que 'images' contenga al menos 1 y máximo 5 imágenes reales y de alta calidad relacionadas al producto, y que 'imageUrl' sea idéntica a la primera imagen de la lista.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: `Eres un extractor industrial de catálogos e-commerce para un Sistema de Gestión de Bases de Datos (SGBD). Debes reconstruir el 100% del contenido con absoluta veracidad y formato limpio sin omitir características.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Nombre completo y explícito del producto comercial" },
              reference: { type: Type.STRING, description: "Código único de referencia o SKU (ej. CP-8849-A)" },
              silhouette: { type: Type.STRING, description: "Subcategoría o silueta específica del producto" },
              colorway: { type: Type.STRING, description: "Combinación de colores o variación estilística" },
              releaseDate: { type: Type.STRING, description: "Año o temporada de lanzamiento de este stock (ej. '2026')" },
              designer: { type: Type.STRING, description: "Creador o distribuidor oficial" },
              retailPrice: { type: Type.NUMBER, description: "Precio sugerido de lista original" },
              marketPrice: { type: Type.NUMBER, description: "Precio activo de comercialización (número flotante)" },
              imageUrl: { type: Type.STRING, description: "URL de la imagen de portada principal" },
              description: { type: Type.STRING, description: "Descripción sumamente detallada, especificaciones físicas y características clave del contenido" },
              technology: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista de 3 a 5 tecnologías o atributos específicos del producto"
              },
              inventory: { type: Type.NUMBER, description: "Cantidad inicial de inventario disponible para almacén" },
              featured: { type: Type.BOOLEAN, description: "Si es un producto recomendado o destacado" },
              rating: { type: Type.NUMBER, description: "Calificación media de 1.0 a 5.0" },
              category: { type: Type.STRING, description: "Categoría macro del catálogo" },
              catalog: { type: Type.STRING, description: "Nombre del distribuidor o origen del scraping" },
              images: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Escribe de 1 a 5 URLs completas de las imágenes de este producto. La primera debe coincidir con imageUrl"
              },
              productUrl: { type: Type.STRING, description: "La URL origen scrapeada" }
            },
            required: [
              "name", "reference", "silhouette", "colorway", "releaseDate", "designer", 
              "retailPrice", "marketPrice", "imageUrl", "description", "technology", 
              "inventory", "featured", "rating", "category", "catalog", "images", "productUrl"
            ]
          }
        }
      });

      const jsonString = response.text?.trim() || "";
      if (!jsonString) {
        throw new Error("El modelo inteligente retornó una respuesta de estructuración vacía.");
      }

      const cleanItem: Sneaker = JSON.parse(jsonString);
      // Ensure the generated item has a unique ID to identify it inside Cipr1
      cleanItem.id = `cipr1-crawl-${Math.floor(Math.random() * 900000) + 100000}`;
      
      // Force references to look professional
      if (!cleanItem.reference) {
        cleanItem.reference = `CP-RAW-${Math.floor(Math.random() * 90000)}`;
      }

      // If storeId is provided, save it directly to that store's isolated sandbox
      if (storeId) {
        const storeProducts = loadStoreSneakersDB(storeId);
        
        // Ensure reference uniqueness inside this store partition
        const exists = storeProducts.some(s => s.reference === cleanItem.reference);
        if (exists) {
          cleanItem.reference += `-${Math.floor(Math.random() * 99)}`;
        }

        storeProducts.unshift(cleanItem);
        saveStoreSneakersDB(storeId, storeProducts);

        // Track operation in master audit log
        const employee = getEmployeeName(req);
        recordLog(
          storeId, 
          employee, 
          "CRAWLER_IMPORT", 
          `SGBD Inteligente recuperó producto con éxito desde URL: "${cleanItem.name}" | Referencia/SKU: ${cleanItem.reference} | Precio: $${cleanItem.marketPrice}.`
        );
      } else {
        // Master Catalog save fallback
        const exists = sneakersCache.some(s => s.reference === cleanItem.reference);
        if (exists) {
          cleanItem.reference += `-${Math.floor(Math.random() * 99)}`;
        }
        sneakersCache.unshift(cleanItem);
        saveSneakersDB(sneakersCache);
      }

      console.log(`[Crawler SGBD] ¡Producto importado exitosamente desde la URL! Nombre: ${cleanItem.name}`);
      res.status(201).json({ success: true, product: cleanItem });

    } catch (parseErr: any) {
      console.error("[Crawler SGBD Error] Error procesando importación por IA:", parseErr);
      res.status(500).json({ error: `Fallo al recuperar los datos del producto vía IA: ${parseErr.message || parseErr}` });
    }
  });

  // Multimodal Product Image Analyzer powered by Gemini 3.5 Flash
  app.post("/api/products/analyse-images", async (req, res) => {
    const { images } = req.body;
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "Debe proporcionar al menos 1 imagen para analizar" });
    }

    try {
      console.log(`[Análisis IA SGBD] Analizando ${images.length} imágenes enviadas...`);
      
      const contentsList: any[] = [];
      for (const img of images) {
        if (img.data && img.mimeType) {
          // Strip data URI scheme prefix if present
          const cleanBase64 = img.data.replace(/^data:image\/\w+;base64,/, "");
          contentsList.push({
            inlineData: {
              data: cleanBase64,
              mimeType: img.mimeType
            }
          });
        }
      }

      contentsList.push(`
Analiza las imágenes proporcionadas y extrae detalladamente la información comercial y características del producto fotografiado.
Genera una respuesta en formato JSON con la estructura del modelo Sneaker, completando todos los campos requeridos de forma coherente con la realidad observada en las fotos.
Crea descripciones técnicas atractivas basadas en las texturas, logos, o etiquetas que logres visualizar.
`);

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentsList,
        config: {
          systemInstruction: "Eres un registrador de inventario especialista en tasación de e-commerce para SGBD Cipr1. Analiza el contenido de las imágenes del catálogo con máxima veracidad.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Nombre comercial completo del artículo fotografiado" },
              reference: { type: Type.STRING, description: "Referencia única o SKU estimado coherente" },
              silhouette: { type: Type.STRING, description: "Subcategoría o tipo de silueta/modelo (ej. Gafas Aviador, Auriculares Bluetooth)" },
              colorway: { type: Type.STRING, description: "Gama cromática del producto" },
              releaseDate: { type: Type.STRING, description: "Año estimado de lanzamiento" },
              designer: { type: Type.STRING, description: "Diseñador o fabricante" },
              retailPrice: { type: Type.NUMBER, description: "Precio minorista promedio sugerido de lista" },
              marketPrice: { type: Type.NUMBER, description: "Precio de reventa estimado de mercado del catálogo" },
              description: { type: Type.STRING, description: "Descripción detallada del artículo, observaciones del material, costura, presentación y acabados vistos en fotos." },
              technology: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista de 3 a 5 tecnologías o materiales especiales incorporados"
              },
              inventory: { type: Type.NUMBER, description: "Inventario recomendado para asignar" },
              featured: { type: Type.BOOLEAN, description: "Si es un producto altamente recomendado" },
              rating: { type: Type.NUMBER, description: "Valoración coherente del artículo de 1.0 a 5.0" },
              category: { type: Type.STRING, description: "Categoría macro del catálogo" }
            },
            required: [
              "name", "reference", "silhouette", "colorway", "releaseDate", "designer", 
              "retailPrice", "marketPrice", "description", "technology", "inventory", 
              "featured", "rating", "category"
            ]
          }
        }
      });

      const jsonString = response.text?.trim() || "";
      if (!jsonString) {
        throw new Error("El modelo retornó una respuesta de análisis vacía.");
      }

      const analysisResult = JSON.parse(jsonString);
      res.json({ success: true, analysis: analysisResult });

    } catch (err: any) {
      console.error("[Análisis IA SGBD Error] Fallo al evaluar fotos:", err);
      res.status(500).json({ error: `Fallo al procesar analítica de imágenes por IA: ${err.message || err}` });
    }
  });

  // 7. Delete single product
  app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const initialLen = sneakersCache.length;
    sneakersCache = sneakersCache.filter(s => s.id !== id);
    
    if (sneakersCache.length === initialLen) {
      return res.status(404).json({ error: "Product not found inside SGBD database" });
    }

    saveSneakersDB(sneakersCache);
    res.json({ success: true, id });
  });

  // 8. Hard Reset Database
  app.post("/api/reset", (req, res) => {
    sneakersCache = generateUnifiedInitialCatalog();
    saveSneakersDB(sneakersCache);
    res.json({ success: true, count: sneakersCache.length });
  });

  // Vite development middleware vs production static files server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted as Express middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Serving static production build files from: ${distPath}`);
  }

  const server = app.listen(PORT, "0.0.0.0", async () => {
    console.log(`--------------------------------------------------`);
    console.log(`🚀 SGBD 'SERVER' ACTIVE AND RUNNING ON PORT ${PORT}`);
    console.log(`🔗 Interface Local: http://localhost:${PORT}`);
    console.log(`🔗 Admin API Host: http://localhost:${PORT}/api/products`);
    
    // Start localtunnel for secure and direct JSON access (bypassing private preview cookies)
    try {
      console.log("Starting secure tunnel on port 3000 to bypass private preview redirections...");
      const tunnel = await localtunnel({ port: PORT });
      currTunnelUrl = tunnel.url;
      console.log(`🔥 TUNNEL EXPUESTO EXCLUSIVO: ${currTunnelUrl}`);
      console.log(`👉 SGBD Endpoint: ${currTunnelUrl}/api/stores/store-1/products`);
      console.log(`--------------------------------------------------`);

      tunnel.on("close", () => {
        console.log("Tunnel closed");
      });
    } catch (err) {
      console.error("Error setting up localtunnel:", err);
    }
  });
}

startServer();
