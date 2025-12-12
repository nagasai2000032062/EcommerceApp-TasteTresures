// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import AdminMenu from "../../components/Layout/AdminMenu";
// import Layout from "../../components/Layout/Layout";
// import { useAuth } from "../../context/auth";
// import moment from "moment";
// import { Select } from "antd";
// const { Option } = Select;

// const AdminOrders = () => {
//   const [statusOptions] = useState([
//     "NOT_PROCESSED",
//     "PROCESSING",
//     "SHIPPED",
//     "DELIVERED",
//     "CANCELLED",
//   ]);
//   const [orders, setOrders] = useState([]);
//   const [auth] = useAuth();

//   // Fetch all orders
//   const getOrders = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/auth/all-orders", {
//         headers: { Authorization: `Bearer ${auth?.token}` },
//       });
//       setOrders(data);
//       console.log(data);
//       console.log("Admin orders fetched:", data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (auth?.token) getOrders();
//   }, [auth?.token]);

//   // Handle order status change
//   const handleChange = async (orderId, value) => {
//     try {
//       await axios.put(
//         `/api/v1/auth/order-status/${orderId}`,
//         { status: value },
//         { headers: { Authorization: `Bearer ${auth?.token}` } }
//       );
//       getOrders();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Calculate total for an order
//   const calculateTotal = (items = []) => {
//     if (!Array.isArray(items)) return 0;
//     return items.reduce((acc, item) => {
//       const product = item.productId || item;
//       const qty = item.quantity || item.count || 1;
//       return acc + (item.price || 0) * qty;
//     }, 0);
//   };

//   return (
//     <Layout title={"All Orders Data"}>
//       <div className="row dashboard">
//         <div className="col-md-3">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9">
//           <h1 className="text-center mb-4">All Orders</h1>

//           {orders?.length === 0 && <p>No orders found.</p>}

//           {orders?.map((o, i) => (
//             <div className="border shadow p-3 mb-4" key={o._id || i}>
//               {/* Order Summary */}
//               <table className="table mb-3">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>OrderId</th>
//                     <th>Status</th>
//                     <th>Buyer</th>
//                     <th>Address</th>
//                     <th>Date</th>
//                     <th>Payment</th>
//                     <th>Quantity</th>
//                     <th>Total Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{i + 1}</td>
//                     <td>{o?.id}</td>
//                     <td>
//                       <Select
//                         bordered={false}
//                         onChange={(value) => handleChange(o.id, value)}
//                         defaultValue={o?.status}
//                       >
//                         {statusOptions.map((s, idx) => (
//                           <Option key={idx} value={s}>
//                             {s}
//                           </Option>
//                         ))}
//                       </Select>
//                     </td>
//                     <td>{o?.buyer?.name}</td>
//                     <td>{o?.orderAddress}</td>
//                     <td>{moment(o?.createdAt).fromNow()}</td>
//                     <td>{o?.payment ? "Success" : "Failed"}</td>
//                     <td>
//                       {o?.items?.reduce(
//                         (acc, item) => acc + (item.quantity || item.count || 1),
//                         0
//                       )}
//                     </td>
//                     <td>₹{calculateTotal(o?.items).toFixed(2)}</td>
//                   </tr>
//                 </tbody>
//               </table>

//               {/* Products in Order */}
//               <div className="container">
//                 {o?.items?.length > 0 ? (
//                   o.items.map((item, idx) => {
//                     const productId = item.productId || item;
//                     const qty = item.quantity || item.count || 1;
//                     return (
//                       <div
//                         className="d-flex align-items-center border rounded p-2 mb-2"
//                         key={productId || idx}
//                       >
//                         <img
//                           src={`/api/v1/product/product-photo/${productId}/0`}
//                           alt={item.productName}
//                           width="80"
//                           height="80"
//                           className="me-3 rounded"
//                         />
//                         <div>
//                           <h6 className="mb-1">{item.productName}</h6>
//                           <p className="mb-0">
//                             Price: ₹{item.price} × {qty} ={" "}
//                             <b>₹{(item.price * qty).toFixed(2)}</b>
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <p>No products found in this order.</p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminOrders;







// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import AdminMenu from "../../components/Layout/AdminMenu";
// import Layout from "../../components/Layout/Layout";
// import { useAuth } from "../../context/auth";
// import moment from "moment";
// import { Select, DatePicker, Input } from "antd";

// const { Option } = Select;
// const { RangePicker } = DatePicker;

// const AdminOrders = () => {
//   const [statusOptions] = useState([
//     "NOT_PROCESSED",
//     "PROCESSING",
//     "SHIPPED",
//     "DELIVERED",
//     "CANCELLED",
//   ]);
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [auth] = useAuth();

//   // filters
//   const [searchOrderId, setSearchOrderId] = useState("");
//   const [dateRange, setDateRange] = useState([]);

//   // Fetch all orders
//   const getOrders = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/auth/all-orders", {
//         headers: { Authorization: `Bearer ${auth?.token}` },
//       });
//       setOrders(data);
//       setFilteredOrders(data); // initial display
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (auth?.token) getOrders();
//   }, [auth?.token]);

//   // Handle order status change
//   const handleChange = async (orderId, value) => {
//     try {
//       await axios.put(
//         `/api/v1/auth/order-status/${orderId}`,
//         { status: value },
//         { headers: { Authorization: `Bearer ${auth?.token}` } }
//       );
//       getOrders();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Calculate total for an order
//   const calculateTotal = (items = []) => {
//     if (!Array.isArray(items)) return 0;
//     return items.reduce((acc, item) => {
//       const qty = item.quantity || item.count || 1;
//       return acc + (item.price || 0) * qty;
//     }, 0);
//   };

//   // Apply filters whenever searchOrderId or dateRange changes
//   useEffect(() => {
//     let filtered = [...orders];

//     // Case 1: filter by orderId
//     if (searchOrderId.trim()) {
//       filtered = filtered.filter((o) =>
//         o.id.toString().toLowerCase().includes(searchOrderId.toLowerCase())
//       );
//     }

//     // Case 2: filter by date range
//     if (dateRange.length === 2) {
//       const [start, end] = dateRange;
//       const startMoment = moment(start);
//       const endMoment = moment(end);
//       filtered = filtered.filter((o) => {
//         const created = moment(o?.createdAt, moment.ISO_8601);
//       if (!created.isValid()){ 
        
//         console.log("not valid");
//         return false; 

//       }// skip invalid dates
//       console.log("valid");
//       console.log(start,end);
//       console.log(created);
//       return (
//       created.isSameOrAfter(startMoment, "day") &&
//       created.isSameOrBefore(endMoment, "day")
//     );
//       });
//     }

//     setFilteredOrders(filtered);
//   }, [searchOrderId, dateRange, orders]);

//   return (
//     <Layout title={"All Orders Data"}>
//       <div className="row dashboard">
//         <div className="col-md-3">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9">
//           <h1 className="text-center mb-4">All Orders</h1>

//           {/* Filters Section */}
//           <div className="d-flex flex-wrap gap-3 mb-4">
//             <Input
//               placeholder="Search by Order ID"
//               value={searchOrderId}
//               onChange={(e) => setSearchOrderId(e.target.value)}
//               style={{ width: "200px" }}
//             />
//             <RangePicker
//               onChange={(dates) => setDateRange(dates || [])}
//               value={dateRange}
//             />
//           </div>

//           {filteredOrders?.length === 0 && <p>No orders found.</p>}

//           {filteredOrders?.map((o, i) => (
//             <div className="border shadow p-3 mb-4" key={o.id || i}>
//               {/* Order Summary */}
//               <table className="table mb-3">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>OrderId</th>
//                     <th>Status</th>
//                     <th>Buyer</th>
//                     <th>Address</th>
//                     <th>Date</th>
//                     <th>Payment</th>
//                     <th>Quantity</th>
//                     <th>Total Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{i + 1}</td>
//                     <td>{o?.id}</td>
//                     <td>
//                       <Select
//                         bordered={false}
//                         onChange={(value) => handleChange(o.id, value)}
//                         defaultValue={o?.status}
//                       >
//                         {statusOptions.map((s, idx) => (
//                           <Option key={idx} value={s}>
//                             {s}
//                           </Option>
//                         ))}
//                       </Select>
//                     </td>
//                     <td>{o?.buyer?.name}</td>
//                     <td>{o?.orderAddress}</td>
//                     <td>{moment(o?.createdAt).format("DD-MMM-YYYY")}</td>
//                     <td>{o?.payment ? "Success" : "Failed"}</td>
//                     <td>
//                       {o?.items?.reduce(
//                         (acc, item) => acc + (item.quantity || item.count || 1),
//                         0
//                       )}
//                     </td>
//                     <td>₹{calculateTotal(o?.items).toFixed(2)}</td>
//                   </tr>
//                 </tbody>
//               </table>

//               {/* Products in Order */}
//               <div className="container">
//                 {o?.items?.length > 0 ? (
//                   o.items.map((item, idx) => {
//                     const productId = item.productId || item;
//                     const qty = item.quantity || item.count || 1;
//                     return (
//                       <div
//                         className="d-flex align-items-center border rounded p-2 mb-2"
//                         key={productId || idx}
//                       >
//                         <img
//                           src={`/api/v1/product/product-photo/${productId}/0`}
//                           alt={item.productName}
//                           width="80"
//                           height="80"
//                           className="me-3 rounded"
//                         />
//                         <div>
//                           <h6 className="mb-1">{item.productName}</h6>
//                           <p className="mb-0">
//                             Price: ₹{item.price} × {qty} ={" "}
//                             <b>₹{(item.price * qty).toFixed(2)}</b>
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <p>No products found in this order.</p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminOrders;








import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select, DatePicker, Input } from "antd";
import { generateOrderPDF } from "../generateOrderPDF";
import { Button, message, Modal } from "antd";
import toast from "react-hot-toast";
import { DownloadOutlined,DeleteOutlined, EyeOutlined, CloseCircleOutlined } from "@ant-design/icons";
const { Option } = Select;
const { RangePicker } = DatePicker;


const AdminOrders = () => {
  const [statusOptions] = useState([
    "NOT_PROCESSED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [auth] = useAuth();

  // filters
  const [searchOrderId, setSearchOrderId] = useState("");
  const [dateRange, setDateRange] = useState([]);
   // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

  // -------- Helpers --------
  const toStartOfDayMs = (val) => {
    if (!val) return null;
    const d = val?.toDate ? val.toDate() : new Date(val);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const toEndOfDayMs = (val) => {
    if (!val) return null;
    const d = val?.toDate ? val.toDate() : new Date(val);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  };

  const parseCreatedAtToMs = (s) => {
    if (!s) return null;
    if (s instanceof Date) return s.getTime();
    if (typeof s === "number") return s;

    // Try native Date first
    let t = Date.parse(s);
    if (!Number.isNaN(t)) return t;

    // Trim microseconds to 3 decimals (e.g., .861942 -> .861)
    const sanitized = s.replace(/(\.\d{3})\d+$/, "$1");
    t = Date.parse(sanitized);
    if (!Number.isNaN(t)) return t;

    // Fallback to moment
    const m = moment(
      s,
      [
        moment.ISO_8601,
        "YYYY-MM-DDTHH:mm:ss.SSSSSS",
        "YYYY-MM-DDTHH:mm:ss.SSS",
        "YYYY-MM-DDTHH:mm:ss",
        "DD-MMM-YYYY",
      ],
      true
    );
    if (m.isValid()) return m.valueOf();

    return null;
  };

  // -------- API --------
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/orders/all-orders", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      console.log(data);
      setOrders(data);
      setFilteredOrders(data); // initial display
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Handle order status change
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(
        `/api/v1/orders/order-status/${orderId}`,
        { status: value },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      // toast.success(`Order ${value === "CANCELLED" ? "cancelled & refunded" : "updated"} successfully`);
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  // Download PDF
    const downloadPdf = async (orderId) => {
      try {
        const response = await axios.get(
          `/api/v1/orders/${orderId}/pdf`,
          { 
            responseType: "blob",
            headers: { Authorization: `Bearer ${auth?.token}` }
          }
        );
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `order-${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        toast.error("Failed to download PDF");
      }
    };

  // Calculate total for an order
  const calculateTotal = (items = []) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => {
      const qty = item.quantity || item.count || 1;
      return acc + (item.price || 0) * qty;
    }, 0);
  };
  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // -------- Filtering --------
  useEffect(() => {
    let filtered = [...orders];

    // Filter by Order ID (exact match, trimming spaces)
    if (searchOrderId.trim()) {
      const needle = searchOrderId.trim().toLowerCase();
      filtered = filtered.filter(
        (o) => (o?.id + "").toLowerCase() === needle
      );
    }

    // Filter by Date Range
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      const startMs = toStartOfDayMs(dateRange[0]);
      const endMs = toEndOfDayMs(dateRange[1]);

      if (startMs != null && endMs != null) {
        filtered = filtered.filter((o) => {
          const createdMs = parseCreatedAtToMs(o?.createdAt);
          return (
            createdMs != null && createdMs >= startMs && createdMs <= endMs
          );
        });
      }
    }

    setFilteredOrders(filtered);
  }, [searchOrderId, dateRange, orders]);

  return (
    <Layout title={"All Orders Data"}>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4">All Orders</h1>

          {/* Filters Section */}
          <div className="d-flex flex-wrap gap-3 mb-4">
            <Input
              placeholder="Search by Order ID"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              style={{ width: "200px" }}
            />
            <RangePicker
              onChange={(dates) => setDateRange(dates || [])}
              value={dateRange}
            />
          </div>

          {filteredOrders?.length === 0 && <p>No orders found.</p>}

          {filteredOrders?.map((o, i) => (
            <div className="border shadow p-3 mb-4" key={o.id || i}>
              {/* Order Summary */}
              <table className="table mb-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>OrderId</th>
                    <th>Status</th>
                    <th>Buyer</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{i + 1}</td>
                    <td>{o?.id}</td>
                    <td>
                      <Select
                        bordered={false}
                        onChange={(value) => handleChange(o.id, value)}
                        defaultValue={o?.status}
                      >
                        {statusOptions.map((s, idx) => (
                          <Option key={idx} value={s}>
                            {s}
                          </Option>
                        ))}
                      </Select>
                    </td>
                    <td>{o?.buyer?.name}</td>
                    <td style={{width:280}}>{o?.orderAddress}</td>
                    <td>{moment(o?.createdAt).format("DD-MMM-YYYY")}</td>
                    <td>{o?.payment ? "Success" : "Failed"}</td>
                    <td>
                      {o?.items?.reduce(
                        (acc, item) => acc + (item.quantity || item.count || 1),
                        0
                      )}
                    </td>
                    <td>₹{calculateTotal(o?.items).toFixed(2)}</td>
                    <td>
                      {/* View Order */}
                        <abbr title="View Order"><EyeOutlined
                          style={{ color: "Blue", marginRight: 10, cursor: "pointer" }}
                          onClick={() => handleView(o)}
                        /></abbr>
                        </td>
                  </tr>
                </tbody>
              </table>

              {/* Products in Order */}
              <div className="container">
                {o?.items?.length > 0 ? (
                  o.items.map((item, idx) => {
                    const productId = item.productId || item;
                    const qty = item.quantity || item.count || 1;
                    return (
                      <div
                        className="d-flex align-items-center border rounded p-2 mb-2"
                        key={productId || idx}
                      >
                        <img
                          src={`/api/v1/product/product-photo/${productId}/0`}
                          alt={item.productName}
                          width="80"
                          height="80"
                          className="me-3 rounded"
                        />
                        <div>
                          <h6 className="mb-1">{item.productName}</h6>
                          <p className="mb-0">
                            weight: {item.variant}
                          </p>
                          <p className="mb-0">
                            Price: ₹{item.price} × {qty} ={" "}
                            <b>₹{(item.price * qty).toFixed(2)}</b>
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No products found in this order.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
              visible={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
              width={700}
            >
              {selectedOrder && (
                <div>
                  <h3 className="text-center">Order Details</h3>
                  <hr />
      
                  <p><b>Order ID:</b> {selectedOrder.id}</p>
                  <p><b>Status:</b> {selectedOrder.status}</p>
                  <p><b>Date:</b> {moment(selectedOrder.createdAt).format("DD-MMM-YYYY")}</p>
                  <p><b>Buyer:</b> {selectedOrder.buyer?.name}</p>
                  <p><b>Address:</b> {selectedOrder.orderAddress}</p>
      
                  <h5 className="mt-3">Products</h5>
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="d-flex align-items-center border rounded p-2 mb-2"
                    >
                      <img
                        src={`/api/v1/product/product-photo/${item.productId}/0`}
                        alt={item.productName}
                        width="80"
                        height="80"
                        className="me-3 rounded"
                      />
                      <div>
                        <h6>{item.productName}</h6>
                        <p>Variant: {item.variant}</p>
                        <p>
                          ₹{item.price} × {item.quantity} ={" "}
                          <b>₹{(item.price * item.quantity).toFixed(2)}</b>
                        </p>
                      </div>
                    </div>
                  ))}
      
                  {/* Download PDF Button */}
                  <div className="text-center mt-3">
                    <abbr title="Download Backend Request"><Button
                      type="primary"
                      onClick={() => downloadPdf(selectedOrder.id)}
                    >
                      Download PDF
                    </Button></abbr>
                  </div>
                  <div className="text-center mt-3">
                  <abbr title="Download Frontend Request"><Button type="primary" onClick={() => generateOrderPDF(selectedOrder)}>
                    Download PDF
                    </Button></abbr>
                  </div>
                  
                </div>
              )}
            </Modal>
    </Layout>
  );
};

export default AdminOrders;
