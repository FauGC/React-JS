import React, { useState, useEffect } from "react";
import CartWidget from "./CartWidget";
import './style.css';

const NavBar = () => {
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [imagenActual, setImagenActual] = useState(0);
    const [carrito, setCarrito] = useState([]);
    const [carritoAbierto, setCarritoAbierto] = useState(false);

    useEffect(() => {
        const cargarProductos = async () => {
            const response = await fetch("./info.json");
            const data = await response.json();
            setProductos(data);
            setProductosFiltrados(data.filter(producto => producto.categoria === "habitaciones"));
        };
        cargarProductos();
    }, []);

    const agregarAlCarrito = (producto) => {
        const productoEnCarrito = carrito.find(item => item.id === producto.id);
        if (productoEnCarrito) {
            setCarrito(carrito.map(item =>
                item.id === producto.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    const aumentarCantidad = (id) => {
        setCarrito(carrito.map(item =>
            item.id === id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
        ));
    };

    const disminuirCantidad = (id) => {
        setCarrito(carrito.map(item =>
            item.id === id && item.cantidad > 1
                ? { ...item, cantidad: item.cantidad - 1 }
                : item
        ));
    };

    const eliminarProducto = (id) => {
        setCarrito(carrito.filter(item => item.id !== id));
    };

    const toggleCarrito = () => {
        setCarritoAbierto(!carritoAbierto);
    };

    return (
        <div className="NavBar">
            <header>
                <div className="header-nav">
                    <div className="logo">
                        <div className="header-index">
                            <img src="./imagenes/LOGO.png" alt="Logo lembranças" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="main-nav" id="catalogos">
                <div className="tarjta-catalogo">
                    <div className="categoria">
                        <button className="btn btn-primary" onClick={() => setProductosFiltrados(productos.filter(producto => producto.categoria === "habitaciones"))}>
                            Habitaciones
                        </button>
                    </div>
                    <div className="categoria">
                        <button className="btn btn-primary" onClick={() => setProductosFiltrados(productos.filter(producto => producto.categoria === "excursiones"))}>
                            Excursiones
                        </button>
                    </div>
                </div>

                <div className="productos">
                    {productosFiltrados.map((producto) => (
                        <div key={producto.id} className="card producto-card">
                            <div className="card-body">
                                <div className="card-title"><h3>{producto.nombre}</h3></div>
                                <button onClick={() => agregarAlCarrito(producto)}>
                                    <img 
                                        src={`./imagenes/${producto.imagenes[0]}`} 
                                        alt={producto.nombre} 
                                        className="img-fluid img-card" 
                                    />
                                </button>
                                <p>Precio: USD${producto.precio}</p>
                                <p>Capacidad: {producto.pasajeros} personas</p>
                                <button 
                                    className="btn btn-success" 
                                    onClick={() => agregarAlCarrito(producto)}
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <CartWidget cantidad={carrito.length} toggleCarrito={toggleCarrito} />
                
                <div className="carrito-boton">
                    <button className="btn btn-lg btn-primary" onClick={toggleCarrito}>
                        Tu carrito
                    </button>
                </div>
            </div>

            {carritoAbierto && carrito.length > 0 && (
                <div className="carrito-tarjeta">
                    <div className="carrito-header">
                        <h3>Carrito de Compras</h3>
                    </div>
                    <div className="carrito-body">
                        {carrito.map((producto) => (
                            <div key={producto.id} className="producto-en-carrito card">
                                <div className="card-body">
                                    <div className="producto-imagen">
                                        <img src={`./imagenes/${producto.imagenes[0]}`} alt={producto.nombre} />
                                    </div>
                                    <div className="producto-detalles">
                                        <h4>{producto.nombre}</h4>
                                        <p>Precio: USD${producto.precio}</p>
                                        <p>Cantidad: {producto.cantidad}</p>
                                        <div className="producto-botones">
                                            <button onClick={() => aumentarCantidad(producto.id)}>+</button>
                                            <button onClick={() => disminuirCantidad(producto.id)}>-</button>
                                            <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={toggleCarrito} className="btn btn-primary">Cerrar Carrito</button>
                </div>
            )}
        </div>
    );
};

export default NavBar;
