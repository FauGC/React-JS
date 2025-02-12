import React, { useState, useEffect } from 'react';
import productosimg from './info';
import ItemDetailContainer from './ItemDetailContainer';

const Busqueda = ({ items, onAddToCart }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [stockLevels, setStockLevels] = useState({});
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        const storedStock = JSON.parse(localStorage.getItem('stock')) || {};
        setStockLevels(storedStock);
    }, []);

    useEffect(() => {
        const handleStockUpdated = () => {
            const updatedStock = JSON.parse(localStorage.getItem('stock')) || {};
            setStockLevels(updatedStock);
        };

        window.addEventListener('stockUpdated', handleStockUpdated);
        return () => window.removeEventListener('stockUpdated', handleStockUpdated);
    }, []);

    const updateStockInLocalStorage = (itemId, newStock) => {
        const updatedStock = { ...stockLevels, [itemId]: newStock };
        setStockLevels(updatedStock);
        localStorage.setItem('stock', JSON.stringify(updatedStock));
        window.dispatchEvent(new Event('stockUpdated'));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchQuery.trim().toLowerCase();

        const filtered = items.filter((item) => {
            const itemName = item.nombre.toLowerCase();
            return itemName.includes(query) ||
                item.categoria?.toLowerCase().includes(query) ||
                item.subcategoria?.toLowerCase().includes(query) ||
                item.precio?.toString().includes(query) ||
                item.pasajeros?.toString().includes(query);
        });

        const itemsWithImagesAndStock = filtered.map((item) => {
            const productImages = productosimg.find(img => img.id === parseInt(item.id));
            const availableStock = stockLevels[item.id] !== undefined ? stockLevels[item.id] : item.stock;

            return {
                ...item,
                imagenes: productImages ? productImages.imagenes : [],
                availableStock
            };
        });

        setSearchResults(itemsWithImagesAndStock);
    };

    const handleQuantityChange = (itemId, value) => {
        const availableStock = stockLevels[itemId] !== undefined ? stockLevels[item.id] : 0;
        const newQuantity = Math.min(Math.max(1, value), availableStock);
        setQuantities(prev => ({ ...prev, [itemId]: newQuantity }));
    };

    const handleAddToCart = (item) => {
        const quantity = quantities[item.id] || 1;
        const availableStock = stockLevels[item.id] !== undefined ? stockLevels[item.id] : item.stock;

        if (quantity <= availableStock) {
            const newStock = availableStock - quantity;
            updateStockInLocalStorage(item.id, newStock);
            for (let i = 0; i < quantity; i++) {
                onAddToCart(item, 1);
            }
            setQuantities(prev => ({ ...prev, [item.id]: 1 }));
        }
    };

    return (
        <div className="search-container">
            <form className="search-bar" onSubmit={handleSearchSubmit}>
                <input
                    className="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, categoría, subcategoría, precio o pasajeros"
                />
                <button className="search-button" type="submit">Buscar</button>
            </form>

            {searchResults.length > 0 ? (
                <div className="catalogo-tarjeta">
                    <h3>Resultados de Búsqueda</h3>
                    <div className="item-list">
                        {searchResults.map((item) => {
                            const availableStock = stockLevels[item.id] !== undefined ? stockLevels[item.id] : item.stock;
                            const isDisabled = availableStock <= 0;

                            return (
                                <div key={item.id} className="item tarjeta">
                                    <ItemDetailContainer item={item} />
                                    <p><strong>ID:</strong> {item.id}</p>
                                    <p><strong>Categoría:</strong> {item.categoria}</p>
                                    <p><strong>Subcategoría:</strong> {item.subcategoria}</p>
                                    <p><strong>Pasajeros:</strong> {item.pasajeros}</p>
                                    <p><strong>Precio:</strong> USD${item.precio}</p>
                                    <p>Stock: {availableStock}</p>
                                    <div className="quantity-control" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)}>-</button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[item.id] || 1}
                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                            style={{ width: '40px', textAlign: 'center' }}
                                        />
                                        <button onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}>+</button>
                                    </div>
                                    <button
                                        className="agregar-carrito"
                                        onClick={() => handleAddToCart(item)}
                                        disabled={isDisabled}
                                    >
                                        {isDisabled ? 'Stock agotado' : 'Agregar al Carrito'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                searchQuery && <p className="no-results">No se encontraron resultados.</p>
            )}

            {searchResults.length > 0 && (
                <button className="close-button" onClick={() => setSearchResults([])}>
                    Cerrar
                </button>
            )}
        </div>
    );
};

export default Busqueda;
