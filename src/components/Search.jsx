import React, { useState } from 'react';
import ItemDetailContainer from './ItemDetailContainer';

const Busqueda = ({ items, onAddToCart }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchQuery.trim().toLowerCase(); // Normaliza la consulta

        // Filtra los items basándote en una coincidencia parcial con el nombre
        const filtered = items.filter((item) => {
            const itemName = item.nombre.toLowerCase();
            return itemName.includes(query) ||
                item.categoria?.toLowerCase().includes(query) ||
                item.subcategoria?.toLowerCase().includes(query) ||
                item.precio?.toString().includes(query) ||
                item.pasajeros?.toString().includes(query);
        });
        setSearchResults(filtered);
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={index} className="highlight">{part}</span>
            ) : (
                part
            )
        );
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
                        {searchResults.map((item) => (
                            <div key={item.id} className="item tarjeta">
                                <ItemDetailContainer item={item} />
                                <p>Nombre: {highlightText(item.nombre, searchQuery)}</p>
                                <p>Categoría: {highlightText(item.categoria || "N/A", searchQuery)}</p>
                                <p>Subcategoría: {highlightText(item.subcategoria || "N/A", searchQuery)}</p>
                                <p>Precio: ${highlightText(item.precio?.toString() || "0", searchQuery)}</p>
                                <p>Pasajeros: {highlightText(item.pasajeros?.toString() || "N/A", searchQuery)}</p>
                                <button className="agregar-carrito" onClick={() => onAddToCart(item)}>Agregar al carrito</button>
                            </div>
                        ))}
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
