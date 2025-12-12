import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Input, Button, message, Modal} from "antd";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import { DownloadOutlined,DeleteOutlined, EyeOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { generateOrderPDF } from "../generateOrderPDF";
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [auth] = useAuth();
  const [searchOrderId, setSearchOrderId] = useState("");

  // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
  // Fetch orders for logged-in user
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/orders/orders/buyer/${auth.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      setOrders(data);
      setFilteredOrders(data); // initially show all
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Calculate total amount for a single order
  const calculateTotal = (products = []) => {
    if (!Array.isArray(products)) return 0;
    return products.reduce((acc, item) => {
      const product = item.product || item;
      const qty = item.quantity || item.count || 1;
      return acc + (product.price || 0) * qty;
    }, 0);
  };

  // Handle search
  const handleSearch = () => {
    if (!searchOrderId.trim()) {
      setFilteredOrders(orders); // if empty show all
      return;
    }
    const result = orders.filter((o) =>
      o.id.toString().toLowerCase()===(searchOrderId.toLowerCase())
    );
    setFilteredOrders(result);
  };

    // Cancel order handler
    const handleCancelOrder = async (orderId,status) => {
      try {
        if (status !== "PROCESSING") {
      toast.error("You can not cancel this order you can able to cancel orders that are in processing.");
      return message.error("You can not cancel this order you can able to cancel orders that are in processing.");
    }
        await axios.put(
          `/api/v1/orders/order-status/${orderId}`,
          { status: "CANCELLED" },
          { headers: { Authorization: `Bearer ${auth?.token}` } }
        );
        getOrders(); // refresh
        toast.success("Order cancelled successfully");
        // getOrders(); // refresh
      } catch (error) {
        console.log(error);
        toast.error("Failed to cancel order");
      }
    };
    // Delete Order handler
  const handleDeleteOrder = async (orderId, status) => {
    if (status !== "CANCELLED" && status !== "DELIVERED") {
      toast.error("You can delete only CANCELLED or DELIVERED orders");
      return message.error("You can delete only CANCELLED or DELIVERED orders");
    }

    try {
      await axios.delete(`/api/v1/orders/delete/${orderId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      toast.success("Order deleted successfully");
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete order");
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

   // Open View Modal
  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  return (
    <Layout title={"Your Orders"}>
      <div className="container-fluid p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu/>
          </div>
          <div className="col-md-9">
            <h1 className="text-center mb-4">All Orders</h1>

            {/* Search Section */}
            <div className="d-flex gap-2 mb-4">
              <Input
                placeholder="Enter Order ID"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                style={{ width: "250px" }}
              />
              <Button type="primary" onClick={handleSearch}>
                Search
              </Button>
              <Button
                onClick={() => {
                  setSearchOrderId("");
                  setFilteredOrders(orders);
                }}
              >
                Reset
              </Button>
            </div>

            {filteredOrders?.length === 0 && <p>No orders found.</p>}

            {filteredOrders?.map((o, i) => (
              <div className="border shadow p-3 mb-4" key={o._id || i}>
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{o?.id}</td>
                      <td>{o?.status}</td>
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
                        {/* <Button
                          type="primary"
                          danger
                          // disabled={o?.status !== "PROCESSING"}
                          onClick={() => handleCancelOrder(o?.id,o?.status)}
                        >
                          Cancel
                        </Button> */}
                        
                        {/* Cancel Order  */}
                           <abbr title="Cancel Order"><CloseCircleOutlined
                          // disabled={o?.status !== "PROCESSING"}
                          style={{ color: "red", marginRight: 10, cursor: "pointer" }}
                          onClick={() => handleCancelOrder(o?.id,o?.status)}
                        /></abbr>

                        {/* View Order */}
                        <abbr title="View Order"><EyeOutlined
                          
                          style={{ color: "Blue", marginRight: 10, cursor: "pointer" }}
                          onClick={() => handleView(o)}
                        /></abbr>

                        {/* Delete Order */}
                        <abbr title="Delete Order"><DeleteOutlined
                          // disabled={o?.status === "CANCELLED"}
                          style={{ color: "red", marginRight: 10, cursor: "pointer" }}
                          onClick={() => handleDeleteOrder(o.id, o.status)}
                        /></abbr>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Products in Order */}
                <div className="container">
                  {o?.items?.length > 0 ? (
                    o.items.map((item, idx) => {
                      const product = item.productId || item;
                      const qty = item.quantity;
                      return (
                        <div
                          key={product || idx}
                          className="d-flex align-items-center border rounded p-2 mb-2"
                        >
                          <img
                            src={`/api/v1/product/product-photo/${product}/0`}
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
      </div>
      {/* VIEW ORDER MODAL */}
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

export default MyOrders;
