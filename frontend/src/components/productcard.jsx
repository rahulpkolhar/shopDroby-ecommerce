import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/product.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-price">
          ₹{Number(product.price).toFixed(2)}
        </p>

        <Link
          to={`/product/${product._id}`}
          className="View-Detail-button"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;