import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/product.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-price">{product.name}</h3>
        <p className="product-price">{product.price.toFixed(2)}</p>
        <Link to={`/product/${product._id}`} className="View-Detail-button">
        view details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;