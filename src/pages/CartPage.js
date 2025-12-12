// import React, { useState, useEffect, useMemo } from "react";
// import Layout from "./../components/Layout/Layout";
// import { useCart } from "../context/cart";
// import { useAuth } from "../context/auth";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Modal, Radio, Button } from "antd";
// import "../styles/CartStyles.css";

// const inr = (n) =>
//   Number(n || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" });

// const CartPage = () => {
//   const [auth] = useAuth();
//   const [cart, setCart] = useCart();
//   const [loading, setLoading] = useState(false);
//   const [addresses, setAddresses] = useState([]);
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingAddress, setEditingAddress] = useState(null);

//   const [form, setForm] = useState({
//     fullName: "",
//     phoneNumber: "",
//     addressLine: "",
//     city: "",
//     state: "",
//     country: "",
//     postalCode: "",
//   });

//   const navigate = useNavigate();
//   const userId = auth?.user?.id;

//   const persist = (next) => {
//     setCart(next);
//     localStorage.setItem("cart", JSON.stringify(next));
//   };

//   const lineSubtotal = (item) => Number(item.price) * Number(item.quantity || 1);
//   const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + lineSubtotal(item), 0), [cart]);

//   const formatAddress = (addr) =>
//     `${addr.fullName}, ${addr.addressLine}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.postalCode}, Ph: ${addr.phoneNumber}`;

//   // Fetch user addresses
//   const loadAddresses = async () => {
//     try {
//       const { data } = await axios.get(`/api/v1/address/user/${userId}`, {
//         headers: { Authorization: `Bearer ${auth?.token}` },
//       });
//       setAddresses(data.data);
//       if (!deliveryAddress && data.data.length > 0) {
//         const defaultAddr = data.data.find((a) => a.isDefault) || data[0];
//         setDeliveryAddress(formatAddress(defaultAddr));
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load addresses");
//     }
//   };

//   useEffect(() => {
//     if (userId) loadAddresses();
//   }, [userId]);

//   const changeQty = (idx, delta) => {
//     const next = [...cart];
//     const newQty = Math.max(1, Number(next[idx].quantity || 1) + delta);
//     next[idx] = { ...next[idx], quantity: newQty };
//     persist(next);
//   };

//   const removeCartItem = (idx) => {
//     const next = cart.filter((_, i) => i !== idx);
//     persist(next);
//     toast.success("Item removed from cart");
//   };

//   // Handle Razorpay payment
//   const handlePayment = async () => {
//     if (!deliveryAddress.trim()) {
//       toast.error("Please select or add a delivery address before payment");
//       return;
//     }

//     try {
//       setLoading(true);
//       const { data } = await axios.post(
//         "/api/v1/orders/razorpay/order",
//         { cart, email: auth?.user?.email, address: deliveryAddress },
//         { headers: { Authorization: `Bearer ${auth?.token}` } }
//       );

//       const options = {
//         key: data.key,
//         amount: data.amount,
//         currency: data.currency,
//         name: "Taste Treasures",
//         description: "Order Payment",
//         order_id: data.orderId,
//         handler: async function (response) {
//           try {
//             await axios.post(
//               "/api/v1/orders/razorpay/verify",
//               {
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_signature: response.razorpay_signature,
//                 cart,
//                 email: auth?.user?.email,
//                 address: deliveryAddress,
//               },
//               { headers: { Authorization: `Bearer ${auth?.token}` } }
//             );
//             localStorage.removeItem("cart");
//             setCart([]);
//             toast.success("Payment Completed Successfully");
//             navigate(
//               auth?.user?.role === "ROLE_ADMIN"
//                 ? "/dashboard/admin/MyOrders"
//                 : "/dashboard/user/orders"
//             );
//           } catch (verifyErr) {
//             console.error(verifyErr);
//             toast.error("Payment verification failed. Please contact support.");
//           }
//         },
//         prefill: {
//           email: auth?.user?.email,
//           contact: auth?.user?.phone || "",
//         },
//         theme: { color: "#3399cc" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//       toast.error("Payment failed. Please try again.");
//     }
//   };

//   // Handle address form changes
//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   // Save or update address
//   const handleSubmitAddress = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingAddress) {
//         await axios.put(`/api/v1/address/update/${userId}/${editingAddress.id}`, form, {
//           headers: { Authorization: `Bearer ${auth?.token}` },
//         });
//         toast.success("Address updated successfully");
//       } else {
//         await axios.post(`/api/v1/address/add/${userId}`, form, {
//           headers: { Authorization: `Bearer ${auth?.token}` },
//         });
//         toast.success("Address added successfully");
//       }
//       setModalVisible(false);
//       setEditingAddress(null);
//       setForm({
//         fullName: "",
//         phoneNumber: "",
//         addressLine: "",
//         city: "",
//         state: "",
//         country: "",
//         postalCode: "",
//       });
//       loadAddresses();
//     } catch (err) {
//       console.error(err);
//       toast.error("Error saving address");
//     }
//   };

//   return (
//     <Layout>
//       <div className="cart-page container py-4">
//         {/* Header */}
//         <div className="row mb-4">
//           <div className="col-12 text-center">
//             <h1 className="bg-light p-3 rounded">
//               {!auth?.user ? "Hello Guest" : `Hello ${auth?.user?.name}`}
//               <p className="text-muted mb-0 mt-2">
//                 {cart.length
//                   ? `You have ${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`
//                   : "Your cart is empty"}
//               </p>
//             </h1>
//           </div>
//         </div>

//         <div className="row g-4">
//           {/* Left Side: Cart Items */}
//           <div className="col-lg-7">
//             {cart.length === 0 && (
//               <div className="card p-4 text-center shadow-sm">No items in the cart.</div>
//             )}
//             {cart.map((item, idx) => (
//               <div
//                 key={`${item.id}-${idx}`}
//                 className="card mb-3 shadow-sm p-3 d-flex flex-row align-items-center"
//               >
//                 <img
//                   src={item.image || `/api/v1/product/braintree/photo/${item.id}/0`}
//                   alt={item.name}
//                   className="img-fluid rounded me-3"
//                   style={{ width: 100, height: 100, objectFit: "cover" }}
//                 />
//                 <div className="flex-grow-1">
//                   <h5 className="mb-1">{item.name}</h5>
//                   <p className="mb-1 text-muted">{inr(item.price)}</p>
//                   <div className="d-flex align-items-center gap-2">
//                     <button
//                       className="btn btn-sm btn-outline-secondary"
//                       onClick={() => changeQty(idx, -1)}
//                     >
//                       -
//                     </button>
//                     <span>{item.quantity}</span>
//                     <button
//                       className="btn btn-sm btn-outline-secondary"
//                       onClick={() => changeQty(idx, 1)}
//                     >
//                       +
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger ms-3"
//                       onClick={() => removeCartItem(idx)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//                 <div className="fw-bold ms-3">{inr(lineSubtotal(item))}</div>
//               </div>
//             ))}
//           </div>

//           {/* Right Side: Summary + Address */}
//           <div className="col-lg-5">
//             <div className="card p-4 shadow-sm">
//               <h4 className="mb-3">Cart Summary</h4>
//               <div className="mb-3">
//                 {cart.map((item, idx) => (
//                   <div key={idx} className="d-flex justify-content-between small mb-1">
//                     <span>{item.name} × {item.quantity}</span>
//                     <span>{inr(lineSubtotal(item))}</span>
//                   </div>
//                 ))}
//                 <hr />
//                 <div className="d-flex justify-content-between fw-bold">
//                   <span>Total</span>
//                   <span>{inr(cartTotal)}</span>
//                 </div>
//               </div>

//               {/* Delivery Address Section */}
              

//               <div className="mt-3">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <label className="form-label fw-semibold m-0">Delivery Address</label>
//                   <Button type="link" onClick={() => setModalVisible(true)}>
//                     + Add New Address
//                   </Button>
//                 </div>

//                 <div
//                   className="border rounded p-2"
//                   style={{
//                     height: "400px",
//                     overflowY: "auto",
//                     backgroundColor: "#f9f9f9",
//                   }}
//                 >
//                   <Radio.Group
//                     className="d-flex flex-column gap-2 mb-3"
//                     value={deliveryAddress}
//                     onChange={(e) => setDeliveryAddress(e.target.value)}
//                   >
//                     {addresses.map((addr) => (
//                       <Radio key={addr.id} value={formatAddress(addr)}>
//                         {formatAddress(addr)}
//                       </Radio>
//                     ))}
//                   </Radio.Group>

//                   <textarea
//                     rows={3}
//                     className="form-control"
//                     placeholder="Enter delivery address (optional)"
//                     value={deliveryAddress}
//                     readOnly
//                     onChange={(e) => setDeliveryAddress(e.target.value)}
//                   />
//                 </div>
//               </div>


//               {/* Payment Button */}
//               <div className="mt-3">
//                 <button
//                   className="btn btn-primary w-100"
//                   onClick={handlePayment}
//                   disabled={loading || cart.length === 0 || !deliveryAddress.trim()}
//                 >
//                   {loading ? "Processing..." : "Make Payment"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Address Modal */}
//         <Modal
//           title={editingAddress ? "Edit Address" : "Add New Address"}
//           open={modalVisible}
//           onCancel={() => {
//             setModalVisible(false);
//             setEditingAddress(null);
//             setForm({
//               fullName: "",
//               phoneNumber: "",
//               addressLine: "",
//               city: "",
//               state: "",
//               country: "",
//               postalCode: "",
//             });
//           }}
//           footer={null}
//         >
//           <form onSubmit={handleSubmitAddress}>
//             {["fullName", "phoneNumber", "addressLine", "city", "state", "country", "postalCode"].map(
//               (field) => (
//                 <div className="mb-3" key={field}>
//                   <input
//                     type="text"
//                     name={field}
//                     value={form[field]}
//                     onChange={handleChange}
//                     className="form-control"
//                     placeholder={field.replace(/([A-Z])/g, " $1")}
//                     required
//                   />
//                 </div>
//               )
//             )}
//             <div className="text-end">
//               <button type="submit" className="btn btn-primary">
//                 {editingAddress ? "Update Address" : "Add Address"}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       </div>
//     </Layout>
//   );
// };

// export default CartPage;

import React, { useState, useEffect, useMemo } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal, Radio, Button } from "antd";
import DropIn from "braintree-web-drop-in-react";
import "../styles/CartStyles.css";

const inr = (n) =>
  Number(n || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" });

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [paymentGateway, setPaymentGateway] = useState(null);

  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const navigate = useNavigate();
  const userId = auth?.user?.id;

  const persist = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const lineSubtotal = (item) =>
    Number(item.price) * Number(item.quantity || 1);

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + lineSubtotal(item), 0),
    [cart]
  );

  const formatAddress = (addr) =>
    `${addr.fullName}, ${addr.addressLine}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.postalCode}, Ph: ${addr.phoneNumber}`;

  // Load addresses
  const loadAddresses = async () => {
    try {
      const { data } = await axios.get(`/api/v1/address/user/${userId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      setAddresses(data.data);
      if (!deliveryAddress && data.data.length > 0) {
        const def = data.data.find((a) => a.isDefault) || data.data[0];
        setDeliveryAddress(formatAddress(def));
      }
    } catch (err) {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    if (userId) loadAddresses();
  }, [userId]);

  // Load Braintree token
  const loadBraintreeToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/orders/braintree/token", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setClientToken(data.clientToken);
    } catch (err) {
      toast.error("Failed to initialize Braintree");
    }
  };

  useEffect(() => {
    loadBraintreeToken();
  }, []);

  const changeQty = (idx, delta) => {
    const next = [...cart];
    next[idx].quantity = Math.max(1, Number(next[idx].quantity || 1) + delta);
    persist(next);
  };

  const removeCartItem = (idx) => {
    persist(cart.filter((_, i) => i !== idx));
    toast.success("Item removed");
  };

  // -------------------------------
  // 🔵 BRAINTREE PAYMENT
  // -------------------------------
  const handleBraintreePayment = async () => {
    if (!deliveryAddress.trim()) {
      toast.error("Please select delivery address");
      return;
    }
    if (!instance) {
      toast.error("Payment gateway not ready");
      return;
    }
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();

      const { data } = await axios.post(
        "/api/v1/orders/braintree/checkout",
        {
          paymentMethodNonce: nonce,
          cart,
          email: auth.user.email,
          address: deliveryAddress,
        },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );

      if (data.error) {
        toast.error(data.error || "Payment failed");
        setLoading(false);
        return;
      }

      localStorage.removeItem("cart");
      setCart([]);
      toast.success("Payment successful");
     navigate(auth?.user?.role === "ROLE_ADMIN" ? "/dashboard/admin/MyOrders" : "/dashboard/user/orders");
    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🔴 RAZORPAY PAYMENT
  // -------------------------------
  const handleRazorpayPayment = async () => {
    if (!deliveryAddress.trim()) {
      return toast.error("Select or add a delivery address");
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/v1/orders/razorpay/order",
        { cart, email: auth.user.email, address: deliveryAddress },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Taste Treasures",
        order_id: data.orderId,
        handler: async (response) => {
          await axios.post(
            "/api/v1/orders/razorpay/verify",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              cart,
              email: auth.user.email,
              address: deliveryAddress,
            },
            { headers: { Authorization: `Bearer ${auth?.token}` } }
          );

          localStorage.removeItem("cart");
          setCart([]);
          toast.success("Payment successful");
          navigate(auth?.user?.role === "ROLE_ADMIN" ? "/dashboard/admin/MyOrders" : "/dashboard/user/orders");
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // HANDLE ADDRESS FORM
  // -------------------------------
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await axios.put(`/api/v1/address/update/${userId}/${editingAddress.id}`, form, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        toast.success("Address updated successfully");
      } else {
        await axios.post(`/api/v1/address/add/${userId}`, form, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        toast.success("Address added successfully");
      }
      setModalVisible(false);
      setEditingAddress(null);
      setForm({
        fullName: "",
        phoneNumber: "",
        addressLine: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      });
      loadAddresses();
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  return (
    <Layout>
      <div className="cart-page container py-4">
        <div className="row g-4">
         <div className="col-lg-7">
            {cart.length === 0 && <div className="card p-4 text-center shadow-sm">No items in the cart.</div>}
            {cart.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="card mb-3 shadow-sm p-3 d-flex flex-row align-items-center">
                <img src={item.image || `/api/v1/product/braintree/photo/${item.id}/0`} alt={item.name}
                     className="img-fluid rounded me-3" style={{ width: 100, height: 100, objectFit: "cover" }} />
                <div className="flex-grow-1">
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="mb-1 text-muted">{inr(item.price)}</p>
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => changeQty(idx, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => changeQty(idx, 1)}>+</button>
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => removeCartItem(idx)}>Remove</button>
                  </div>
                </div>
                <div className="fw-bold ms-3">{inr(lineSubtotal(item))}</div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE – SUMMARY + ADDRESS + PAYMENT */}
          <div className="col-lg-5">
            <div className="card p-4 shadow-sm">
              <h4 className="mb-3">Cart Summary</h4>
              <div className="mb-3">
                {cart.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between small mb-1">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{inr(lineSubtotal(item))}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>{inr(cartTotal)}</span>
                </div>
              </div>
           
              {/* ADDRESS */}
               <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-semibold m-0">Delivery Address</label>
                  <Button type="link" onClick={() => setModalVisible(true)}>+ Add New Address</Button>
                </div>

               <div className="border rounded p-2" style={{ height: "200px", overflowY: "auto", backgroundColor: "#f9f9f9" }}>
                  <Radio.Group className="d-flex flex-column gap-2 mb-3" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}>
                    {addresses.map((addr) => (
                      <Radio key={addr.id} value={formatAddress(addr)}>{formatAddress(addr)}</Radio>
                    ))}
                  </Radio.Group>
                  <textarea rows={3} className="form-control" placeholder="Enter delivery address (optional)"
                            value={deliveryAddress} readOnly onChange={(e) => setDeliveryAddress(e.target.value)} />
                </div>
              </div>

              {/* PAYMENT GATEWAY SELECTION */}
              <div className="mt-3">
                
                <label className="fw-bold">Payment Method</label>
                {cart.length === 0 ? (
                    <div className="text-muted">Add items to proceed to payment.</div>
                  ) : !auth?.token ? (
                    <div className="text-muted">Please login to continue.</div>
                  ) : !clientToken ? (
                    <div className="text-muted">Preparing payment…</div>
                  ):(
                <div>
                <Radio.Group
                  value={paymentGateway}
                  onChange={(e) => setPaymentGateway(e.target.value)}
                  className="d-flex flex-column mt-2"
                >
                  <Radio value="braintree">Braintree (Card / UPI / Wallets)</Radio>
                  <Radio value="razorpay">Razorpay (UPI / Cards)</Radio>
                </Radio.Group>
                </div>)}
              </div>

              {/* BRAINTREE UI */}
              {paymentGateway === "braintree" && (
                <div className="mt-3">
                  {clientToken ? (
                    <DropIn
                      options={{ authorization: clientToken }}
                      onInstance={(inst) => setInstance(inst)}
                    />
                  ) : (
                    <div>Loading payment gateway...</div>
                  )}
                </div>
              )}

              {/* PAY BUTTON */}
              <button
                className="btn btn-primary w-100 mt-3"
                disabled={loading || !deliveryAddress.trim() || cart.length === 0 || paymentGateway===null }
                onClick={
                  paymentGateway === "braintree"
                    ? handleBraintreePayment
                    : handleRazorpayPayment
                }
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>

        {/* ADDRESS MODAL */}
        <Modal
          title={editingAddress ? "Edit Address" : "Add Address"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingAddress(null);
          }}
          footer={null}
        >
          <form onSubmit={handleSubmitAddress}>
            {Object.keys(form).map((field) => (
              <div key={field} className="mb-2">
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  required
                />
              </div>
            ))}
            <div className="text-end">
              <button className="btn btn-primary">Save</button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default CartPage;
