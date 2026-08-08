import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { clearCart } from "../redux/cartslice";
import "../styles/cart.css";
const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handlePayment = async () => {
    try {
      const orderRes = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalPrice,
          }),
        }
      );

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert(orderData.message || "Unable to create Razorpay order");
        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded.");
        return;
      }

      const options = {
        key: "rzp_test_TJb6ZBLyGdYiEx",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopDroby",
        description: "Order Payment",
        order_id: orderData.id,

        handler: async function (response) {
          const verifyRes = await fetch(
            "http://localhost:5000/api/payment/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            }
          );

          if (!verifyRes.ok) {
            alert("Payment verification failed");
            return;
          }

          const saveOrderRes = await fetch(
            "http://localhost:5000/api/orders",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
             body: JSON.stringify({
  items: cartItems,
  totalAmount: totalPrice,
  address,
  paymentId: response.razorpay_payment_id,
  paymentMethod: "ONLINE",
  paymentStatus: "Paid",
}),
            }
          );

          if (saveOrderRes.ok) {
            dispatch(clearCart());
            navigate("/ordersuccess");
          } else {
            alert("Order saving failed");
          }
        },

        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: "9999999999",
        },

        theme: {
          color: "#f97316",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };
   const handleCOD = async () => {
    try {
      const saveOrderRes = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            items: cartItems,
            totalAmount: totalPrice,
            address,
            paymentMethod: "COD",
            paymentStatus: "Pending",
          }),
        }
      );

      if (saveOrderRes.ok) {
        dispatch(clearCart());
        navigate("/ordersuccess");
      } else {
        alert("Order saving failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!user) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  if (paymentMethod === "ONLINE") {
    handlePayment();
  } else {
    handleCOD();
  }
};
 return (
  <div className="checkout-container">
    <h2>Checkout</h2>

    <div className="checkout-content">
      <form onSubmit={handleSubmit} className="shipping-form">
        <h3>Shipping Address</h3>

        <input
          type="text"
          placeholder="Full Name"
          required
          value={address.fullName}
          onChange={(e) =>
            setAddress({ ...address, fullName: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Street"
          required
          value={address.street}
          onChange={(e) =>
            setAddress({ ...address, street: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="City"
          required
          value={address.city}
          onChange={(e) =>
            setAddress({ ...address, city: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Postal Code"
          required
          value={address.postalCode}
          onChange={(e) =>
            setAddress({
              ...address,
              postalCode: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Country"
          required
          value={address.country}
          onChange={(e) =>
            setAddress({
              ...address,
              country: e.target.value,
            })
          }
        />

        <h3>Select Payment Method</h3>

        <label>
          <input
            type="radio"
            name="payment"
            value="ONLINE"
            checked={paymentMethod === "ONLINE"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Online Payment (Razorpay)
        </label>

        <br />
        <br />

        <label>
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash On Delivery
        </label>

        <br />
        <br />

        <div className="checkout-summary">
          <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>

          <button type="submit" className="btn">
            {paymentMethod === "ONLINE"
              ? "Pay Now"
              : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  </div>

  );
};

export default Checkout;