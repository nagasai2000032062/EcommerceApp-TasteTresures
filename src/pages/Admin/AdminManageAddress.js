import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal, Table, Button } from "antd";
import AdminMenu from "../../components/Layout/AdminMenu";

const AdminManageAddress = () => {
  const [auth] = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const api="https://tastetresures-backend-production.up.railway.app";
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const userId = auth?.user?.id;

  // Fetch addresses
  const loadAddresses = async () => {
    try {
      const { data } = await axios.get(`${api}/api/v1/address/user/${userId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      console.log(data);
      setAddresses(data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    if (userId) loadAddresses();
  }, [userId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await axios.put(
          `${api}/api/v1/address/update/${userId}/${editingAddress.id}`,
          form,
          { headers: { Authorization: `Bearer ${auth?.token}` } }
        );
        toast.success("Address updated successfully");
      } else {
        await axios.post(`${api}/api/v1/address/add/${userId}`, form, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        toast.success("Address added successfully");
      }

      setForm({
        fullName: "",
        phoneNumber: "",
        addressLine: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      });
      setEditingAddress(null);
      setModalVisible(false);
      loadAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Error saving address");
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setForm({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(`${api}/api/v1/address/delete/${userId}/${id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      toast.success("Address deleted successfully");
      loadAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.put(
        `${api}/api/v1/address/set-default/${userId}/${id}`,
        {},
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      toast.success("Default address updated");
      loadAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default address");
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Address",
      dataIndex: "addressLine",
      key: "addressLine",
      width:"500px",
      render: (_, record) =>
        `${record.addressLine}, ${record.city}, ${record.state}, ${record.country} - ${record.postalCode}`,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Default",
      dataIndex: "isDefault",
      key: "isDefault",
      render: (isDefault) =>
        isDefault ? <span className="badge bg-success">Default</span> : "",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            size="small"
            className="me-2"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="danger"
            size="small"
            className="me-2"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
          {!record.isDefault && (
            <Button
              size="small"
              onClick={() => handleSetDefault(record.id)}
            >
              Set Default
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Layout title="Manage Addresses">
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Your Addresses</h2>
              <Button type="primary" onClick={() => setModalVisible(true)}>
                + Add Address
              </Button>
            </div>
            <Table dataSource={addresses} columns={columns} rowKey="id" />

            {/* Modal Form */}
            <Modal
              title={editingAddress ? "Edit Address" : "Add Address"}
              visible={modalVisible}
              onCancel={() => {
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
              }}
              footer={null}
            >
              <form onSubmit={handleSubmit}>
                {[
                  "fullName",
                  "phoneNumber",
                  "addressLine",
                  "city",
                  "state",
                  "country",
                  "postalCode",
                ].map((field) => (
                  <div className="mb-3" key={field}>
                    <input
                      type="text"
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      className="form-control"
                      placeholder={field
                        .replace(/([A-Z])/g, " $1")
                        .toLowerCase()}
                      required
                    />
                  </div>
                ))}
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {editingAddress ? "Update Address" : "Add Address"}
                  </button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminManageAddress;
