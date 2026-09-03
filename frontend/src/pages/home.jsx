import React, { useEffect, useState } from 'react';
import ProductCard from "../components/productcard";
import API_URL from '../config';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        setProducts(data);

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">

      <div className="hero-banner">
        <h1>Welcome to ShopDroby</h1>
        <p>Discover the best products at unbeatable prices.</p>
      </div>

      <h2>Featured Products</h2>

      {loading ? (
        <div>Loading products...</div>
      ) : products.length === 0 ? (
        <div>No products available</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;