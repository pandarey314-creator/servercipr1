import { Sneaker } from "./types";

// Total virtual catalog size of TEMU Integrated (1 million items!)
export const SHOOPY_TOTAL_PRODUCTS = 1000000;

export const SHOOPY_CATEGORIES = [
  "Todos",
  "Cargadores & Conectividad",
  "Accesorios de Telefonía",
  "Maquillaje & Cosmética",
  "Juguetes & Antiestrés",
  "Accesorios de Moda & Joyas",
  "Hogar & Organización",
  "Salud & Cuidado Personal",
  "Papelería & Escritorio"
];

export const SHOOPY_CATALOGS = [
  "Todos",
  "Temu Express Directo",
  "Proveedor Global Sourcing",
  "Distribuidor Mayorista Asia",
  "Liquidaciones de Almacén"
];

// Helper to provide realistic options/variants per category (replaces footwear sizes)
export function getOptionsForCategory(category: string): string[] {
  if (category === "Cargadores & Conectividad") {
    return ["Color Negro Mate", "Color Blanco Nieve", "Pack de x2 Unidades"];
  }
  if (category === "Accesorios de Telefonía") {
    return ["Universal (Ajustable)", "Estándar Pro Max", "Mini Edición"];
  }
  if (category === "Maquillaje & Cosmética") {
    return ["Tono Claro 01", "Tono Natural 02", "Tono Cálido 03"];
  }
  if (category === "Juguetes & Antiestrés") {
    return ["Edición Regular", "Tamaño Gigante XL", "Pack Confort x3"];
  }
  return ["Estándar", "Edición Premium", "Pack de Ahorro"];
}

// Deterministic array values for generating common TEMU visual characteristics
const COLORS = [
  "Negro Carbón", "Blanco Polar", "Rosa Pastel", "Azul Eléctrico",
  "Verde Menta", "Gris Espacial", "Oro Rosado", "Violeta Lavanda",
  "Rojo Carmín", "Amarillo Neón", "Naranja Coral", "Transparente"
];

const PACK_SUFFIXES = [
  "Mega Pack Ahorro",
  "Edición Comercial Directa",
  "Best Seller Oficial",
  "Novedad Viral de Internet",
  "Kit Super Ventas",
  "Modelo Ultra Portátil",
  "Lote Mayorista Premium"
];

// High quality everyday TEMU products templates
interface TemuTemplate {
  name: string;
  img: string;
  desc: string;
  tech: string[];
  silhouette: string;
  minPrice: number;
  maxPrice: number;
}

const TEMU_TEMPLATES: Record<string, TemuTemplate[]> = {
  "Cargadores & Conectividad": [
    {
      name: "Cargador Rápido USB-C Dual 65W GaN",
      img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=400&auto=format&fit=crop",
      desc: "Excelente cargador ultracompacto con tecnología GaN súper rápida. Cuenta con doble puerto para alimentar tu smartphone, tablet o laptop simultáneamente sin sobrecalentamientos.",
      tech: ["Carga Inteligente GaN Tech", "Doble Puerto USB-C", "Protección de Voltaje"],
      silhouette: "Cargadores Rápidos",
      minPrice: 8.99,
      maxPrice: 15.99
    },
    {
      name: "Cable Magnético 3-en-1 Nylon Trenzado",
      img: "https://images.unsplash.com/photo-1541660722303-34852ab9909b?q=80&w=400&auto=format&fit=crop",
      desc: "Cable giratorio con conectores magnéticos intercambiables (Micro, Tipo C e iOS). Blindaje de nylon ultra resistente para evitar roturas.",
      tech: ["Cabezal magnético giratorio 360", "Nylon trenzado reforzado", "Carga rápida y transferencia de datos"],
      silhouette: "Cables Reforzados",
      minPrice: 1.99,
      maxPrice: 4.50
    },
    {
      name: "Estación Base de Carga Inalámbrica Qi 15W",
      img: "https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=400&auto=format&fit=crop",
      desc: "Base de inducción extraplana con superficie de silicona antideslizante. Carga inteligente que optimiza la corriente según tu dispositivo móvil.",
      tech: ["Protocolo Qi 15W rápido", "Indicador ambiental LED suave", "Diseño disipador de calor"],
      silhouette: "Bases Inalámbricas",
      minPrice: 5.99,
      maxPrice: 12.99
    },
    {
      name: "Cargador de Coche Turbo Dual QuickCharge 4.0",
      img: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=400&auto=format&fit=crop",
      desc: "Adaptador compacto para encendedor metálico con doble toma USB para una carga rápida de dispositivos mientras manejas en carretera.",
      tech: ["Puerto QC 4.0 + USB-C PD", "Cuerpo de aleación de aluminio", "Fusible de protección integrado"],
      silhouette: "Cargadores de Auto",
      minPrice: 3.49,
      maxPrice: 7.99
    },
    {
      name: "Power Bank Bolsillo 10000mAh Pantalla Digital",
      img: "https://images.unsplash.com/photo-1609592424085-f5b2b29fc3f9?q=80&w=400&auto=format&fit=crop",
      desc: "Batería portátil liviana que cabe en cualquier bolsillo. Te informa con precisión digital el porcentaje exacto de carga disponible.",
      tech: ["Celdas de Polímero de Litio", "Display LCD indicador", "Carga rápida USB dual"],
      silhouette: "Power Banks",
      minPrice: 9.99,
      maxPrice: 19.99
    }
  ],
  "Accesorios de Telefonía": [
    {
      name: "Mini Trípode Selfie con Anillo LED Recargable",
      img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop",
      desc: "Todo en uno para creadores de contenido. Palo selfie extensible, patas estables de trípode y luz integrada recargable con ajuste de calidez.",
      tech: ["Control remoto remobible Bluetooth", "Luz con 3 intensidades", "Giro ajustable de 360 grados"],
      silhouette: "Trípodes & Aros",
      minPrice: 6.99,
      maxPrice: 14.50
    },
    {
      name: "Vidrio Templado Privacidad Completa 9D",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop",
      desc: "Protege tu pantalla de golpes y miradas indiscretas. Filtro polarizado que oscurece la pantalla para quien mira desde los costados.",
      tech: ["Nivel de dureza certificado 9H", "Filtro espía anti-voyeur", "Capa protectora oleofóbica"],
      silhouette: "Protectores de Pantalla",
      minPrice: 1.49,
      maxPrice: 3.20
    },
    {
      name: "Funda Blindada Transparente con Anillo",
      img: "https://images.unsplash.com/photo-1601597111158-2fceff270190?q=80&w=400&auto=format&fit=crop",
      desc: "Funda de poliuretano premium con esquinas reforzadas amortiguadoras y soporte metálico trasero compatible con imanes de coche.",
      tech: ["Parachoques amortiguador 4 esquinas", "Anillo de soporte giratorio 180°", "Protección elevada de cámara"],
      silhouette: "Fundas Especiales",
      minPrice: 2.20,
      maxPrice: 5.50
    },
    {
      name: "Soporte de Celular Ajustable de Escritorio Metal",
      img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop",
      desc: "Soporte de aleación sólida para Smartphones y Tablets. Altura y ángulo regulables para una ergonomía ideal en llamadas o transmisiones.",
      tech: ["Base de Metal Pesada", "Gomas de silicona antideslizantes", "Diseño totalmente plegable"],
      silhouette: "Soportes de Celular",
      minPrice: 3.50,
      maxPrice: 8.99
    },
    {
      name: "Lápiz Óptico Stylus Recargable Inteligente",
      img: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=400&auto=format&fit=crop",
      desc: "Lápiz táctil superpreciso con punta fina para dibujar o tomar apuntes en tablets Android, iPads o celulares.",
      tech: ["Punta fina de silicona reemplazable", "Batería de larga duración de 10h", "Sin desfase ni demoras"],
      silhouette: "Lápices Ópticos",
      minPrice: 7.99,
      maxPrice: 16.50
    }
  ],
  "Maquillaje & Cosmética": [
    {
      name: "Set Oficial de 15 Brochas de Maquillaje",
      img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop",
      desc: "Pinceles con pelo sintético hipoalergénico de asombrosa suavidad para una aplicación impecable de bases, rubores y sombras.",
      tech: ["Fibras sintéticas súper sedosas", "Mango anatómico de fácil agarre", "Bolsa organizadora de cuero incluida"],
      silhouette: "Sets de Brochas",
      minPrice: 4.80,
      maxPrice: 12.99
    },
    {
      name: "Espejo Cosmético LED Táctil Recargable USB",
      img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400&auto=format&fit=crop",
      desc: "Espejo portátil con iluminación perimetral ajustable de tono frío, cálido o mixto. Base perfecta para accesorios.",
      tech: ["Batería recargable integrada", "Regulación táctil inteligente de brillo", "Ángulo de inclinación multiflexible"],
      silhouette: "Espejos Inteligentes",
      minPrice: 6.50,
      maxPrice: 15.00
    },
    {
      name: "Labial Líquido Mate Voluminizador 24h",
      img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop",
      desc: "Labial líquido súper pigmentado resistente al agua. Acabado mate de gran duración que hidrata profundamente los labios.",
      tech: ["Fórmula resistente al agua 24h", "Textura ligera no pegajosa", "Ingredientes hidratantes de jojoba"],
      silhouette: "Labiales Mate",
      minPrice: 1.99,
      maxPrice: 4.99
    },
    {
      name: "Rizador de Pestañas Térmico Usb Inteligente",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
      desc: "Rizador eléctrico por calentamiento rápido controlado para pestañas perfectas y duraderas sin maltratarlas.",
      tech: ["Calentamiento rápido en 15s", "Dos niveles seguros de calor", "Apagado de seguridad automático"],
      silhouette: "Rizadores Térmicos",
      minPrice: 3.99,
      maxPrice: 9.50
    },
    {
      name: "Organizador Giratorio 360 de Cosméticos",
      img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=400&auto=format&fit=crop",
      desc: "Maximiza el espacio en tu tocador. Bandejas acrílicas ajustables en altura para almacenar perfumes, labiales, cremas y pinceles.",
      tech: ["Giro libre y silencioso 360°", "Acrílico cristal de alta dureza", "Estantes personalizables"],
      silhouette: "Organizadores Acrílicos",
      minPrice: 5.50,
      maxPrice: 13.99
    }
  ],
  "Juguetes & Antiestrés": [
    {
      name: "Juguete Gigante Pop-it Antiestrés Arcoíris",
      img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=400&auto=format&fit=crop",
      desc: "Divertidísimo juguete sensorial fabricado con silicona suave y lavable de grado alimentario. Ideal para relajarse y jugar entre niños y adultos.",
      tech: ["Silicona libre de BPA", "Diseño lavable de alta duración", "Efecto sonido 'pop' de alivio mental"],
      silhouette: "Juguetes Sensoriales",
      minPrice: 1.50,
      maxPrice: 4.80
    },
    {
      name: "MiniConsola Retro Portátil BrickGame 400 en 1",
      img: "https://images.unsplash.com/photo-1622641982427-f48ef33b47fa?q=80&w=400&auto=format&fit=crop",
      desc: "Revive los espectaculares clásicos de la infancia. Incluye pantalla a color de 3 pulgadas y 400 icónicos títulos legendarios listos para jugar.",
      tech: ["Batería de litio recargable", "Salida para TV / AV compatible", "Altavoz regulable integrado"],
      silhouette: "Consolas Retro",
      minPrice: 7.50,
      maxPrice: 14.99
    },
    {
      name: "Kit de Bloques Construcción Suculentas Botánicas",
      img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=400&auto=format&fit=crop",
      desc: "Precioso set de juego de bloques para armar tus propias plantitas suculentas decorativas. Ideal para oficinas, estantes o regalos.",
      tech: ["Bloques ABS de encaje firme", "Compatible con principales marcas", "Manual explicativo ilustrado de pasos"],
      silhouette: "Bloques de Construcción",
      minPrice: 5.99,
      maxPrice: 13.50
    },
    {
      name: "Cubo Rubik Profesional Magnético Speed",
      img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&auto=format&fit=crop",
      desc: "Excelente cubo 3x3 avanzado y diseñado para velocidad con posicionamiento imantado interno para giros rápidos sin trabas.",
      tech: ["Posicionamiento magnético Premium", "Corte de esquinas avanzado", "Superficie antiarañazos esmerilada"],
      silhouette: "Cubos de Velocidad",
      minPrice: 3.50,
      maxPrice: 8.00
    }
  ],
  "Accesorios de Moda & Joyas": [
    {
      name: "Reloj Minimalista Cuarzo Ultradelgado",
      img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=400&auto=format&fit=crop",
      desc: "Sofisticado accesorio de hora diario con correa cómoda de cuero y esfera limpia de metal pulido. Combinación excelente.",
      tech: ["Movimiento cuarzo japonés de precisión", "Esfera de aleación liviana", "Resistencia a salpicaduras diarias"],
      silhouette: "Relojes Sencillos",
      minPrice: 4.50,
      maxPrice: 9.99
    },
    {
      name: "Gafas de Sol Unisex Vintage Protección UV400",
      img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop",
      desc: "Protege tus ojos con elegancia clásica. Marco resistente y lentes polarizados aptos para pasear, manejar o lucir en días soleados.",
      tech: ["Protección certificada UV400", "Marco clásico de alta durabilidad", "Varillas con flex metálico"],
      silhouette: "Gafas de Sol",
      minPrice: 2.50,
      maxPrice: 6.99
    },
    {
      name: "Set de Pinzas Garras de Pelo Mate (6 Unidades)",
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?q=80&w=400&auto=format&fit=crop",
      desc: "Pinzas grandes y resistentes de acabado mate suave al tacto. Ofrecen un agarre seguro para todo tipo de cabello.",
      tech: ["Material acrílico con recubrimiento mate", "Resorte de acero elástico rígido", "Dientes internos antideslizantes"],
      silhouette: "Pinzas de Gancho",
      minPrice: 1.80,
      maxPrice: 4.20
    },
    {
      name: "Estuche Organizador de Joyas Portátil de Viaje",
      img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop",
      desc: "Mantén tus anillos, pulseras, collares y aretes ordenados durante tus viajes. Forro de terciopelo suave antipolvo.",
      tech: ["Doble compartimento con divisiones", "Superficie de cuero sintético PU lavable", "Cierre reforzado"],
      silhouette: "Joyeros de Viaje",
      minPrice: 3.99,
      maxPrice: 8.99
    }
  ],
  "Hogar & Organización": [
    {
      name: "Mini Humidificador Ultrasónico Silencioso con Luz LED",
      img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=400&auto=format&fit=crop",
      desc: "Mantén tus espacios frescos y saludables. Emite un vapor ultrafino y silencioso que purifica tus ambientes. Incluye luces decorativas.",
      tech: ["Vaporización ultrasónica de niebla fría", "Puerto de conexión universal USB", "Auto-apagado por vacío de agua"],
      silhouette: "Humidificadores Mini",
      minPrice: 4.99,
      maxPrice: 11.50
    },
    {
      name: "Tira de Luces RGB Led Inteligente USB 5m",
      img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=400&auto=format&fit=crop",
      desc: "Decora tu setup de videojuegos, habitación o pasillos. Cuenta con control manual o por aplicación móvil con miles de opciones de personalización.",
      tech: ["Autoadhesivo de fácil montaje 3M", "USB de alimentación rápida 5V", "Sincronizador inteligente de ritmos"],
      silhouette: "Luces LED Ambientales",
      minPrice: 3.20,
      maxPrice: 7.99
    },
    {
      name: "Botella Térmica de Acero Inoxidable Doble Capa",
      img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400&auto=format&fit=crop",
      desc: "Excelente termo resistente que conserva tus bebidas favoritas heladas por 24 horas o calientes por 12 horas seguidas.",
      tech: ["Acero inoxidable grado alimenticio 304", "Sellado al vacío anti-derrames", "Pintura rugosa de mejor textura"],
      silhouette: "Botellas Térmicas",
      minPrice: 5.50,
      maxPrice: 12.99
    },
    {
      name: "Lote de Bolsas para Almacenamiento al Vacío (Set x6)",
      img: "https://images.unsplash.com/photo-1565026057447-bc90a3dca487?q=80&w=400&auto=format&fit=crop",
      desc: "Ahorra hasta un 80% de espacio en tu maleta o armario. Válvula hermética compatible con cualquier aspiradora o bomba de mano.",
      tech: ["Polietileno de alto espesor y flexibilidad", "Sello hermético doble de seguridad", "Bomba manual compacta incluida"],
      silhouette: "Bolsas de Almacenamiento",
      minPrice: 4.20,
      maxPrice: 9.50
    }
  ],
  "Salud & Cuidado Personal": [
    {
      name: "Cepillo de Dientes Eléctrico Sónico Recargable",
      img: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=400&auto=format&fit=crop",
      desc: "Higiene dental avanzada diaria. 38.000 micro-vibraciones por minuto con cabezales intercambiables suaves.",
      tech: ["Autonomía de batería de 30 días", "5 modos de limpieza profunda", "Resistente a inmersiones IPX7"],
      silhouette: "Cepillos Sónicos",
      minPrice: 5.99,
      maxPrice: 12.99
    },
    {
      name: "Masajeador Facial de Rodillo de Jade Natural",
      img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop",
      desc: "Mejora la elasticidad de tu piel y reduce tensiones. Elaborado en piedra mineral fresca ideal para aplicar aceites faciales.",
      tech: ["100% Piedra de Jade Natural", "Diseño ergonómico de doble cabeza", "Sin ruidos de rodado integrados"],
      silhouette: "Masajeadores Faciales",
      minPrice: 2.20,
      maxPrice: 5.90
    },
    {
      name: "Pack de Parches Ojos Hidrogel de Oro 24K",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
      desc: "Reduce bolsas, ojeras e hinchazón. Altamente humectantes y descongestionantes para una mirada radiante e hidratada.",
      tech: ["Ingredientes de colágeno marino", "Fórmula refrescante instantánea", "Apto para todo tipo de piel"],
      silhouette: "Parches de Hidrogel",
      minPrice: 2.49,
      maxPrice: 5.99
    }
  ],
  "Papelería & Escritorio": [
    {
      name: "Set de Plumas Gel de Colores Pastel (12 piezas)",
      img: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=400&auto=format&fit=crop",
      desc: "Plumas de tinta de gel de trazo fluido y secado instantáneo. Colores hermosos y cómodos agarres ergonómicos.",
      tech: ["Secado ultra veloz sin manchas", "Trazo fino de precisión de 0.5mm", "Clip de sujeción flexible"],
      silhouette: "Plumas de Colores",
      minPrice: 1.99,
      maxPrice: 4.80
    },
    {
      name: "Libreta Profesional de Cuero Sintético A5",
      img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=400&auto=format&fit=crop",
      desc: "Elegante libreta con hojas satinadas libres de ácido para escribir tus ideas, proyectos u apuntes importantes diariamente.",
      tech: ["Hojas satinadas color crema 80g", "Tapa de cuero ecológico lavable", "Bolsillo portadocumentos de lona"],
      silhouette: "Libretas de Cuero",
      minPrice: 3.50,
      maxPrice: 7.99
    },
    {
      name: "Marcadores de Doble Punta Base de Alcohol (Set x24)",
      img: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=400&auto=format&fit=crop",
      desc: "Rotuladores profesionales con punta biselada y punta redonda fina. Perfectos para colorear, rotular tus organizadores.",
      tech: ["Tinta base de alcohol no tóxica", "Estuche con base rígida incluido", "Colores vibrantes de fácil mezcla"],
      silhouette: "Marcadores",
      minPrice: 5.99,
      maxPrice: 12.99
    }
  ]
};

// UNIVERSAL DETERMINISTIC GENERATOR OF EXACTLY 1,000,000 TEMU PRODUCT COPIES
export function generateShoopySneaker(index: number, chosenCategory?: string): Sneaker {
  const activeCategories = SHOOPY_CATEGORIES.filter(c => c !== "Todos");
  
  // Decide category deterministically based on index modulo
  const categoryIndex = chosenCategory 
    ? activeCategories.indexOf(chosenCategory) 
    : (index % activeCategories.length);
  
  const category = activeCategories[categoryIndex === -1 ? 0 : categoryIndex];
  
  // Assign a supplier deterministically
  const activeCatalogs = SHOOPY_CATALOGS.filter(c => c !== "Todos");
  const catalog = activeCatalogs[index % activeCatalogs.length];

  const col1 = COLORS[index % COLORS.length];
  const col2 = COLORS[(index + 5) % COLORS.length];
  const suffix = PACK_SUFFIXES[index % PACK_SUFFIXES.length];

  // Pick template based on category
  const list = TEMU_TEMPLATES[category] || TEMU_TEMPLATES["Cargadores & Conectividad"];
  const template = list[index % list.length];

  // Base price generation
  const priceSpread = template.maxPrice - template.minPrice;
  const retailPrice = Number((template.minPrice + ((index * 7) % 20) * (priceSpread / 19)).toFixed(2));
  const marketPrice = Number((retailPrice * 1.35).toFixed(2)); // Standard TEMU original price crossed out

  // SKU code generation for realistic TEMU labels
  const codePrefix = category.slice(0, 3).toUpperCase().replace(/\s/g, "");
  const reference = `TM-${codePrefix}-${String(100000 + (index % 900000))}`;

  // Deterministic ratings
  const rating = Number((4.2 + ((index * 3) % 9) * 0.1).toFixed(1));
  const inventory = 15 + (index % 480); // High commercial stock quantity

  // Dynamic date (recent launch)
  const randomDaysAgo = index % 45;
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() - randomDaysAgo);
  const releaseDate = launchDate.toISOString().split("T")[0];

  // Brands / Designer
  const brandsPool = ["Anker Tech", "COCO Glow", "RetroPlay Pro", "SmartHome Co.", "UniStyle Ink", "Yimi Kids", "PrimeGrip Essentials"];
  const brand = brandsPool[index % brandsPool.length];

  return {
    id: `temu-1m-${index}`,
    name: `${template.name} - ${col1} (${suffix})`,
    reference,
    silhouette: template.silhouette,
    colorway: `${col1} / ${col2}`,
    releaseDate,
    designer: brand,
    retailPrice,
    marketPrice,
    imageUrl: template.img,
    description: `${template.desc} Es uno de los productos más cotizados e importados directamente. Distribuido oficialmente en la red comercial del canal '${catalog}' con certificaciones globales de calidad.`,
    technology: template.tech,
    inventory,
    featured: index % 60 === 0,
    rating,
    category,
    catalog
  };
}

// Memory-optimized query executor
// Matches 1,000,000 TEMU products instantly using mathematical sample mapping and virtual pagination.
export function queryShoopyCatalog(
  searchQuery: string,
  selectedSilhouette: string,
  sortBy: string,
  maxPrice: number,
  limit: number,
  selectedCategory: string = "Todos",
  selectedCatalog: string = "Todos"
): { results: Sneaker[]; totalCount: number } {
  const normQuery = searchQuery.toLowerCase().trim();
  const hasFilter = 
    selectedSilhouette !== "Todos" || 
    normQuery.length > 0 || 
    maxPrice < 1200 || 
    selectedCategory !== "Todos" ||
    selectedCatalog !== "Todos";

  // Fast-path: No filter - return deterministic slice of the first 1M items instantly
  if (!hasFilter) {
    const results: Sneaker[] = [];
    const count = SHOOPY_TOTAL_PRODUCTS;

    for (let i = 1; i <= limit; i++) {
      results.push(generateShoopySneaker(i));
    }

    // Sort the list inline simple if needed
    if (sortBy === "price-asc") {
      results.sort((a,b) => a.marketPrice - b.marketPrice);
    } else if (sortBy === "price-desc") {
      results.sort((a,b) => b.marketPrice - a.marketPrice);
    } else if (sortBy === "rating") {
      results.sort((a,b) => b.rating - a.rating);
    }
    
    return { results, totalCount: count };
  }

  const matchedProducts: Sneaker[] = [];
  const activeCategories = SHOOPY_CATEGORIES.filter(c => c !== "Todos");

  // Filter scan with stride mapping relative to chosen category
  let stride = 1;
  let offset = 0;
  if (selectedCategory !== "Todos") {
    stride = activeCategories.length;
    offset = activeCategories.indexOf(selectedCategory);
    if (offset === -1) offset = 0;
  }

  // Scan a targeted mock subset of index coordinates to find matching products in O(1) time
  const maxScanSteps = 30000;
  for (let step = 0; step < maxScanSteps; step++) {
    const index = (step * stride) + offset + 1;
    if (index > SHOOPY_TOTAL_PRODUCTS) break;

    const prod = generateShoopySneaker(index, selectedCategory !== "Todos" ? selectedCategory : undefined);

    // Apply Catalog Sourcing Channel Filter
    if (selectedCatalog !== "Todos" && prod.catalog !== selectedCatalog) {
      continue;
    }

    // Apply Subcategory/Silhouette Filter
    if (selectedSilhouette !== "Todos" && prod.silhouette !== selectedSilhouette) {
      continue;
    }

    // Apply Price Filter
    if (prod.marketPrice > maxPrice) {
      continue;
    }

    // Apply Text Query Filter
    if (normQuery.length > 0) {
      const match =
        prod.name.toLowerCase().includes(normQuery) ||
        prod.reference.toLowerCase().includes(normQuery) ||
        prod.designer.toLowerCase().includes(normQuery) ||
        (prod.colorway && prod.colorway.toLowerCase().includes(normQuery)) ||
        (prod.category && prod.category.toLowerCase().includes(normQuery)) ||
        (prod.catalog && prod.catalog.toLowerCase().includes(normQuery));
      if (!match) continue;
    }

    matchedProducts.push(prod);
    if (matchedProducts.length >= limit * 3) {
      break;
    }
  }

  // Sorting matches
  const sorted = [...matchedProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.marketPrice - b.marketPrice;
    if (sortBy === "price-desc") return b.marketPrice - a.marketPrice;
    if (sortBy === "newest") return b.releaseDate.localeCompare(a.releaseDate);
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  // Dynamic sizing feedback calculations
  let estimatedTotal = matchedProducts.length;
  if (selectedCategory !== "Todos" && selectedCatalog === "Todos" && normQuery.length === 0) {
    estimatedTotal = Math.round(SHOOPY_TOTAL_PRODUCTS / activeCategories.length);
  } else if (normQuery.length > 0) {
    estimatedTotal = Math.max(matchedProducts.length, Math.round(matchedProducts.length * 35));
  } else if (selectedSilhouette !== "Todos") {
    estimatedTotal = Math.max(matchedProducts.length, Math.round(matchedProducts.length * 20));
  } else if (selectedCategory !== "Todos" || selectedCatalog !== "Todos") {
    estimatedTotal = Math.max(matchedProducts.length, Math.round(matchedProducts.length * 85));
  }

  // Bound within maximum database count
  estimatedTotal = Math.min(SHOOPY_TOTAL_PRODUCTS, estimatedTotal);

  return {
    results: sorted.slice(0, limit),
    totalCount: estimatedTotal
  };
}

// Pre-seeds 1000 highly popular, gorgeous virtual products covering all categories at startup
export function generateUnifiedInitialCatalog(): Sneaker[] {
  const initial: Sneaker[] = [];
  
  // We can seed 1000 diverse daily TEMU products deterministically
  for (let i = 1; i <= 1000; i++) {
    initial.push(generateShoopySneaker(i));
  }
  
  return initial;
}
