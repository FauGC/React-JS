// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";  // Elimina la segunda importación de 'collection'
import productosimg from './info.json';  // Asegúrate de que este path sea correcto

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAQSLbdTyHuUATFquCx55rO7KmLPGUPs5k",
    authDomain: "lembranzas-cf087.firebaseapp.com",
    projectId: "lembranzas-cf087",
    storageBucket: "lembranzas-cf087.firebasestorage.app",
    messagingSenderId: "253626952493",
    appId: "1:253626952493:web:c24d3b2e5b7c5fae4641a4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Aquí es donde obtenemos la instancia de Firestore

// Exportamos la variable db para poder usarla en otros archivos
export { db };

// Funciones existentes de Firebase y productos
export default async function getAsyncData() {
    const collectionRef = collection(db, "productos");
    const productosSnapshot = await getDocs(collectionRef);
    console.log(productosSnapshot);

    // Obtiene los productos de Firebase
    const documentsData = productosSnapshot.docs.map(doc => {
        const fullData = doc.data()
        fullData.id = doc.id;
        return fullData;
    });

    // Asocia los productos con las imágenes de info.js utilizando el id
    const productsWithImages = documentsData.map(product => {
        const productImages = productosimg.find(item => item.id === parseInt(product.id)); 
        if (productImages) {
            return { ...product, imagenes: productImages.imagenes };
        }
        return product;
    });

    return productsWithImages;
}

// Obtener un producto por ID
export async function getAsyncItemById(itemID) {
    const productos = await getAsyncData();
    return productos.find(item => item.id === itemID) || null;
}

// Obtener productos por categoría
export async function getAsyncItemByCategory(catID) {
    const productos = await getAsyncData();
    return productos.filter(item => item.categoria === catID);
}

// Función para crear una orden de compra
export async function createBuyOrder (orderData){   
    const newOrderDoc = await addDoc(collection(db, "orders"), orderData);
    return newOrderDoc.id;
}
