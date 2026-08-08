import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { AuthContext } from "../context/authcontext";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      console.log(data);

      if (res.ok) {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } else {
        alert(data.message);
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
      setOrders([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok) {
        fetchOrders();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Manage Orders</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ORDER ID</th>
              <th style={thStyle}>USER</th>
              <th style={thStyle}>TOTAL</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={tdStyle}>
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td style={tdStyle}>
                    {order._id.substring(0, 8)}...
                  </td>

                  <td style={tdStyle}>
                    {order.user?.name || "Unknown User"}
                  </td>

                  <td style={tdStyle}>
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </td>

                  <td style={tdStyle}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td style={tdStyle}>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      style={selectStyle}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "40px auto",
  padding: "30px",
  background: "#18181b",
  borderRadius: "12px",
  color: "#fff",
};

const titleStyle = {
  color: "#f97316",
  marginBottom: "20px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  padding: "15px",
  textAlign: "left",
  color: "#f97316",
  borderBottom: "1px solid #333",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #333",
};

const selectStyle = {
  padding: "8px",
  background: "#222",
  color: "#fff",
  border: "1px solid #555",
  borderRadius: "5px",
};

export default AdminOrders;