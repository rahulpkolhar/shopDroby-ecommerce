import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';
import API_URL from '../config';
import '../styles/auth.css';

const Register = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setError('Please choose an account type');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration Successful!');

        login(data);
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }

    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form register-form">

        <h2>Create Account</h2>

        {!role ? (
          <>
            <p className="auth-subtitle">Choose account type</p>
            <div className="account-options">
              <button
                type="button"
                className="account-option"
                onClick={() => setRole('user')}
              >
                <span className="account-icon">🛍</span>
                <strong>Register as Customer</strong>
                <span>Shop products, add to cart, and place orders.</span>
              </button>
              <button
                type="button"
                className="account-option"
                onClick={() => setRole('seller')}
              >
                <span className="account-icon">🏪</span>
                <strong>Register as Seller</strong>
                <span>Sell products and manage your products.</span>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="selected-account">
              <span>Selected account type</span>
              <strong>{role === 'seller' ? 'Seller' : 'Customer'}</strong>
              <button type="button" onClick={() => setRole('')}>
                Change
              </button>
            </div>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>
        )}

        {error && !role && <p className="auth-error">{error}</p>}

        <p>
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;