import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; // Для работы с Redux
import { NavLink } from 'react-router-dom';
import { addItem } from '../app/cartSlice'; // Импортируем действие добавления в корзину
import { getProducts, imageUrl } from '../services/api';

export default function ProductList() {
    const dispatch = useDispatch(); // Получаем доступ к dispatch
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [includeDiscount, setIncludeDiscount] = useState(false);
    const [sortOption, setSortOption] = useState('default');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products?.filter((product) => {
        const priceInRange = !minPrice || product.price >= parseFloat(minPrice);
        const maxPriceInRange = !maxPrice || product.price <= parseFloat(maxPrice);
        const hasDiscount = !includeDiscount || !!product.discont_price;
        return priceInRange && maxPriceInRange && hasDiscount;
    });

    const sortedProducts = filteredProducts?.slice().sort((a, b) => {
        switch (sortOption) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'price: high-low':
                return b.price - a.price;
            case 'price: low-high':
                return a.price - b.price;
            default:
                return 0;
        }
    });

    if (loading) {
        return null;
    }

    if (!products || !Array.isArray(products)) {
        return <div>No products available.</div>;
    }

    // Обработчик добавления товара в корзину
    const handleAddToCart = (product) => {
        dispatch(addItem({ ...product, quantity: 1 })); // Добавляем товар с количеством 1
    };

    return (
        <div className="ProductListPage">
            <nav className="under_nav">
                <div className="under_nav-container">
                    <NavLink className="under_nav-item" to="/">Main page</NavLink>
                    <span className="under_nav-line"></span>
                    <span className="under_nav-item">All Products</span>
                </div>
            </nav>

            <h2>All Products</h2>

            <div className="filters">
                <div className="price-filter">
                    <label htmlFor="min-price">Price from:</label>
                    <input
                        type="number"
                        id="min-price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className='price-filter-input'
                    />
                    <label htmlFor="max-price">to:</label>
                    <input
                        type="number"
                        id="max-price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className='price-filter-input'
                    />
                </div>

                <div className="discount-filter">
                    <label htmlFor="include-discount">Include discount:</label>
                    <input
                        type="checkbox"
                        id="include-discount"
                        checked={includeDiscount}
                        onChange={() => setIncludeDiscount(!includeDiscount)}
                    />
                </div>

                <div className="sort-filter">
                    <label htmlFor="sort-option">Sorted:</label>
                    <select
                        id="sort-option"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="default">by default</option>
                        <option value="newest">newest</option>
                        <option value="price: high-low">price: high-low</option>
                        <option value="price: low-high">price: low-high</option>
                    </select>
                </div>
            </div>

            <div className='product-grid'>
                {sortedProducts?.map((product) => (
                    <NavLink key={product.id} to={`/products/${product.id}`} className="product-card">
                        {/* Изображение */}
                        <div className="productCard_imgBox">
                            <img src={imageUrl(product.image)} alt={product.title} />
                            {/* Бейдж скидки */}
                            {product.discont_price && (
                                <div className="discount-badge">
                                    {Math.round(((product.price - product.discont_price) / product.price) * 100)}%
                                </div>
                            )}
                            {/* Кнопка "Add to cart" */}
                            <div className="add-to-cart-box">
                                <button
                                    className="add-to-cart-button"
                                    onClick={(e) => {
                                        e.preventDefault(); // Предотвращаем переход по ссылке
                                        handleAddToCart(product); // Добавляем товар в корзину
                                    }}
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                        {/* Информация о товаре */}
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <div className="product-price">
                                <span className="current-price">
                                    ${product.discont_price || product.price}
                                </span>
                                {product.discont_price && (
                                    <span className="original-price">${product.price}</span>
                                )}
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}