import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/authcontext';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from '../config';

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Check admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);

        const data = await res.json();

        if (res.ok) {
          setFormData({
            name: data.name || '',
            description: data.description || '',
            price: data.price || '',
            category: data.category || '',
            stock: data.stock || ''
          });
        } else {
          alert(data.message || 'Product not found');
          navigate('/admin/products');
        }

      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to fetch product');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);


  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    setLoading(true);

    const data = new FormData();

    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);

    // Add image only if user selected new image
    if (image) {
      data.append('image', image);
    }

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        body: data
      });

      const responseData = await res.json();

      if (res.ok) {
        alert('Product updated successfully!');
        navigate('/admin/products');
      } else {
        alert(responseData.message || 'Failed to update product');
      }

    } catch (error) {
      console.error('Update error:', error);
      alert('Server error while updating product');

    } finally {
      setLoading(false);
    }
  };


  if (!user || user.role !== 'admin') {
    return null;
  }

  if (fetchLoading) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '100px',
          color: '#f97316'
        }}
      >
        Loading Product...
      </div>
    );
  }


  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        background: '#18181b',
        padding: '40px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}
    >

      <h2
        style={{
          color: '#f97316',
          marginBottom: '20px'
        }}
      >
        Edit Product
      </h2>


      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}
      >

        <input
          type="text"
          placeholder="Product Name"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
          }
          style={inputStyle}
        />


        <textarea
          placeholder="Description"
          required
          rows="4"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value
            })
          }
          style={inputStyle}
        />


        <input
          type="number"
          placeholder="Price"
          required
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value
            })
          }
          style={inputStyle}
        />


        <input
          type="text"
          placeholder="Category"
          required
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value
            })
          }
          style={inputStyle}
        />


        <input
          type="number"
          placeholder="Stock"
          required
          value={formData.stock}
          onChange={(e) =>
            setFormData({
              ...formData,
              stock: e.target.value
            })
          }
          style={inputStyle}
        />


        <div
          style={{
            padding: '15px',
            border: '1px dashed #f97316',
            borderRadius: '8px'
          }}
        >

          <label
            style={{
              display: 'block',
              marginBottom: '10px',
              color: '#a1a1aa'
            }}
          >
            Replace Image (Optional)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ color: '#fff' }}
          />

        </div>


        <button
          type="submit"
          disabled={loading}
          className="btn"
          style={{ marginTop: '10px' }}
        >
          {loading ? 'Updating...' : 'Update Product'}
        </button>

      </form>

    </div>
  );
};


const inputStyle = {
  padding: '12px',
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none'
};


export default EditProduct;