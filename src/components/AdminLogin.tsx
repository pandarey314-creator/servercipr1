import React, { useState } from "react";
import { Shield, Key, Eye, EyeOff, LayoutGrid, Store, Wifi, ExternalLink, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { ReplitStore } from "../types";

interface AdminLoginProps {
  replitStores: ReplitStore[];
  onLoginSuccess: () => void;
  onNavigateStore: (storeId: string) => void;
}

export default function AdminLogin({ replitStores, onLoginSuccess, onNavigateStore }: AdminLoginProps) {
  const [passkey, setPasskey] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Valid credentials:
  // 1) The secure SGBD token: "prestasi_sgbd_sec_8849-key"
  // 2) A simpler master password: "admin123"
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsVerifying(true);

    setTimeout(() => {
      const trimmed = passkey.trim();
      if (trimmed === "prestasi_sgbd_sec_8849-key" || trimmed === "admin123") {
        localStorage.setItem("sgbd_admin_verified", "true");
        localStorage.setItem("sgbd_admin_password", trimmed);
        onLoginSuccess();
      } else {
        setErrorMsg("Clave de seguridad inválida. Intente de nuevo o consulte con soporte.");
        setIsVerifying(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 flex flex-col justify-center items-center px-4 py-12 font-sans relative overflow-hidden">
      {/* Dynamic Background Mesh Effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-amber-600/5 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-emerald-600/5 rounded-full blur-[140px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
        id="admin-login-auth-card"
      >
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-widest mb-4">
            <Shield className="w-3.5 h-3.5" /> SECURE AUTHENTICATION SYSTEM
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">
            Jordan-Temu Jordan Central
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto leading-relaxed">
            SGBD Centralizado de Sincronización y Replicación Multipunto. Acceso exclusivo para administradores jefes.
          </p>
        </div>

        {/* Master Login Card Form */}
        <div className="bg-[#111113] border border-stone-800/80 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/40 relative">
          <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" /> Clave de Seguridad Admin Jefe
          </h2>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-mono text-stone-400 uppercase tracking-wider block font-bold">
                Token / Passkey de Autorización Jordan Principal
              </label>
              
              <div className="relative">
                <input
                  type={showPasskey ? "text" : "password"}
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Introduzca su clave (ej. admin123)"
                  className="w-full bg-[#161619] border border-stone-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-stone-600 transition outline-none pr-10"
                  disabled={isVerifying}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition"
                  tabIndex={-1}
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-950/25 border border-red-500/20 text-red-400 font-mono text-xs rounded-xl flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0"></div>
                <p>{errorMsg}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !passkey.trim()}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 select-none"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Verificando Token...
                </>
              ) : (
                "Verificar y Abrir Portal Central"
              )}
            </button>
          </form>
        </div>

        {/* Separate Sandboxed Employee Store Access Box */}
        <div className="mt-8 bg-[#111113]/40 border border-stone-900 rounded-2xl p-6 relative">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-stone-900 border border-stone-800 text-amber-500 rounded-lg">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                ¿Eres Empleado de una Tienda?
              </h3>
              <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                No necesitas clave de administrador. Haz clic abajo en tu sucursal correspondiente para acceder de forma exclusiva a tu panel aislado de control.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {replitStores.map((store) => (
              <button
                key={store.id}
                onClick={() => onNavigateStore(store.id)}
                className="flex items-center justify-between p-3 bg-stone-900/60 border border-stone-850 hover:border-amber-500/30 rounded-xl hover:bg-stone-900 text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 bg-stone-950/80 rounded-md border border-stone-850 text-stone-400 group-hover:text-amber-400 transition-colors">
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-stone-300 group-hover:text-white transition">
                      {store.name.replace("Replit", "Cipr1")}
                    </p>
                    <p className="text-[8.5px] font-mono text-stone-500 uppercase tracking-widest leading-none mt-0.5">
                      Canal: {store.id}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-stone-600 group-hover:text-amber-400 transition ml-2 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Info footer lock */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-600 font-mono mt-8 select-none">
          <Wifi className="w-3 h-3 text-emerald-500" />
          <span>Jordan SGBD Coordinador Centralizado Activo</span>
        </div>
      </motion.div>
    </div>
  );
}
