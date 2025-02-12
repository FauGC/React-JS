import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore"; 
import productosimg from './info';  

const firebaseConfig = {
    apiKey: "AIzaSyAQSLbdTyHuUATFquCx55rO7KmLPGUPs5k",
    authDomain: "lembranzas-cf087.firebaseapp.com",
    projectId: "lembranzas-cf087",
    storageBucket: "lembranzas-cf087.firebasestorage.app",
    messagingSenderId: "253626952493",
    appId: "1:253626952493:web:c24d3b2e5b7c5fae4641a4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

export { db };

export default async function getAsyncData() {
    const collectionRef = collection(db, "productos");
    const productosSnapshot = await getDocs(collectionRef);
    console.log(productosSnapshot);

    const documentsData = productosSnapshot.docs.map(doc => {
        const fullData = doc.data()
        fullData.id = doc.id;
        return fullData;
    });

    const productsWithImages = documentsData.map(product => {
        const productImages = productosimg.find(item => item.id === parseInt(product.id)); 
        if (productImages) {
            return { ...product, imagenes: productImages.imagenes };
        }
        return product;
    });

    return productsWithImages;
}

export async function getAsyncItemById(itemID) {
    const productos = await getAsyncData();
    return productos.find(item => item.id === itemID) || null;
}

export async function getAsyncItemByCategory(catID) {
    const productos = await getAsyncData();
    return productos.filter(item => item.categoria === catID);
}

export async function createBuyOrder (orderData){   
    const newOrderDoc = await addDoc(collection(db, "orders"), orderData);
    return newOrderDoc.id;
}
