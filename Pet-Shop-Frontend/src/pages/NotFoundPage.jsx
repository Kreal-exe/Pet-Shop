import React from "react";
import p404 from "../assets/404.svg";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="NotFoundPage">
            <div className="NotFoundPage_top">
                <img src={p404} alt="issue 404" />
            </div>

            <div className="NotFoundPage_bottom">
                <h2>Page Not Found</h2>
                <p>
                    We’re sorry, the page you requested could not be found.
                    Please go back to the homepage.
                </p>
                <Link to="/">
                    <button className="add-to-cart-button">Go Home</button>
                </Link>
            </div>
        </div>
    );
}