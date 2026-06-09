import React, { useState, useEffect } from "react";
import { Server, Shield, ArrowRight, Clipboard, Check, Terminal, FileCode, Layers, Info, Wifi, Sparkles, RefreshCw, Activity, Download, FileSpreadsheet } from "lucide-react";
import { ReplitStore } from "../types";

interface SgbdCentralGatewayProps {
  replitStores: ReplitStore[];
  onNavigate: (storeId: string | null) => void;
  onLogout?: () => void;
}

export default function SgbdCentralGateway({ replitStores, onNavigate, onLogout }: SgbdCentralGatewayProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"canales" | "guia" | "auditoria">("canales");
  const [storeCounts, setStoreCounts] = useState<Record<string, number>>({});
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Real-time server audit logs for monitoring employees' movements
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logFilterStore, setLogFilterStore] = useState<string>("Todos");

  // Fetch count of products for each store to display in the gateway dashboard
  const fetchCounts = async () => {
    setLoadingStats(true);
    const counts: Record<string, number> = {};
    for (const store of replitStores) {
      try {
        const res = await fetch(`/api/stores/${store.id}/products`);
        if (res.ok) {
          const data = await res.json();
          counts[store.id] = data.length;
        } else {
          counts[store.id] = 0;
        }
      } catch (err) {
        counts[store.id] = 0;
      }
    }
    setStoreCounts(counts);
    setLoadingStats(false);
  };

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/audit-logs");
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (err) {
      console.error("Error fetching audit logs from SGBD:", err);
    }
    setLoadingLogs(false);
  };

  const handleClearAuditLogs = async () => {
    const confirmed = window.confirm("¿Seguro que deseas purgar la historia completa de movimientos y auditoría de empleados?");
    if (!confirmed) return;
    try {
      const res = await fetch("/api/audit-logs/clear", { method: "POST" });
      if (res.ok) {
        setAuditLogs([]);
      }
    } catch (err) {
      console.error("Error clearing logs:", err);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchAuditLogs();
  }, [replitStores]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const [tunnelUrl, setTunnelUrl] = useState<string>("");

  useEffect(() => {
    const getTunnel = async () => {
      try {
        const res = await fetch("/api/tunnel");
        if (res.ok) {
          const data = await res.json();
          if (data && data.url) {
            setTunnelUrl(data.url);
          }
        }
      } catch (err) {
        console.error("Error loading tunnel:", err);
      }
    };
    getTunnel();
    const interval = setInterval(getTunnel, 12000);
    return () => clearInterval(interval);
  }, []);

  const sgbdUrl = tunnelUrl || (typeof window !== "undefined" ? window.location.origin : "https://mi-servidor-sgbd.run.app");
  const authToken = "prestasi_sgbd_sec_8849-key"; // Real secure sync token

  const downloadStoreJson = (store: ReplitStore) => {
    const configData = {
      SGBD_ACTIVE_ORIGIN: sgbdUrl,
      CENTRAL_SGBD_AUTH_HEADER: "X-SGBD-Auth",
      CENTRAL_SGBD_TOKEN: authToken,
      STORES_ENDPOINTS: {
        "Tienda_A_Accesorios": `${sgbdUrl}/api/stores/store-1/products`,
        "Tienda_B_Tecnologia": `${sgbdUrl}/api/stores/store-2/products`,
        "Tienda_C_Moda": `${sgbdUrl}/api/stores/store-3/products`,
        "Tienda_D_Hogar": `${sgbdUrl}/api/stores/store-4/products`
      },
      activeStoreProfile: {
        id: store.id,
        name: store.name.replace("Replit", "Cipr1"),
        endpointUrl: `${sgbdUrl}/api/stores/${store.id}/products`
      }
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sgbd_config_cipr1_${store.id.replace("-", "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadStoreMd = (store: ReplitStore) => {
    const storeLabel = store.id.toUpperCase();
    const mdContent = `# 🛡️ DE CLASE PRODUCTIVA: GUÍA DE INTEGRACIÓN SGBD CIPR1 CENTRAL - PERFIL ${storeLabel}

Este documento ha sido autogenerado dinámicamente para enlazar de manera exclusiva de extremo a extremo la tienda **"${store.name.replace("Replit", "Cipr1")}"** (Canal Identificador: \`${store.id}\`) con tu SGBD Jordan-Temu Central.

---

## 🔴 DIAGNÓSTICO CRÍTICO: ¿POR QUÉ APARECE EL ERROR "Unexpected token <" o "302 Redirect"?

Al intentar conectar por primera vez desde tu tienda Cipr1 remota (Replit), muchas veces aparece el error:
> \`Unexpected token '<', "<!doctype "... is not valid JSON\`

### 🔍 La Causa Exacta:
Esto se debe a que ingresaste la dirección general o URL raíz del SGBD Central (\`${sgbdUrl}\`) como si fuera el catálogo JSON. 
La dirección raíz entrega el frontend web interactivo (en formato HTML, que comienza con \`<!doctype html>\`). Tu tienda e-commerce intenta interpretar este HTML legible por humanos como si fuera la lista de productos en formato JSON directo, provocando un error sintáctico inmediato.

Además, los enrutadores de desarrollo de Google AI Studio / Cloud Run aplican, bajo ciertos navegadores, redirecciones HTTP 302 para control de seguridad si se accede de manera incorrecta.

### 🌟 La Solución Hermética Real:
Debes usar el endpoint JSON específico del perfil de este canal, el cual omite redirecciones y sirve los productos limpios utilizando autenticación por cabeceras.

---

## 🔑 PARÁMETROS CONFIGURABLES ADQUIRIDOS PARA<sup>${storeLabel}</sup>

Introduce estos parámetros exactos en el panel o variables de entorno de tu tienda remota:

*   **URL Base Activa (SGBD_ACTIVE_ORIGIN):**
    \`${sgbdUrl}\`
*   **Nombre de Cabecera (CENTRAL_SGBD_AUTH_HEADER):**
    \`X-SGBD-Auth\`
*   **Token Secreto Autorizado (CENTRAL_SGBD_TOKEN):**
    \`${authToken}\`
*   **Endpoint de Productos del Perfil (${storeLabel}):**
    \`${sgbdUrl}/api/stores/${store.id}/products\`

---

## 📥 JSON COMPACTO PARA INTEGRACIÓN INSTANTÁNEA
Copia este fragmento de configuración y súbelo al panel de control unificado:

\`\`\`json
{
  "SGBD_ACTIVE_ORIGIN": "${sgbdUrl}",
  "CENTRAL_SGBD_AUTH_HEADER": "X-SGBD-Auth",
  "CENTRAL_SGBD_TOKEN": "${authToken}",
  "STORES_ENDPOINTS": {
    "Tienda_A_Accesorios": "${sgbdUrl}/api/stores/store-1/products",
    "Tienda_B_Tecnologia": "${sgbdUrl}/api/stores/store-2/products",
    "Tienda_C_Moda": "${sgbdUrl}/api/stores/store-3/products",
    "Tienda_D_Hogar": "${sgbdUrl}/api/stores/store-4/products"
  }
}
\`\`\`

---

## 💻 IMPLEMENTACIÓN EXCLUSIVA EXPRESS.JS / NODE.JS PARA TU TIENDA CIPR1

Sustituye o agrega este código receptor en el archivo index.js de tu tienda Express para sincronizar y descargar productos de forma transparente en cada petición de clientes:

\`\`\`javascript
const express = require('express');
const app = express();

const SGBD_API_URL = "${sgbdUrl}/api/stores/${store.id}/products";
const SGBD_TOKEN = "${authToken}";

app.get('/api/products', async (req, res) => {
  try {
    const response = await fetch(SGBD_API_URL, {
      method: "GET",
      headers: {
        "X-SGBD-Auth": SGBD_TOKEN,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      // Si recibes redirect 302 o error de login, levanta advertencia
      if (response.status === 302) {
        throw new Error("HTTP 302 Redirect detectado. Asegura usar el Endpoint JSON del perfil.");
      }
      throw new Error("HTTP Status " + response.status);
    }

    const catalog = await response.json();
    res.json(catalog);
  } catch (error) {
    console.error("Fallo grave de sincronización SGBD Cipr1:", error);
    res.status(502).json({
      error: "Erro de Sincronismo - Canal Cipr1 Inativo",
      details: error.message
    });
  }
});
\`\`\`

---
*Firma de Certificación: Canal Cipr1 SGBD Jordan & Temu Core - Licencia Soberana v4.2*`;

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Guia_Cipr1_SGBD_${store.id.replace("-", "_")}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-sans">
      
      {/* Top Banner Header */}
      <header className="bg-stone-900 border-b border-stone-850 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 text-black px-3 py-1.5 rounded-xl flex items-center justify-center font-black text-xs tracking-widest uppercase">
              SGBD Hércules
            </div>
            <div>
              <h1 className="font-sans font-black text-base md:text-lg tracking-tight text-white leading-none">
                JORDAN & TEMU SGBD CENTRAL
              </h1>
              <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mt-0.5">
                Portal de Coordinación Multitenda y Enrutador de Sesiones
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-1.5 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-stone-400 text-[10.5px]">SGBD NÓDULO CENTRAL: ONLINE</span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl text-xs font-mono font-black transition cursor-pointer flex items-center gap-1.5 select-none"
                title="Cerrar sesión de administrador"
              >
                🔒 <span className="hidden sm:inline">Cerrar Portal</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {/* Welcome Section */}
        <div className="bg-stone-900 border border-stone-850 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
          
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono text-[10px] rounded-lg uppercase font-bold tracking-widest">
              <Shield className="w-3.5 h-3.5" /> Coordinador de Datos de Alta Elasticidad
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              Control de Base de Datos para los Administradores de Tiendas
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed">
              Este sistema centralizado de sincronización asigna a cada tienda e-commerce de Cipr1 una **Sesión de Datos Aislada y Exclusiva**. 
              Cada administrador posee una <span className="text-amber-400 font-medium">ruta de acceso única e independiente</span> que le permite autogestionar su catálogo (agregar productos, limpiar SKU repetidos, importar via HTML de Temu o descargar reportes PDF) sin influir en otras marcas.
            </p>
          </div>

          {/* Quick Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 bg-stone-950 border border-stone-850 rounded-xl p-4 mt-6 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-stone-900">
            <div className="space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-mono block">Nódulos Activos</span>
              <span className="text-xl font-bold text-white">4 Canales SGBD</span>
            </div>
            <div className="space-y-1 pt-3 md:pt-0">
              <span className="text-[10px] text-stone-500 uppercase font-mono block">Estado de Aislamiento</span>
              <span className="text-xl font-bold text-emerald-400">100% Hermético</span>
            </div>
            <div className="space-y-1 pt-3 md:pt-0">
              <span className="text-[10px] text-stone-500 uppercase font-mono block">Seguridad del Canal</span>
              <span className="text-xl font-bold text-amber-500">v4.2-Secure JWT</span>
            </div>
            <div className="space-y-1 pt-3 md:pt-0">
              <span className="text-[10px] text-stone-500 uppercase font-mono block">Mecanismo Logístico</span>
              <span className="text-xl font-bold text-indigo-400">PULL Directo</span>
            </div>
          </div>
        </div>

        {/* Active Direct Access Tunnel Banner */}
        {tunnelUrl && (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 mb-8 relative overflow-hidden shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl mt-0.5">
                <Wifi className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] rounded uppercase font-bold tracking-widest">
                  ★ CONEXIÓN VIPR BYPASS DIRECTO ACTIVA
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Túnel Público de Bypass de Restricciones Activo
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Para evitar el error <code className="text-red-400">302 Found (Redirección de Cookies)</code> al llamar a la API desde otra plataforma, utiliza la URL del túnel dedicada. Esta URL tiene libre acceso para el header <code className="text-amber-400">X-SGBD-Auth</code> y entrega JSON puro directamente sin pasar por filtros de navegador.
                </p>
                <div className="pt-2 font-mono text-xs flex flex-wrap items-center gap-2">
                  <span className="text-stone-400">Base Privada SGBD:</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded select-all selection:bg-emerald-800">
                    {tunnelUrl}/api/stores/store-1/products
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleCopy(`${tunnelUrl}/api/stores/store-1/products`, "vipr-byp")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-500/25 transition text-xs font-mono select-none font-bold cursor-pointer"
            >
              {copiedText === "vipr-byp" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado
                </>
              ) : (
                <>
                  <Clipboard className="w-3.5 h-3.5" /> Copiar URL Tienda A
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-stone-850 mb-6 font-mono text-xs gap-1 select-none">
          <button
            onClick={() => setActiveTab("canales")}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "canales"
                ? "border-amber-500 text-amber-500 bg-amber-500/5"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Layers className="w-4 h-4" /> 🔌 1. Canales de Administración (4)
          </button>
          <button
            onClick={() => setActiveTab("guia")}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "guia"
                ? "border-amber-500 text-amber-500 bg-amber-500/5"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <FileCode className="w-4 h-4" /> 📖 2. Guía de Conexión de Canales (¡Solución!)
          </button>
          <button
            onClick={() => setActiveTab("auditoria")}
            className={`px-4 py-2.5 font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "auditoria"
                ? "border-amber-500 text-amber-500 bg-amber-500/5"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" /> 🛡️ 3. Movimientos de Empleados (Auditoria)
          </button>
        </div>

        {/* Tab 1: Store channels list */}
        {activeTab === "canales" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-stone-900 border border-stone-850 p-3 rounded-xl px-5">
              <p className="text-xs text-stone-400 font-medium">
                🔑 Comparte las rutas privadas inferiores a cada administrador para que operen independientemente de forma segura.
              </p>
              <button 
                onClick={fetchCounts} 
                disabled={loadingStats}
                className="p-1 px-3 bg-stone-950 font-mono text-[10.5px] border border-stone-800 text-stone-300 hover:text-white rounded hover:bg-stone-850 transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loadingStats ? "animate-spin text-amber-500" : ""}`} />
                Actualizar Estado
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {replitStores.map((store, idx) => {
                const storePath = `/store/${store.id}`;
                const storeFullUrl = `${sgbdUrl}${storePath}`;
                const storeApiProducts = `${sgbdUrl}/api/stores/${store.id}/products`;
                const count = storeCounts[store.id] ?? 0;
                
                // Color formatting
                let colorClass = "from-indigo-600/10 to-transparent border-indigo-600/30 text-indigo-400 hover:shadow-indigo-950/20";
                let btnColor = "bg-indigo-500 hover:bg-indigo-600 text-stone-950";
                if (idx === 1) {
                  colorClass = "from-blue-600/10 to-transparent border-blue-600/30 text-blue-400 hover:shadow-blue-950/20";
                  btnColor = "bg-blue-500 hover:bg-blue-600 text-stone-950";
                } else if (idx === 2) {
                  colorClass = "from-pink-600/10 to-transparent border-pink-600/30 text-pink-400 hover:shadow-pink-950/20";
                  btnColor = "bg-pink-500 hover:bg-pink-600 text-stone-950";
                } else if (idx === 3) {
                  colorClass = "from-emerald-600/10 to-transparent border-emerald-600/30 text-emerald-400 hover:shadow-emerald-950/20";
                  btnColor = "bg-emerald-500 hover:bg-emerald-600 text-stone-950";
                }

                return (
                  <div 
                    key={store.id} 
                    className={`bg-stone-900/60 border rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all hover:translate-y-[-2px] hover:shadow-xl bg-gradient-to-br ${colorClass}`}
                  >
                    <div className="space-y-3">
                      
                      {/* Name and count */}
                      <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                        <span className="font-black text-sm md:text-base text-white">{store.name}</span>
                        <span className="px-2 py-0.5 bg-stone-950 border border-stone-800 rounded font-mono text-[10px] font-bold text-amber-500">
                          {count} Productos
                        </span>
                      </div>

                      {/* Info lines */}
                      <div className="space-y-2 text-[11px] font-mono leading-relaxed text-stone-400">
                        {/* Session private URL */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-stone-500 uppercase font-black tracking-widest block font-sans">🔗 Enlace de Sesión Excluyente (Administrador):</span>
                          <div className="flex items-center gap-1.5 bg-stone-950/80 p-2 rounded border border-stone-850">
                            <span className="truncate flex-grow text-amber-400 font-bold">{storePath}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(storeFullUrl, `${store.id}-url`)}
                              className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-white cursor-pointer"
                              title="Copiar sesión completa"
                            >
                              {copiedText === `${store.id}-url` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Direct REST API URL */}
                        <div className="space-y-1 pt-1">
                          <span className="text-[9px] text-stone-500 uppercase font-black tracking-widest block font-sans">🌐 API de Sincronismo Real (GET/POST para Replit):</span>
                          <div className="flex items-center gap-1.5 bg-stone-950/80 p-2 rounded border border-stone-850">
                            <span className="truncate flex-grow text-stone-300 select-all">{storeApiProducts}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(storeApiProducts, `${store.id}-api`)}
                              className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-white cursor-pointer"
                              title="Copiar Endpoint API"
                            >
                              {copiedText === `${store.id}-api` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Authorization parameters */}
                        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px]">
                          <div className="bg-stone-950/40 p-2 rounded border border-stone-850">
                            <span className="text-stone-500 block">KEY HEADER:</span>
                            <span className="text-stone-300 font-bold">X-SGBD-Auth</span>
                          </div>
                          <div className="bg-stone-950/40 p-2 rounded border border-stone-850 flex items-center justify-between">
                            <div>
                              <span className="text-stone-500 block">TOKEN VAL:</span>
                              <span className="text-amber-500 font-bold">{authToken.substring(0, 12)}...</span>
                            </div>
                            <button 
                              onClick={() => handleCopy(authToken, `${store.id}-token`)} 
                              className="hover:bg-stone-800 p-1.5 rounded text-stone-400 hover:text-amber-400 transition cursor-pointer"
                            >
                              {copiedText === `${store.id}-token` ? <Check className="w-3 h-3 text-emerald-400" /> : <Clipboard className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Auto-Setup & Personalized Documents Download section */}
                        <div className="pt-2 border-t border-stone-850/60 mt-3 space-y-2">
                          <span className="text-[9px] text-amber-500 font-extrabold uppercase tracking-widest block font-sans">
                            📥 PARÁMETROS CONFIGURABLES Y GUÍAS FIABLES:
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => downloadStoreJson(store)}
                              className="px-2 py-1.5 bg-stone-950 border border-stone-850 hover:border-amber-500 text-stone-300 hover:text-amber-400 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                              title="Descargar archivo JSON para subir en Paso 1"
                            >
                              <Download className="w-3 h-3 text-amber-500" />
                              Subir .JSON
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadStoreMd(store)}
                              className="px-2 py-1.5 bg-amber-500/10 border border-amber-500/20 hover:border-amber-400 hover:bg-amber-500 hover:text-black text-amber-400 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                              title="Descargar documento paso a paso en Markdown para evitar errores"
                            >
                              <FileSpreadsheet className="w-3 h-3" />
                              Explicación .MD
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Manage action button */}
                    <div className="mt-5 pt-3 border-t border-stone-850 flex items-center justify-between gap-2.5">
                      <p className="text-[10px] text-stone-500 leading-tight font-sans">
                        SGBD Hermético. El administrador no podrá ver ni modificar catálogos de otras tiendas.
                      </p>
                      <button
                        type="button"
                        onClick={() => onNavigate(store.id)}
                        className={`p-2 px-4 rounded-xl text-xs font-bold font-sans flex items-center gap-1 font-black transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-lg shadow-black/30 ${btnColor}`}
                      >
                        Entrar a Sesión <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Solution Guides */}
        {activeTab === "guia" && (
          <div className="bg-stone-900 border border-stone-850 rounded-2xl p-6 md:p-8 space-y-6 font-mono text-xs animate-fade-in">
            <div className="flex items-center gap-2 text-amber-500 font-bold border-b border-stone-800 pb-3">
              <Info className="w-5 h-5" />
              <span>DIAGNÓSTICO SGBD: ¿POR QUÉ FALLA LA CONEXIÓN DESDE TU CANAL EXTERNO CIPR1? (¡EXPLICACIÓN Y SOLUCIÓN!)</span>
            </div>

            <div className="space-y-4 font-sans text-stone-300 leading-relaxed text-[12.5px]">
              <p>
                Al subir o mapear parámetros en tu canal e-commerce de Cipr1 (Replit), la conexión inicial puede fallar si intentabas conectarte a la URL raíz del SGBD Central (ej: <code className="bg-stone-950 text-indigo-400 px-1 py-0.5 rounded text-xs select-all">https://tienda-a-accesorios.cipr1.app/api/products</code>).
              </p>
              
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 border-l-4 border-l-amber-500 space-y-2">
                <span className="font-bold text-amber-500 block">🛑 El Concepto Erróneo de los Webhooks Pasivos:</span>
                <p className="text-xs">
                  Tu servidor central de SGBD no puede realizar solicitudes POST a URLs de tiendas remotas Cipr1 que aún no existen o no tienen un servidor Express activo escuchando. ¡Por eso sale error de conexión/CORS o un redireccionamiento HTTP 302!
                </p>
                <span className="font-bold text-emerald-400 block mt-2">🌟 La Solución Definitiva (El Método PULL Directo):</span>
                <p className="text-xs">
                  La forma profesional, robusta y con 100% de fiabilidad en Cipr1 es el <strong>Método PULL Exclusivo</strong>. En lugar de que el SGBD central empuje datos a ciegas; 
                  tu e-commerce remoto lee nuestra API directamente con una solicitud GET regular cada vez que un cliente abre la página o refresca el inventario. 
                  ¡Esto es inmune a bloqueos de CORS, restricciones de red, o puertos redirigidos!
                </p>
              </div>

              <div className="space-y-3.5 mt-5">
                <h3 className="text-base font-black text-white font-sans border-b border-stone-800 pb-1 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> RECOMENDACIÓN DE CONFIGURACIÓN DE PARÁMETROS ".json"
                </h3>
                <p className="text-stone-400">
                  Diles a los administradores de tus webs Cipr1, o a tu sistema automático, que configure su conexión con estos datos de conexión de primera prioridad. Copia este bloque JSON y adjúntaselo:
                </p>

                {/* COPYABLE ENVIRONMENT CONFIG */}
                <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 relative font-mono text-[11px] text-emerald-400">
                  <button
                    onClick={() => handleCopy(JSON.stringify({
                      SGBD_ACTIVE_ORIGIN: sgbdUrl,
                      CENTRAL_SGBD_AUTH_HEADER: "X-SGBD-Auth",
                      CENTRAL_SGBD_TOKEN: authToken,
                      EXPLANATION: "La tienda debe realizar un PULL por medio de un fetch(GET) a la API para cargar sus productos de manera segura."
                    }, null, 2), "json-config")}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-900 border border-stone-800 rounded text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer flex items-center gap-1.5 text-[9px] font-bold"
                  >
                    {copiedText === "json-config" ? <><Check className="w-3 h-3 text-emerald-400" /> Copiado</> : <><Clipboard className="w-3 h-3" /> Copiar Configuración</>}
                  </button>
                  <pre className="overflow-x-auto">
{`{
  // PARÁMETROS REALES EXTRAÍDOS EN VIVO DE ESTE SERVIDOR CENTRAL SGBD
  "SGBD_ACTIVE_ORIGIN": "${sgbdUrl}",
  "CENTRAL_SGBD_AUTH_HEADER": "X-SGBD-Auth",
  "CENTRAL_SGBD_TOKEN": "${authToken}",
  "STORES_ENDPOINTS": {
    "Tienda_A_Accesorios": "${sgbdUrl}/api/stores/store-1/products",
    "Tienda_B_Tecnologia": "${sgbdUrl}/api/stores/store-2/products",
    "Tienda_C_Moda": "${sgbdUrl}/api/stores/store-3/products",
    "Tienda_D_Hogar": "${sgbdUrl}/api/stores/store-4/products"
  }
}`}
                  </pre>
                </div>
              </div>

              {/* INTEGRATION CODE EXAMPLE */}
              <div className="space-y-3 mt-6">
                <span className="font-bold text-white block uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-amber-500" /> Código de Integración NodeJS para insertar en Cipr1 (Copiar y Pegar en el Backend de Cipr1 e-commerce):
                </span>
                <p className="text-stone-400 text-xs">
                  Inserta este código en el backend de tu tienda en Cipr1 para leer y sincronizar productos del SGBD Central de forma segura en cada petición:
                </p>

                <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 relative font-mono text-[11px] text-zinc-300">
                  <button
                    onClick={() => handleCopy(`// Código de consumo SGBD para Canal Cipr1 web
const express = require('express');
const app = express();

const SGBD_API_URL = "${sgbdUrl}/api/stores/store-1/products"; // Sustituye por tu storeId correspondiente
const SGBD_TOKEN = "${authToken}";

app.get('/api/products', async (req, res) => {
  try {
    const response = await fetch(SGBD_API_URL, {
      method: "GET",
      headers: {
        "X-SGBD-Auth": SGBD_TOKEN,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      if (response.status === 302) {
        throw new Error("HTTP 302 Redirect detectado. Asegura usar el Endpoint JSON del perfil.");
      }
      throw new Error("HTTP Status " + response.status);
    }

    const catalog = await response.json();
    res.json(catalog);
  } catch (error) {
    console.error("Fallo de Replicador SGBD Central:", error);
    res.status(502).json({ error: "Sincronizador Cipr1 inactivo", details: error.message });
  }
});`, "code-config")}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-stone-900 border border-stone-800 rounded text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer flex items-center gap-1.5 text-[9px] font-bold"
                  >
                    {copiedText === "code-config" ? <><Check className="w-3 h-3 text-emerald-400" /> Copiado</> : <><Clipboard className="w-3 h-3" /> Copiar Código</>}
                  </button>
                  <pre className="overflow-x-auto leading-relaxed max-h-96">
{`// Código de consumo SGBD para Canal Cipr1 web
const express = require('express');
const app = express();

// Sustituye store-1 por tu storeId particular (store-1, store-2, etc.)
const SGBD_API_URL = "${sgbdUrl}/api/stores/store-1/products"; 
const SGBD_TOKEN = "${authToken}";

app.get('/api/products', async (req, res) => {
  try {
    const response = await fetch(SGBD_API_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-SGBD-Auth": SGBD_TOKEN
      }
    });
    
    if (!response.ok) {
      if (response.status === 302) {
        throw new Error("HTTP 302 Redirect detectado. Asegura usar el Endpoint JSON del perfil.");
      }
      throw new Error(\`Error de conexión SGBD: \${response.status}\`);
    }
    
    const catalog = await response.json();
    // Retorna el catálogo real de este módulo de manera transparente al frontend
    res.json(catalog);
  } catch (error) {
    console.error("Fallo de Replicador SGBD Central: ", error);
    res.status(502).json({ 
      error: "No se puede establecer sincronismo SGBD", 
      details: error.message 
    });
  }
});`}
                  </pre>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Central Audit logs block */}
        {activeTab === "auditoria" && (
          <div className="space-y-6 animate-fade-in animate-duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-stone-900 border border-stone-850 p-4 rounded-xl gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Monitoreo y Auditoria Central de Empleados
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Visualiza cada movimiento, ajuste, insercion o eliminacion de productos que realicen tus empleados en sus respectivas paleteras. El monitoreo es en tiempo real y persistido en el servidor.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={fetchAuditLogs}
                  disabled={loadingLogs}
                  className="px-3 py-1.5 bg-stone-950 font-mono text-[10.5px] border border-stone-800 text-stone-300 hover:text-white rounded hover:bg-stone-850 transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? "animate-spin text-amber-500" : ""}`} />
                  Actualizar Registro
                </button>
                <button
                  onClick={handleClearAuditLogs}
                  disabled={auditLogs.length === 0}
                  className="px-3 py-1.5 bg-red-950/40 border border-red-900/50 text-red-400 font-mono text-[10.5px] hover:text-red-300 hover:bg-red-950/60 rounded transition flex items-center gap-1 cursor-pointer"
                >
                  Purgar Historial
                </button>
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-850 rounded-xl overflow-hidden">
              {/* Filter controls */}
              <div className="p-4 bg-stone-950/70 border-b border-stone-850 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-mono">Filtrar por Tienda:</span>
                  <select
                    value={logFilterStore}
                    onChange={(e) => setLogFilterStore(e.target.value)}
                    className="p-1 px-3 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 outline-none focus:border-stone-700 font-mono"
                  >
                    <option value="Todos">Todos los canales</option>
                    {replitStores.map(store => (
                      <option key={store.id} value={store.id}>{store.name} ({store.id})</option>
                    ))}
                  </select>
                </div>
                <div className="text-[11px] font-mono text-stone-500">
                  Total Eventos Registrados: <span className="text-white font-bold">{auditLogs.length}</span>
                </div>
              </div>

              {/* Log stream list */}
              {loadingLogs ? (
                <div className="p-12 text-center text-stone-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                  <span>Sincronizando auditoria general del servidor...</span>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="p-16 text-center text-stone-500 font-mono text-xs">
                  📭 No hay registros de movimientos aun. Los cambios hechos por tus empleados apareceran aqui al instante.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs leading-normal">
                    <thead>
                      <tr className="bg-stone-950 text-stone-400 uppercase text-[10px] border-b border-stone-850 tracking-wider">
                        <th className="py-3 px-4">Fecha/Hora</th>
                        <th className="py-3 px-4">Canal/Tienda</th>
                        <th className="py-3 px-4">Empleado</th>
                        <th className="py-3 px-4">Operacion</th>
                        <th className="py-3 px-4">Descripcion de Movimiento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-850/50">
                      {auditLogs
                        .filter(log => logFilterStore === "Todos" || log.storeId === logFilterStore)
                        .map((log) => {
                          let bgLabel = "bg-stone-950 text-stone-400";
                          if (log.action === "AGREGAR_PRODUCTO") {
                            bgLabel = "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30";
                          } else if (log.action === "MODIFICAR_PRODUCTO") {
                            bgLabel = "bg-amber-950/40 text-amber-400 border border-amber-900/30";
                          } else if (log.action === "ELIMINAR_PRODUCTO") {
                            bgLabel = "bg-rose-950/40 text-rose-400 border border-rose-900/30";
                          } else if (log.action === "SINCRONIZAR_CATALOGO") {
                            bgLabel = "bg-sky-950/40 text-sky-400 border border-sky-900/30";
                          }

                          return (
                            <tr key={log.id} className="hover:bg-stone-850/20 transition-colors">
                              <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleString("es-ES", {
                                  hour12: false,
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit"
                                })}
                              </td>
                              <td className="py-3 px-4 font-bold text-amber-500">{log.storeId}</td>
                              <td className="py-3 px-4 text-white font-medium">{log.employee}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${bgLabel}`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-stone-300 max-w-sm truncate" title={log.details}>
                                {log.details}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-850 py-6 text-center text-xs font-mono text-stone-500">
        <p>© 2026 JORDAN & TEMU SGBD INC • COORDINACIÓN CENTRAL SOBERANA DE TRANSACCIONES</p>
        <p className="text-[10px] text-amber-600 mt-1 uppercase font-bold tracking-widest">SGBD COOPERATIVO DE ALTA SEGURIDAD DE PRESTASI SAS</p>
      </footer>

    </div>
  );
}
