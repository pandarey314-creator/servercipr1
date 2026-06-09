import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, writeBatch, collection, getDocs, setLogLevel } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { Sneaker } from "./types";

// Silence verbose internal SDK logs (such as idle stream disconnections) on the server side
setLogLevel("error");

const app = initializeApp(firebaseConfig);
const dbId = firebaseConfig.firestoreDatabaseId || "(default)";
export const db = getFirestore(app, dbId);

// Sincroniza la lista completa de productos de una tienda hacia la base de datos de Firebase Firestore
export async function syncStoreToFirestore(storeId: string, products: Sneaker[]) {
  try {
    console.log(`[Firebase Sync] Levantando canal de replicación para la tienda: ${storeId}...`);
    
    // Registrar metadata de la tienda principal
    const storeRef = doc(db, "stores", storeId);
    await setDoc(storeRef, {
      id: storeId,
      name: `Tienda Cipr1 ${storeId.replace("store-", "")}`,
      authToken: "prestasi_sgbd_sec_8849-key",
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    // Obtener los productos ya cargados en Firestore para identificar bajas/eliminaciones
    const productsCollRef = collection(db, "stores", storeId, "products");
    const snapshot = await getDocs(productsCollRef);
    const existingIds = snapshot.docs.map(doc => doc.id);
    const newIds = new Set(products.map(p => p.id));
    
    let batch = writeBatch(db);
    let operationCount = 0;

    // Procesar eliminaciones de productos en la nube que ya no existen localmente
    for (const oldId of existingIds) {
      if (!newIds.has(oldId)) {
        const docRef = doc(db, "stores", storeId, "products", oldId);
        batch.delete(docRef);
        operationCount++;
        
        if (operationCount >= 400) {
          await batch.commit();
          batch = writeBatch(db);
          operationCount = 0;
        }
      }
    }
    
    // Procesar inserciones y actualizaciones en la nube
    for (const product of products) {
      const docRef = doc(db, "stores", storeId, "products", product.id);
      batch.set(docRef, product, { merge: true });
      operationCount++;
      
      if (operationCount >= 400) {
        await batch.commit();
        batch = writeBatch(db);
        operationCount = 0;
      }
    }
    
    if (operationCount > 0) {
      await batch.commit();
    }
    
    console.log(`[Firebase Sync] Sincronización con Firestore exitosa. ${products.length} productos replicados.`);
  } catch (err) {
    console.error(`[Firebase Sync Error] Error replicando tienda ${storeId} en Firestore:`, err);
  }
}

// Obtiene los datos persistidos en Firestore en caso de arranque en limpio o pérdida de archivos locales
export async function fetchStoreFromFirestore(storeId: string): Promise<Sneaker[] | null> {
  try {
    const productsCollRef = collection(db, "stores", storeId, "products");
    const snapshot = await getDocs(productsCollRef);
    if (snapshot.empty) {
      return null;
    }
    const products: Sneaker[] = [];
    snapshot.forEach(docSnap => {
      products.push(docSnap.data() as Sneaker);
    });
    return products;
  } catch (err) {
    console.error(`[Firebase Sync Error] Error descargando tienda ${storeId} de Firestore:`, err);
    return null;
  }
}
