import React, { useEffect, useState } from 'react';
import data from './info.json';
import ItemDetailContainer from './ItemDetailContainer';

const ItemListContainer = ({ category, onAddToCart }) => {
    const [items, setItems] = useState([]);
    
    useEffect(() => {
        if (category) {
            const filteredItems = data.filter(item => item.categoria === category);
            setItems(filteredItems);
        }
    }, [category]);

    const handleAddToCart = (item) => {
        onAddToCart(item);
    };

    return (
        <div className="item-list">
            {items.length > 0 ? (
                items.map(item => (
                    <div key={item.id} className="item tarjeta">
                        <ItemDetailContainer item={item} />
                        <p className="precio">USD${item.precio === "Consultar" ? item.precio : `${item.precio}`} por día</p>
                        <p><strong>Pasajeros:</strong> {item.pasajeros}</p>
                        <button className="agregar-carrito" onClick={() => handleAddToCart(item)}>Agregar al Carrito</button>
                    </div>
                ))
            ) : (
                <p>No hay items para mostrar en esta categoría.</p>
            )}
        </div>
    );
};

export default ItemListContainer;
