import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { clearCart, updateQuantity, removeItem } from '../app/cartSlice';
import { sendOrder, imageUrl } from '../services/api';

const CartPage = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    // Проверяем наличие скидки в localStorage (например, "5" для 5%)
    const userDiscount = parseFloat(localStorage.getItem('userDiscount')) || 0;

    // Вычисляем общую стоимость товаров в корзине
    const totalPrice = cartItems.reduce(
        (total, item) => total + (item.discont_price || item.price) * item.quantity,
        0
    );

    // Применяем скидку к общей стоимости
    const discountedTotalPrice = userDiscount > 0 ? totalPrice - (totalPrice * userDiscount / 100) : totalPrice;

    // Вычисляем общее количество товаров в корзине
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Состояния для формы заказа
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });

    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    // При монтировании компонента загружаем данные пользователя из localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            setFormData(userData); // Устанавливаем данные в форму
        }
    }, []);

    // Обработчик изменений в полях формы
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, phone, email } = formData;

        // Регулярные выражения для валидации данных
        const emailRegex = /^[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const nameRegex = /^[a-zA-Zа-яА-Я]{2,}(?:\s[a-zA-Zа-яА-Я]+)*$/; // Минимум 2 символа
        const phoneRegex = /^\+?[0-9]{7,}$/;

        // Валидация имени
        if (!nameRegex.test(name)) {
            setError('Name must be at least 2 letters long and can include Cyrillic or Latin characters');
            return;
        }

        // Валидация телефона
        if (!phoneRegex.test(phone)) {
            setError('Phone number must only contain digits and can start with "+"');
            return;
        }

        // Валидация email
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address (at least 3 letters before "@" and a two-letter domain after)');
            return;
        }

        try {
            // Формируем данные для отправки на сервер
            const requestData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: 'Default Address', // Моковое значение адреса
                cartItems: cartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.discont_price || item.price,
                })),
            };

            await sendOrder(requestData);
            setError('');
            setShowPopup(true);
        } catch (error) {
            console.error('Error sending order:', error);
            setError('An error occurred while sending the order. Please try again.');
        }
    };

    // Увеличение количества товара
    const handleIncreaseQuantity = (id) => {
        dispatch(updateQuantity({ id, quantity: 1 }));
    };

    // Уменьшение количества товара
    const handleDecreaseQuantity = (id, currentQuantity) => {
        if (currentQuantity > 1) {
            dispatch(updateQuantity({ id, quantity: -1 }));
        }
    };

    // Изменение количества товара через текстовое поле
    const handleInputChange = (id, value) => {
        const newQuantity = parseInt(value, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            dispatch(updateQuantity({ id, quantity: newQuantity - cartItems.find(item => item.id === id).quantity }));
        }
    };

    // Удаление товара из корзины
    const handleRemoveItem = (id) => {
        dispatch(removeItem(id));
    };

    // Закрытие поп-апа и очистка корзины
    const handlePopupClose = () => {
        setShowPopup(false);
        dispatch(clearCart());
    };

    return (
        <div className="cart-page">
            <h2>Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-box">
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    {/* Изображение товара */}
                                    <img
                                        src={imageUrl(item.image)}
                                        alt={item.title}
                                        className="cart-item__image"
                                    />
                                    {/* Информация о товаре */}
                                    <div className="cart-item__info">
                                        {/* Название товара с NavLink */}
                                        <NavLink to={`/products/${item.id}`} className="cart-item__title-link">
                                            <h3>{item.title}</h3>
                                        </NavLink>
                                        <div className="selector_and_price">
                                            <div className="quantity-selector">
                                                <button
                                                    className="quantity-button"
                                                    onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    min="1"
                                                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                                                    className="quantity-value"
                                                />
                                                <button
                                                    className="quantity-button"
                                                    onClick={() => handleIncreaseQuantity(item.id)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="cart-item__price-box">
                                                {item.discont_price ? (
                                                    <>
                                                        <span className="cart-item__current-price">
                                                            ${item.discont_price}
                                                        </span>
                                                        <span className="cart-item__original-price">
                                                            ${item.price}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="cart-item__current-price">
                                                        ${item.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Кнопка удаления товара */}
                                    <div className='cart-item__remove'>
                                        <button
                                            className="cart-item__remove-button"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Детали заказа */}
                        <div className="order-details">
                            <h3>Order details</h3>
                            <p>Items: {totalItems}</p>
                            <p>Total: ${totalPrice.toFixed(2)}</p>
                            {userDiscount > 0 && (
                                <>
                                    <p>
                                        Discount ({userDiscount}%): -$
                                        {(totalPrice * userDiscount / 100).toFixed(2)}
                                    </p>
                                    <p>Final Total: ${discountedTotalPrice.toFixed(2)}</p>
                                </>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="form-field">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {error && <p className="error">{error}</p>}
                                <button type="submit" className="submit-btn">
                                    Order
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
            {/* Поп-ап подтверждения заказа */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Congratulations!</h2>
                        <p>Your order has been successfully placed on the website.</p>
                        <p>A manager will contact you shortly to confirm your order.</p>
                        <button onClick={handlePopupClose}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;