import { Sneaker } from "./types";

export const INITIAL_SNEAKERS: Sneaker[] = [
  // --- CALZADO DEPORTIVO ---
  {
    id: "aj1-chicago",
    name: "Air Jordan 1 Retro High OG 'Chicago Lost & Found'",
    reference: "DZ5485-612",
    silhouette: "Jordan 1",
    colorway: "Varsity Red/Black-Sail-Muslin",
    releaseDate: "2022-11-19",
    designer: "Peter Moore",
    retailPrice: 180,
    marketPrice: 320,
    imageUrl: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=600&auto=format&fit=crop",
    description: "Inspirada en el modelo original de 1985, esta edición especial recrea el aspecto retro de unas zapatillas vintage encontradas en un almacén rústico.",
    technology: ["Cámara de aire encapsulada Air-Sole", "Piel flor de primera calidad", "Suela de goma de alta tracción"],
    inventory: 12,
    featured: true,
    rating: 4.9,
    category: "Calzado Deportivo",
    catalog: "Proveedor Premium Asia"
  },
  {
    id: "aj1-bred",
    name: "Air Jordan 1 Retro High OG 'Bred / Banned'",
    reference: "555088-001",
    silhouette: "Jordan 1",
    colorway: "Black/Varsity Red-White",
    releaseDate: "2016-09-03",
    designer: "Peter Moore",
    retailPrice: 160,
    marketPrice: 750,
    imageUrl: "https://images.unsplash.com/photo-1524532787116-e70228437bbe?q=80&w=600&auto=format&fit=crop",
    description: "La combinación icónica de rojo y negro que desafió las normas de la NBA en 1985, trascendiendo las canchas hacia el streetwear global.",
    technology: ["Unidad Air-Sole en el talón", "Forros internos de tela premium"],
    inventory: 4,
    featured: true,
    rating: 5.0,
    category: "Calzado Deportivo",
    catalog: "Shoopy Express Directo"
  },
  {
    id: "aj4-military",
    name: "Air Jordan 4 Retro 'Military Blue'",
    reference: "FV5029-141",
    silhouette: "Jordan 4",
    colorway: "Off-White/Military Blue-Neutral Grey",
    releaseDate: "2024-05-04",
    designer: "Tinker Hatfield",
    retailPrice: 215,
    marketPrice: 260,
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop",
    description: "Uno de los cuatro esquemas de color originales de 1989. El azul militar destaca en contraste excelente con la gamuza suave gris pálido.",
    technology: ["Soporte de cordones triangular de plástico", "Suela entresuela de poliuretano"],
    inventory: 9,
    featured: false,
    rating: 4.7,
    category: "Calzado Deportivo",
    catalog: "Proveedor Premium Asia"
  },

  // --- CALZADO CASUAL ---
  {
    id: "cas-retro-classic",
    name: "Tenis Urban Retro Classic Loft",
    reference: "CAS-URB-721",
    silhouette: "Calzado Casual",
    colorway: "White/Brown-Gum",
    releaseDate: "2023-05-12",
    designer: "RetroVintage Co.",
    retailPrice: 85,
    marketPrice: 110,
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop",
    description: "Estilo retro con cueros curtidos artesanalmente para un caminar distinguido en el día a día.",
    technology: ["Cuero Vacuno Genuino", "Suela Vulcanizada"],
    inventory: 14,
    featured: true,
    rating: 4.5,
    category: "Calzado Casual",
    catalog: "Distribución Latina"
  },

  // --- ROPA DE HOMBRE ---
  {
    id: "men-denim-jacket",
    name: "Chaqueta Denim Blue Vintage",
    reference: "MHM-JKT-104",
    silhouette: "Chaqueta",
    colorway: "Vintage Wash Indigo",
    releaseDate: "2024-01-15",
    designer: "Heritage Vintage",
    retailPrice: 95,
    marketPrice: 135,
    imageUrl: "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=600&auto=format&fit=crop",
    description: "Chaqueta vaquera de corte clásico con remaches metálicos y lavado vintage.",
    technology: ["Denim Pesado 14oz", "Remaches de Acero Inoxidable"],
    inventory: 18,
    featured: false,
    rating: 4.7,
    category: "Ropa de Hombre",
    catalog: "Shoopy Express Directo"
  },
  {
    id: "men-cotton-shirt",
    name: "Camiseta Negra Minimalista Algodón",
    reference: "MHM-TSH-202",
    silhouette: "Camiseta",
    colorway: "Pure Matte Black",
    releaseDate: "2023-08-30",
    designer: "Cozy Studio",
    retailPrice: 25,
    marketPrice: 35,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
    description: "Camiseta de algodón orgánico ideal para looks relajados y combinaciones sencillas.",
    technology: ["Algodón Pima 100%", "Costura Invisible"],
    inventory: 40,
    featured: false,
    rating: 4.6,
    category: "Ropa de Hombre",
    catalog: "Proveedor Local"
  },

  // --- ROPA DE MUJER ---
  {
    id: "wom-floral-dress",
    name: "Vestido Floral Brisa de Verano",
    reference: "MWR-DRS-311",
    silhouette: "Vestido",
    colorway: "Lavender Fields",
    releaseDate: "2024-04-10",
    designer: "Aura Boutique",
    retailPrice: 120,
    marketPrice: 155,
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop",
    description: "Vestido veraniego ligero y fresco, perfecto para salidas casuales en días templados.",
    technology: ["Tejido Lino-Algodón", "Estampado de Larga Duración"],
    inventory: 9,
    featured: true,
    rating: 4.8,
    category: "Ropa de Mujer",
    catalog: "Proveedor Premium Asia"
  },
  {
    id: "wom-saco-jacket",
    name: "Saco Elegante Premium Corto",
    reference: "MWR-SAC-320",
    silhouette: "Saco",
    colorway: "Desert Sand Cafe",
    releaseDate: "2024-02-18",
    designer: "Style Studio",
    retailPrice: 145,
    marketPrice: 195,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
    description: "Blazer moderno con solapa elegante para una presencia destacada en tu día a día profesional.",
    technology: ["Forro de Seda Italiano", "Botones de Resina Premium"],
    inventory: 11,
    featured: false,
    rating: 4.9,
    category: "Ropa de Mujer",
    catalog: "Distribución Latina"
  },

  // --- ROPA INFANTIL ---
  {
    id: "kid-organic-set",
    name: "Conjunto Algodón Orgánico Bebé",
    reference: "INF-SET-501",
    silhouette: "Conjunto",
    colorway: "Pastel Mint Green",
    releaseDate: "2023-11-05",
    designer: "Cozy Kids",
    retailPrice: 40,
    marketPrice: 55,
    imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop",
    description: "Conjunto de ropa suave para pieles sensibles, libre de químicos agresivos.",
    technology: ["Algodón Orgánico de Comercio Justo", "Cierre Magnético de Seguridad"],
    inventory: 22,
    featured: false,
    rating: 4.9,
    category: "Ropa Infantil",
    catalog: "Proveedor Local"
  },

  // --- ELECTRÓNICA & GADGETS ---
  {
    id: "elc-anc-headphones",
    name: "Audífonos Inalámbricos Pro ANC H1",
    reference: "ELC-ANC-900",
    silhouette: "Audífonos",
    colorway: "Carbon Matte Black",
    releaseDate: "2024-02-12",
    designer: "Sony Labs",
    retailPrice: 199,
    marketPrice: 249,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop",
    description: "Cancelación activa de ruido inteligente con controladores dinámicos avanzados y sonido de alta fidelidad.",
    technology: ["Cancelación de Ruido Activa 45dB", "Autonomía de 32 horas"],
    inventory: 15,
    featured: true,
    rating: 4.7,
    category: "Electrónica & Gadgets",
    catalog: "Importación Directa Hamburgo"
  },
  {
    id: "elc-smartwatch-glow",
    name: "Smartwatch Elite Sport Tracker S5",
    reference: "ELC-SMW-015",
    silhouette: "Smartwatch",
    colorway: "Starlight Rose Gold",
    releaseDate: "2024-03-20",
    designer: "Xiaomi Pure",
    retailPrice: 149,
    marketPrice: 189,
    imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600&auto=format&fit=crop",
    description: "Reloj inteligente premium con pantalla AMOLED, monitoreo continuo de oxígeno en sangre y GPS integrado.",
    technology: ["Pantalla AMOLED", "Ritmo Cardíaco 24/7"],
    inventory: 28,
    featured: false,
    rating: 4.4,
    category: "Electrónica & Gadgets",
    catalog: "Shoopy Express Directo"
  },

  // --- HOGAR & DECOHOGAR ---
  {
    id: "hom-nordic-chair",
    name: "Silla de Diseño Nórdico Dinamarca",
    reference: "HOM-CHR-404",
    silhouette: "Silla",
    colorway: "Natural Ash Wood / Beige",
    releaseDate: "2023-09-18",
    designer: "Nordic Wood",
    retailPrice: 135,
    marketPrice: 175,
    imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop",
    description: "Silla de madera maciza con asiento tapizado, diseño atemporal que combina sofisticación y calidez.",
    technology: ["Madera Maciza de Roble", "Tapizado Antimanchas"],
    inventory: 8,
    featured: true,
    rating: 4.6,
    category: "Hogar & Decohogar",
    catalog: "Distribución Latina"
  },
  {
    id: "hom-pie-lamp",
    name: "Lámpara de Pie Minimal Studio Glow",
    reference: "HOM-LMP-409",
    silhouette: "Lámpara",
    colorway: "Satin Nickel Paint",
    releaseDate: "2024-01-22",
    designer: "Ambient Labs",
    retailPrice: 75,
    marketPrice: 98,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop",
    description: "Iluminación indirecta delicada con estructura de metal pulido y regulador de luz.",
    technology: ["Regulador de Intensidad de Luz", "Foco Led Premium Inc."],
    inventory: 16,
    featured: false,
    rating: 4.6,
    category: "Hogar & Decohogar",
    catalog: "Proveedor Local"
  },

  // --- COLECCIONABLES & JUGUETES ---
  {
    id: "toy-shogun-warrior",
    name: "Figura Articulada Shogun Guerrero",
    reference: "TOY-FIG-882",
    silhouette: "Figura",
    colorway: "Crimson & Metallic Gold",
    releaseDate: "2024-02-28",
    designer: "Figurine World",
    retailPrice: 50,
    marketPrice: 85,
    imageUrl: "https://images.unsplash.com/photo-1608889174635-f09c6cdb998a?q=80&w=600&auto=format&fit=crop",
    description: "Figura de colección pintada con minuciosidad, incluye accesorios y peana de exhibición.",
    technology: ["24 Puntos de Articulación", "Pintura Metálica Anti-Humedad"],
    inventory: 12,
    featured: true,
    rating: 5.0,
    category: "Coleccionables & Juguetes",
    catalog: "Proveedor Premium Asia"
  },

  // --- RELOJES & SMARTWATCHES ---
  {
    id: "wat-swiss-sapphire",
    name: "Reloj Suizo de Zafiro Precision",
    reference: "WAT-SA-11",
    silhouette: "Reloj",
    colorway: "Metallic Silver / Sapphire Blue",
    releaseDate: "2023-11-12",
    designer: "Swiss Lab Elite",
    retailPrice: 450,
    marketPrice: 590,
    imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop",
    description: "Maquinaria automática de cuarzo protegida por cristal de zafiro irrayable y caja de acero pulido de grado quirúrgico.",
    technology: ["Cristal de Zafiro Irrayable", "Caja Acero Quirúrgico 316L", "Mecanismo de 21 Rubíes"],
    inventory: 5,
    featured: true,
    rating: 4.9,
    category: "Relojes & Smartwatches",
    catalog: "Importación Directa Hamburgo"
  },

  // --- ACCESORIOS DE MODA ---
  {
    id: "acc-sunglasses-carey",
    name: "Gafas de Sol London Carey Retro",
    reference: "ACC-SUN-22",
    silhouette: "Gafas",
    colorway: "Brown Tortoise",
    releaseDate: "2024-03-01",
    designer: "London Glasses Co",
    retailPrice: 55,
    marketPrice: 80,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop",
    description: "Estilo atemporal con cristales polarizados de alta definición y protección UV integral.",
    technology: ["Lentes Polarizados TAC", "Filtro Solar Categoría 3"],
    inventory: 14,
    featured: false,
    rating: 4.5,
    category: "Accesorios de Moda",
    catalog: "Proveedor Local"
  },

  // --- BOLSOS & EQUIPAJE ---
  {
    id: "bag-florence-handbag",
    name: "Bolso de Mano Elegante Florence",
    reference: "BAG-FLO-55",
    silhouette: "Bolso",
    colorway: "Cognac Tan Leather",
    releaseDate: "2024-01-18",
    designer: "Florence Handbags Ltd",
    retailPrice: 180,
    marketPrice: 240,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
    description: "Diseño refinado italiano con asas de mano robustas y amplio espacio de organización interior.",
    technology: ["Cuero Saffiano Resistente", "Cierre Magnético Hermético"],
    inventory: 7,
    featured: true,
    rating: 4.8,
    category: "Bolsos & Equipaje",
    catalog: "Importación Directa Hamburgo"
  },

  // --- DEPORTES & OUTDOOR ---
  {
    id: "spo-yoga-mat",
    name: "Esterilla de Yoga Orgánica Grip",
    reference: "SPO-YOG-01",
    silhouette: "Esterilla",
    colorway: "Sage Green Earth",
    releaseDate: "2023-08-10",
    designer: "Earth Yoga Co",
    retailPrice: 45,
    marketPrice: 65,
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=600&auto=format&fit=crop",
    description: "Colchoneta de caucho natural de alto agarre, libre de PVC y disolventes tóxicos para yoga y pilates.",
    technology: ["Caucho Natural Degradable", "Espesor Confort de 5mm"],
    inventory: 30,
    featured: false,
    rating: 4.6,
    category: "Deportes & Outdoor",
    catalog: "Proveedor Local"
  },

  // --- SALUD & CUIDADO PERSONAL ---
  {
    id: "hea-rejuvenating-serum",
    name: "Serum Rejuvenecedor de Cuidado",
    reference: "HEA-SER-99",
    silhouette: "Serum",
    colorway: "Amber Glass",
    releaseDate: "2024-02-05",
    designer: "Organic Skin Tech",
    retailPrice: 35,
    marketPrice: 48,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    description: "Hidratación intensiva para el rostro, combate líneas de fatiga devolviendo la luminosidad natural.",
    technology: ["Fórmula Vegana Concentrada", "Ácido Hialurónico Triple Peso"],
    inventory: 25,
    featured: true,
    rating: 4.7,
    category: "Salud & Cuidado Personal",
    catalog: "Shoopy Express Directo"
  },

  // --- FERRETERÍA & DIY ---
  {
    id: "diy-screwdriver-12v",
    name: "Atornillador Eléctrico 12V Compact",
    reference: "DIY-DRV-05",
    silhouette: "Atornillador",
    colorway: "Industrial Blue & Grey",
    releaseDate: "2023-11-20",
    designer: "BuildMaster Tools",
    retailPrice: 65,
    marketPrice: 89,
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600&auto=format&fit=crop",
    description: "Herramienta ergonómica con torque ajustable y luz de luz LED integrada para zonas de poca visión.",
    technology: ["Batería de Litio Recargable Ion", "Luz de Enfoque LED Quick"],
    inventory: 15,
    featured: false,
    rating: 4.4,
    category: "Ferretería & DIY",
    catalog: "Distribución Latina"
  },

  // --- PAPELERÍA & ESCRITURA ---
  {
    id: "pap-vintage-notebook",
    name: "Notebook Elegante Cuero Vintage",
    reference: "PAP-NOT-12",
    silhouette: "Cuaderno",
    colorway: "Chestnut Brown Leather",
    releaseDate: "2023-06-15",
    designer: "Manuscript Co",
    retailPrice: 28,
    marketPrice: 40,
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600&auto=format&fit=crop",
    description: "Libreta de tapa de cuero flexible grabada, con páginas satinadas color crema listas para tu pluma.",
    technology: ["Hojas Satinadas 120 Gsm Libre Ácido", "Tapa de Cuero Vacuno Auténtico"],
    inventory: 20,
    featured: false,
    rating: 4.8,
    category: "Papelería & Escritura",
    catalog: "Proveedor Local"
  }
];

export const AVAILABLE_SIZES = [
  "US 7 (EU 40)",
  "US 8 (EU 41)",
  "US 8.5 (EU 42)",
  "US 9 (EU 42.5)",
  "US 9.5 (EU 43)",
  "US 10 (EU 44)",
  "US 10.5 (EU 44.5)",
  "US 11 (EU 45)",
  "US 11.5 (EU 45.5)",
  "US 12 (EU 46)"
];

export const SILHOUETTES_FILTER = [
  "Todos",
  "Jordan 1",
  "Jordan 1 Low",
  "Jordan 3",
  "Jordan 4",
  "Jordan 11",
  "Nike Air",
  "Adidas Samba",
  "New Balance",
  "Puma Suede",
  "Reebok Club",
  "Skechers Street"
];

import DRIVE_IMAGES from "./drive_images.json";

export function generate1000Sneakers(): Sneaker[] {
  const colors = [
    "Crimson Red", "Obsidian Blue", "Sail Gold", "Cement Grey",
    "Wolf Grey", "Black Cat", "University Blue", "Volt Neon",
    "Mocha Brown", "Gold Medal", "Pine Green", "Stealth Black",
    "Banned Red", "Hyper Royal", "Dark Concord", "Infrared"
  ];

  const names = [
    "Retro OG 'High'",
    "Retro Low 'Premium'",
    "Craft Edition 'Vibe'",
    "Reimagined Classics",
    "Limited Flight Pack",
    "Heritage Anniversary",
    "Urban Pinnacle",
    "Terracotta Series",
    "Shadow Edition 4.0",
    "Space Jam Legacy",
    "Chicago Lost World",
    "Travis Ground",
    "Court Edition V2",
    "Lightning Metallic",
    "Desert Elephant",
    "Sail Luxury Velvet"
  ];

  const results: Sneaker[] = [];
  
  // Seed the first ones with our accurate templates
  results.push(...INITIAL_SNEAKERS);

  // Generate up to 1000 using our real drive images
  const remaining = 1000 - INITIAL_SNEAKERS.length;
  const driveCount = DRIVE_IMAGES.length;

  for (let i = 1; i <= remaining; i++) {
    // Pick image from Drive dataset (wrap around)
    const driveImg = DRIVE_IMAGES[i % driveCount];
    const brand = driveImg.brand;
    const col1 = colors[i % colors.length];
    const col2 = colors[(i + 4) % colors.length];
    const nameSuffix = names[i % names.length];
    const isFeatured = i % 25 === 0;
    
    const randomYear = 1985 + (i % 42); // 1985 to 2026
    const randomMonth = 1 + (i % 12);
    const randomDay = 1 + (i % 28);
    const dateStr = `${randomYear}-${String(randomMonth).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`;

    const skuPart1 = "SKU-" + (i % 100);
    const skuPart2 = String(1000 + i).slice(1);
    const skuPart3 = String(1000 + (i * 7)).slice(1);
    const sku = `${skuPart1}-${skuPart2}-${skuPart3}`;

    const retailPrice = 120 + (i % 12) * 10;
    const marketPrice = retailPrice + ((i * 19) % 750);
    const rating = Math.round((4.0 + (i % 11) * 0.1) * 10) / 10;

    // Determine details matching biological brand from Drive folder
    let name = `Air Sneaker '${col1} ${col2}'`;
    let silhouette = "Jordan 1";
    let designer = "Tinker Hatfield";
    let description = `Espectacular calzado deportivo con un rendimiento sobresaliente y estética moderna.`;
    let technology = ["Unidad de amortiguación avanzada", "Suela cupsole de máxima tracción"];

    if (brand === "JORDAN") {
      const jordansSils = ["Jordan 1", "Jordan 1 Low", "Jordan 3", "Jordan 4", "Jordan 11"];
      silhouette = jordansSils[i % jordansSils.length];
      name = `Air Jordan ${silhouette.replace("Jordan ", "")} ${nameSuffix} '${col1} ${col2}'`;
      designer = silhouette.includes("1") ? "Peter Moore" : "Tinker Hatfield";
      description = `Esta espectacular edición especial del modelo ${silhouette} rinde tributo directo al legado de la cancha y celebra la combinación de colores '${col1}/${col2}'.`;
      technology = ["Cámara de aire encapsulada Air-Sole", "Piel flor seleccionada", "Tracción circular retro"];
    } else if (brand === "NIKE") {
      silhouette = "Nike Air";
      name = `Nike Air Force 1 ${nameSuffix} '${col1} ${col2}'`;
      designer = "Bruce Kilgore";
      description = `Las emblemáticas Nike Air Force con acolchado neumático, presentadas con un esquema cromático premium y materiales duraderos perfectos para el día a día.`;
      technology = ["Amortiguación Nike Air integrada", "Piel perforada transpirable", "Puntos de giro pivotales"];
    } else if (brand === "ADIDAS") {
      silhouette = "Adidas Samba";
      name = `Adidas Samba Classic ${nameSuffix} '${col1} ${col2}'`;
      designer = "Adi Dassler";
      description = `El look atemporal de Adidas Samba cobra vida en esta edición vintage con la icónica combinación '${col1}/${col2}' y las tres franjas laterales de contraste.`;
      technology = ["Suela de goma vulcanizada de perfil bajo", "Piel de ante suave", "Plantilla de confort OrthoLite"];
    } else if (brand === "NEW BALANCE") {
      silhouette = "New Balance";
      name = `New Balance 550 Retro '${col1} ${col2}'`;
      designer = "Steven Smith";
      description = `El renacimiento del baloncesto ochentero con la clásica silueta 550 de New Balance. Brinda comodidad durante todo el día combinando estética retro y sofisticación.`;
      technology = ["Entresuela acolchada de EVA ultraligera", "Forro transpirable de malla", "Suela de goma resistente"];
    } else if (brand === "PUMA") {
      silhouette = "Puma Suede";
      name = `Puma Suede Classic '${col1} ${col2}'`;
      designer = "Rudolf Dassler";
      description = `Icono de la cultura hip-hop y urbana de los 80, confeccionada en nobuk de máxima finura con la banda de encofrado clásica.`;
      technology = ["Empeine de ante premium", "Cuello acolchado para confort total", "Suela exterior de caucho texturizado"];
    } else if (brand === "REEBOK") {
      silhouette = "Reebok Club";
      name = `Reebok Club C 85 Vintage '${col1} ${col2}'`;
      designer = "Foster Brothers";
      description = `Silueta clásica de tenis inspirada en los clubes de racquetball ingleses de los años 80, de diseño limpio y elegante.`;
      technology = ["Plantilla moldeada confortable", "Parte superior de suave cuero natural", "Amortiguación ligera"];
    } else if (brand === "SKECHERS") {
      silhouette = "Skechers Street";
      name = `Skechers Street Uno '${col1} ${col2}'`;
      designer = "Robert Greenberg";
      description = `Modelo emblemático de Skechers con cámara de aire visible y plantilla amortiguada Air-Cooled Memory Foam que garantiza frescor continuo.`;
      technology = ["Cámara de aire visible en talón Skech-Air", "Plantilla Air-Cooled Memory Foam", "Tracción flexible"];
    } else if (brand === "ASCIS / OUCLOUT") {
      silhouette = "Asics Gel";
      name = `ASICS Gel-Kayano Performance '${col1} ${col2}'`;
      designer = "Kihachiro Onitsuka";
      description = `Lo último en tecnología deportiva de running japonés, diseñada para máxima estabilidad en pisada pronadora o neutra de largo esfuerzo.`;
      technology = ["Amortiguación patentada GEL en talón", "Sistema de soporte DUOMAX", "Malla jacquard avanzada"];
    } else {
      // General categories like BALONCESTO, EUROPEO, UNDER / TIMBERLAND
      silhouette = "Jordan 1";
      name = `${brand.replace(" / ", " ")} Pro Series '${col1} ${col2}'`;
      designer = "Sneaker Lab Team";
      description = `Calzado premium de la división de exploración '${brand}', aportando un ajuste perfecto para entrenamientos multideportivos u ocasiones urbanas activas.`;
      technology = ["Soporte ergonómico modular", "Suela con relieve de agarre extremo"];
    }

    results.push({
      id: `generated-${i}`,
      name,
      reference: sku,
      silhouette,
      colorway: `${col1}/${col2}`,
      releaseDate: dateStr,
      designer,
      retailPrice,
      marketPrice,
      imageUrl: driveImg.url,
      description,
      technology,
      inventory: 1 + (i % 30),
      featured: isFeatured,
      rating
    });
  }

  return results;
}
