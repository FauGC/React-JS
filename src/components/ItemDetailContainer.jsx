import React, { useState } from 'react';

const ItemDetailContainer = ({ item }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openModal = () => {
        setCurrentImageIndex(0);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const showPreviousImage = () => {
        if (item.imagenes && item.imagenes.length > 0) {
            if (currentImageIndex > 0) {
                setCurrentImageIndex(currentImageIndex - 1);
            } else {
                setCurrentImageIndex(item.imagenes.length - 1);
            }
        }
    };

    const showNextImage = () => {
        if (item.imagenes && item.imagenes.length > 0) {
            if (currentImageIndex < item.imagenes.length - 1) {
                setCurrentImageIndex(currentImageIndex + 1);
            } else {
                setCurrentImageIndex(0);
            }
        }
    };

    // Verificamos que 'item.imagenes' exista y tenga al menos una imagen
    const hasImages = item.imagenes && item.imagenes.length > 0;
    // Se utiliza la URL de la imagen tal cual, sin concatenar "./imagenes/"
    const imageSrc = hasImages ? item.imagenes[currentImageIndex] : null;

    return (
        <>
            <div className="tarjeta">
                <h2>{item.nombre}</h2>
                {hasImages ? (
                    <img
                        src={imageSrc}
                        alt={item.nombre}
                        className="imagen-producto"
                        onClick={openModal}
                    />
                ) : (
                    <p>No hay imágenes disponibles</p>
                )}
            </div>

            {isModalVisible && hasImages && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="boton-cerrar" onClick={closeModal}>Cerrar</button>
                        <div className="modal-body">
                            <img
                                src={imageSrc}
                                alt={`Imagen ${currentImageIndex + 1}`}
                                className="imagen-modal"
                            />
                            <div className="modal-detalles">
                                <div className="detalle-tarjeta">
                                    <h4>Detalles del Producto</h4>
                                    <div className="card">
                                        <ul>
                                            <li><strong>ID:</strong> {item.id}</li>
                                            <li><strong>Nombre:</strong> {item.nombre}</li>
                                            <li><strong>Categoría:</strong> {item.categoria}</li>
                                            <li><strong>Subcategoría:</strong> {item.subcategoria}</li>
                                            <li><strong>Stock:</strong> {item.stock}</li>
                                            <li><strong>Precio:</strong> ${item.precio}</li>
                                            <li><strong>Pasajeros:</strong> {item.pasajeros}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-botones">
                            <button onClick={showPreviousImage}>Previa</button>
                            <button onClick={showNextImage}>Siguiente</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ItemDetailContainer;

