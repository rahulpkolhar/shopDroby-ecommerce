# ShopDroby - Frontend

This is the frontend application of **ShopDroby**, a full-stack MERN
e-commerce website built using React.js.

The frontend provides the user interface for product browsing, authentication,
shopping cart management, checkout, payments, user profiles, order history,
and admin management.

## Features

- User registration
- User login and logout
- JWT-based authentication
- Protected user features
- Product listing
- Product details
- Product categories
- Product pricing and stock information
- Shopping cart
- Add products to cart
- Remove products from cart
- Increase and decrease product quantity
- Automatic cart total calculation
- Cart persistence using localStorage
- Checkout
- Shipping address form
- Razorpay payment integration
- Order success page
- User profile
- Order history
- Admin dashboard
- Admin product management
- Add products
- Edit products
- Delete products
- Admin order management
- Admin user management
- Responsive user interface

## Technology Stack

- React.js
- React Router
- Redux Toolkit
- JavaScript
- HTML5
- CSS3
- REST APIs

## Project Structure

```text
frontend/
│
├── public/
│   ├── dp.jpg
│   ├── logo.png
│   └── index.html
│
├── src/
│   │
│   ├── admin/
│   │   ├── AddProduct.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminOrders.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminUsers.jsx
│   │   └── EditProduct.jsx
│   │
│   ├── components/
│   │   ├── navbar.jsx
│   │   ├── footer.jsx
│   │   └── productcard.jsx
│   │
│   ├── context/
│   │   └── authcontext.jsx
│   │
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Disclaimer.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── ReturnPolicy.jsx
│   │   ├── Shop.jsx
│   │   ├── cart.jsx
│   │   ├── checkout.jsx
│   │   ├── home.jsx
│   │   └── login.jsx
│   │
│   ├── redux/
│   │   ├── cartslice.js
│   │   └── store.js
│   │
│   ├── styles/
│   │   ├── auth.css
│   │   ├── cart.css
│   │   ├── global.css
│   │   ├── navbar.css
│   │   └── product.css
│   │
│   ├── App.jsx
│   └── index.js
│
├── package.json
└── .gitignore