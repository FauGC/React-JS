import React, { useState, useEffect } from 'react';
import CartWidget from './CartWidget';
import ItemListContainer from './ItemListContainer';
import Search from './Search';  // Importa el componente Search

const NavBar = () => {
    const [category, setCategory] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Cargar los datos de info.json desde la carpeta src
        fetch('./src/components/info.json')
            .then(response => response.json())
            .then(data => {
                setItems(data);  // Guardar todos los elementos
            })
            .catch(error => console.error("Error al cargar los datos:", error));

        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const toggleCategory = (cat) => {
        if (category === cat) {
            setIsCategoryOpen(!isCategoryOpen);
        } else {
            setCategory(cat);
            setIsCategoryOpen(true);
        }
    };

    const handleAddToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, cantidad: cartItem.cantidad + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, cantidad: 1 }];
            }
        });
    };

    return (
        <div className="nav-container">
            <div className="header">
                <div className="header-index">
                    <img src="./imagenes/logo.png" alt="Logo" />
                </div>
                <div className="eslogan">
                    <h1>Somos una empresa apasionada por crear los mejores recuerdos de cada aventura.</h1>
                </div>

                {/* Botones de categorías dentro de una tarjeta */}
                <div className="categories">
                    <div className="categoria-tarjeta">
                        <button onClick={() => toggleCategory('habitaciones')}>
                            Habitaciones
                        </button>
                    </div>
                    <div className="categoria-tarjeta">
                        <button onClick={() => toggleCategory('excursiones')}>
                            Excursiones
                        </button>
                    </div>

                    {/* Catálogo dentro de la misma tarjeta de categorías */}
                    {isCategoryOpen && category && (
                        <div className="catalogo-tarjeta">
                            <div className="catalogo-header">
                                <h2>{category === 'habitaciones' ? 'Catálogo de Habitaciones' : 'Catálogo de Excursiones'}</h2>
                            </div>
                            <div className="catalogo-body">
                                <ItemListContainer 
                                    category={category} 
                                    onAddToCart={handleAddToCart} 
                                    items={items.filter(item => item.categoria === category)} 
                                />
                                {/* Botón Cerrar al final del catálogo */}
                                <button className="cerrar-button" onClick={() => setIsCategoryOpen(false)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Barra de búsqueda debajo de los catálogos y arriba del carrito */}
                <Search items={items} onAddToCart={handleAddToCart} /> {/* Invoca el componente Search */}
            </div>

            {/* Carrito */}
            <div className="carrito-footer">
                <CartWidget cantidad={cart.length} cart={cart} setCart={setCart} />
            </div>
        </div>
    );
};

export default NavBar;
