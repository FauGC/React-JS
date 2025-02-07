import React, { useEffect, useState } from 'react';
import getAsyncData from './database';
import productosimg from './info.json';
import ItemDetailContainer from './ItemDetailContainer';

const ItemListContainer = ({ category, onAddToCart }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stockLevels, setStockLevels] = useState({});
    const [selectedQuantities, setSelectedQuantities] = useState({});

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                if (category) {
                    const data = await getAsyncData();
                    const filteredItems = data.filter(item => item.categoria === category);
                    const storedStock = JSON.parse(localStorage.getItem('stock')) || {};
                    const itemsWithImages = filteredItems.map(item => {
                        const productImages = productosimg.find(img => img.id === parseInt(item.id));
                        if (storedStock[item.id] === undefined) {
                            storedStock[item.id] = item.stock;
                        }
                        return {
                            ...item,
                            imagenes: productImages ? productImages.imagenes : []
                        };
                    });
                    localStorage.setItem('stock', JSON.stringify(storedStock));
                    setStockLevels(storedStock);
                    setItems(itemsWithImages);
                }
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [category]);

    useEffect(() => {
        const handleStockUpdated = () => {
            const updatedStock = JSON.parse(localStorage.getItem('stock')) || {};
            setStockLevels(updatedStock);
        };
        
        const handleCartUpdated = (event) => {
            if (event.detail && event.detail.id && event.detail.change) {
                const { id, change } = event.detail;
                setStockLevels(prevStock => {
                    const updatedStock = { ...prevStock, [id]: (prevStock[id] || 0) + change };
                    localStorage.setItem('stock', JSON.stringify(updatedStock));
                    return updatedStock;
                });
            }
        };

        window.addEventListener('stockUpdated', handleStockUpdated);
        window.addEventListener('cartUpdated', handleCartUpdated);

        return () => {
            window.removeEventListener('stockUpdated', handleStockUpdated);
            window.removeEventListener('cartUpdated', handleCartUpdated);
        };
    }, []);

    const handleAddToCart = (item, quantity) => {
        const currentStock = stockLevels[item.id];
        if (currentStock > 0 && quantity > 0 && quantity <= currentStock) {
            // Agregar al carrito tantas veces como la cantidad seleccionada
            for (let i = 0; i < quantity; i++) {
                onAddToCart(item);
            }
            
            const newStock = currentStock - quantity;
            const updatedStockLevels = { ...stockLevels, [item.id]: newStock };
            setStockLevels(updatedStockLevels);
            localStorage.setItem('stock', JSON.stringify(updatedStockLevels));
            window.dispatchEvent(new Event('stockUpdated'));

            // Restablecer la cantidad seleccionada a 1 después de agregar al carrito
            setSelectedQuantities(prev => ({ ...prev, [item.id]: 1 }));
        }
    };

    const handleQuantityChange = (id, change) => {
        setSelectedQuantities(prev => {
            const newQuantity = (prev[id] || 0) + change;
            if (newQuantity >= 1) {
                return { ...prev, [id]: Math.min(newQuantity, stockLevels[id] || 0) };
            }
            return prev;
        });
    };

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    return (
        <div className="item-list">
            {items.length > 0 ? (
                items.map(item => {
                    const availableStock = stockLevels[item.id] !== undefined ? stockLevels[item.id] : item.stock;
                    const isDisabled = availableStock <= 0;
                    const quantity = selectedQuantities[item.id] || 1; // Obtener cantidad seleccionada

                    return (
                        <div key={item.id} className="item tarjeta">
                            <ItemDetailContainer item={item} />
                            <p className="precio">USD${item.precio === "Consultar" ? item.precio : item.precio}</p>
                            <p><strong>Pasajeros:</strong> {item.pasajeros}</p>
                            <p>Stock: {availableStock}</p>
                            
                            {/* Botones para modificar la cantidad */}
                            <div className="quantity-controls">
                                <button
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    disabled={quantity >= availableStock}
                                >
                                    +
                                </button>
                            </div>

                            {isDisabled && (
                                <p className="stock-maximo" style={{ color: 'red', fontWeight: 'bold' }}>
                                    Stock máximo alcanzado
                                </p>
                            )}

                            <button
                                className="agregar-carrito"
                                onClick={() => handleAddToCart(item, quantity)}
                                disabled={isDisabled}
                                style={{
                                    backgroundColor: isDisabled ? 'grey' : '',
                                    color: isDisabled ? 'white' : '',
                                    cursor: isDisabled ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isDisabled ? 'Stock máximo alcanzado' : 'Agregar al Carrito'}
                            </button>
                        </div>
                    );
                })
            ) : (
                <p>No hay items para mostrar en esta categoría.</p>
            )}
        </div>
    );
};

export default ItemListContainer;
