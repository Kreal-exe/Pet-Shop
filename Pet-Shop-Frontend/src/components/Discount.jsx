import React, { useState } from 'react';
import discount from '../assets/discount.png';
import { sendSale } from '../services/api';

const Discount = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const [error, setError] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, name, phone } = formData;

        // Регулярные выражения для валидации данных
        const emailRegex = /^[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const nameRegex = /^[a-zA-Zа-яА-Я]{2,}(?:\s[a-zA-Zа-яА-Я]+)*$/; // Минимум 2 символа, латиница или кириллица
        const phoneRegex = /^\+?[0-9]{7,}$/; // Цифры и поддержка плюса

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
            await sendSale(formData);

            // Если все ок, сохраняем данные в localStorage
            localStorage.setItem('userDiscount', '5'); // Скидка 5%
            localStorage.setItem('userData', JSON.stringify(formData)); // Данные пользователя

            setError('');
            setDiscountApplied(true);
        } catch (error) {
            console.error('Error applying discount:', error);
            setError('An error occurred while applying the discount. Please try again.');
        }
    };

    return (
        <div className="discount-form">
            <h2>5% off on the first order</h2>
            <div className="form-box">
                <div className="form-img">
                    <img alt="pets" src={discount} />
                </div>
                <div className="form">
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
                        <button type="submit" className="submit-btn">Get a discount</button>
                    </form>
                    {discountApplied && <p className="success-message">5% discount applied to your order!</p>}
                </div>
            </div>
        </div>
    );
};

export default Discount;