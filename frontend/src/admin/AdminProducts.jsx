import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/authcontext';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check admin access
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);

        const data = await res.json();

        setProducts(Array.isArray(data) ? data : []);

      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!user) {
      alert('Please login first');
      return;
    }

    if (
      window.confirm(
        'Are you sure you want to delete this product?'
      )
    ) {
      try {
        const res = await fetch(
          `${API_URL}/api/products/${id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        const data = await res.json();

        if (res.ok) {
          alert('Product deleted successfully');

          setProducts((prevProducts) =>
            prevProducts.filter(
              (product) => product._id !== id
            )
          );

        } else {
          alert(
            data.message || 'Failed to delete product'
          );
        }

      } catch (error) {
        console.error('Delete error:', error);
        alert('Server error while deleting product');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div style={containerStyle}>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <h2 style={{ color: '#f97316' }}>
          Manage Products
        </h2>

        <Link
          to="/admin/add-product"
          className="btn"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (

        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading products...
        </div>

      ) : products.length === 0 ? (

        <div style={{ textAlign: 'center', padding: '40px' }}>
          No products found.
        </div>

      ) : (

        <div style={{ overflowX: 'auto' }}>

          <table style={tableStyle}>

            <thead>
              <tr style={rowStyle}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>NAME</th>
                <th style={thStyle}>PRICE</th>
                <th style={thStyle}>CATEGORY</th>
                <th style={thStyle}>STOCK</th>
                <th style={thStyle}>ACTIONS</th>
              </tr>
            </thead>

            <tbody>

              {products.map((product) => (

                <tr
                  key={product._id}
                  style={rowStyle}
                >

                  <td style={tdStyle}>
                    {product._id.substring(0, 8)}...
                  </td>

                  <td style={tdStyle}>
                    {product.name}
                  </td>

                  <td style={tdStyle}>
                    ₹{Number(product.price).toFixed(2)}
                  </td>

                  <td style={tdStyle}>
                    {product.category}
                  </td>

                  <td style={tdStyle}>
                    {product.stock}
                  </td>

                  <td style={tdStyle}>

                    <Link
                      to={`/admin/edit-product/${product._id}`}
                      style={editBtn}
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(product._id)
                      }
                      style={deleteBtn}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};


const containerStyle = {
  maxWidth: '1200px',
  margin: '40px auto',
  padding: '30px',
  background: '#18181b',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.05)',
  color: '#fafafa'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};

const rowStyle = {
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const thStyle = {
  padding: '15px',
  textAlign: 'left',
  color: '#a1a1aa',
  fontSize: '0.9rem'
};

const tdStyle = {
  padding: '15px',
  textAlign: 'left'
};

const editBtn = {
  background: '#3b82f6',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '4px',
  marginRight: '10px',
  textDecoration: 'none'
};

const deleteBtn = {
  background: '#ef4444',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer'
};

export default AdminProducts;