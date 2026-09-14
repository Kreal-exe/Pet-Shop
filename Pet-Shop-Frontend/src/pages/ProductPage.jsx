import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Импортируем useDispatch
import { addItem } from '../app/cartSlice'; // Импортируем действие добавления в корзину
import { getProduct, getCategory, imageUrl } from '../services/api';

const ProductPage = () => {
    const { id } = useParams(); // ID продукта из URL
    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState(null); // Состояние для данных категории
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch(); // Получаем dispatch для вызова Redux-действий

    // Состояние для количества товара
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Загружаем данные о продукте
                const productData = await getProduct(id);

                // Если данные возвращаются в массиве, берем первый элемент
                if (Array.isArray(productData) && productData.length > 0) {
                    setProduct(productData[0]);

                    // Загружаем данные о категории по categoryId
                    const categoryData = await getCategory(productData[0].categoryId);
                    setCategory(categoryData); // Сохраняем данные о категории
                } else {
                    throw new Error('Product data is invalid or empty');
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return null;
    }

    if (!product) {
        return <div>Sorry, the product you are looking for could not be found.</div>;
    }

    const discountPercentage = product.discont_price && product.price > 0
        ? Math.round(((product.price - product.discont_price) / product.price) * 100)
        : null;

    // Формируем массив миниатюр
    const thumbnails = product.images && Array.isArray(product.images) && product.images.length > 0
        ? product.images.slice(1) // Убираем первое изображение, так как оно будет основным
        : [];

    // Обработчик добавления товара в корзину
    const handleAddToCart = () => {
        dispatch(addItem({ ...product, quantity })); // Добавляем товар с указанным количеством
    };

    return (
        <div className="product-page">
            {/* Навигация */}
            <nav className="under_nav product">
                <div className="under_nav-container">
                    <NavLink className="under_nav-item" to="/">Main page</NavLink>
                    <span className="under_nav-line"></span>

                    {category ? (
                        <>
                            <NavLink className="under_nav-item" to="/categories">Categories</NavLink>
                            <span className="under_nav-line"></span>
                            <NavLink
                                className="under_nav-item clickable"
                                to={`/categories/${product.categoryId}`} // Переход на страницу категории по ID
                            >
                                {category.category.title}
                            </NavLink>
                            <span className="under_nav-line"></span>
                        </>
                    ) : (
                        <span className="under_nav-item">Loading category...</span>
                    )}

                    <span className="under_nav-item active">{product.title}</span>
                </div>
            </nav>

            {/* Основная информация о продукте */}
            <div className="product-details">
                {/* Миниатюры справа */}
                <div className="product-thumbnails">
                    {thumbnails.map((img, index) => (
                        <img
                            key={index}
                            src={imageUrl(img)}
                            alt={`${product.title} thumbnail`}
                            className="product-thumbnails__item"
                        />
                    ))}
                </div>

                {/* Основное изображение */}
                <div className="productCard_imgBox">
                    <img
                        src={imageUrl(product.image)}
                        alt={product.title}
                        className="productCard_img"
                    />
                </div>

                {/* Информация о продукте */}
                <div className="product-info">
                    <h1 className="product-info__title">{product.title}</h1>
                    <div className="product-info__price-box">
                        {product.discont_price ? (
                            <>
                                <span className="current-price">${product.discont_price}</span>
                                <span className="original-price">${product.price}</span>
                                <span className="discount-badge">
                                    {discountPercentage}%
                                </span>
                            </>
                        ) : (
                            <span className="current-price">${product.price}</span>
                        )}
                    </div>

                    {/* Кнопка "Add to cart" */}
                    <div className="productCard_buttonBox">
                        <div className="quantity-selector">
                            <button
                                className="quantity-button"
                                onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                                style={{ zIndex: 1 }}
                            >
                                -
                            </button>
                            <input
                                min="1"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                                className="quantity-value"
                                style={{ position: 'relative', right: '5px' }}
                            />
                            <button
                                className="quantity-button"
                                onClick={() => setQuantity((prev) => prev + 1)}
                                style={{ position: 'relative', right: '10px' }}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className="add-to-cart-button"
                            onClick={handleAddToCart} // Привязываем обработчик
                        >
                            Add to cart
                        </button>
                    </div>

                    <div className="product-info__description">
                        <h2>Description</h2>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;