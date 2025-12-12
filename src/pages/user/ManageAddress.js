// import React, { useState, useEffect } from "react";
// import Layout from "../../components/Layout/Layout";
// import UserMenu from "../../components/Layout/UserMenu";
// import { useAuth } from "../../context/auth";
// import axios from "axios";
// import toast from "react-hot-toast";

// const ManageAddress = () => {
//   const [auth] = useAuth();
//   const [addresses, setAddresses] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     fullName: "",
//     phoneNumber: "",
//     addressLine: "",
//     city: "",
//     state: "",
//     country: "",
//     postalCode: "",
//   });

//   const userId = auth?.user?.id;

//   // Fetch all addresses
//   const loadAddresses = async () => {
//     try {
//       const { data } = await axios.get(`/api/v1/address/user/${userId}`, {
//         headers: { Authorization: `Bearer ${auth?.token}` },
//       });
//       setAddresses(data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load addresses");
//     }
//   };

//   useEffect(() => {
//     if (userId) loadAddresses();
//   }, [userId]);

//   // Handle form input
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   // Add or update address
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await axios.put(
//           `/api/v1/address/update/${userId}/${editingId}`,
//           form,
//           {
//             headers: { Authorization: `Bearer ${auth?.token}` },
//           }
//         );
//         toast.success("Address updated successfully");
//       } else {
//         await axios.post(`/api/v1/address/add/${userId}`, form, {
//           headers: { Authorization: `Bearer ${auth?.token}` },
//         });
//         toast.success("Address added successfully");
//       }
//       setForm({
//         fullName: "",
//         phoneNumber: "",
//         addressLine: "",
//         city: "",
//         state: "",
//         country: "",
//         postalCode: "",
//       });
//       setEditingId(null);
//       loadAddresses();
//     } catch (err) {
//       console.error(err);
//       toast.error("Error saving address");
//     }
//   };

//   // Edit existing address
//   const handleEdit = (a) => {
//     setEditingId(a.id);
//     setForm({
//       fullName: a.fullName,
//       phoneNumber: a.phoneNumber,
//       addressLine: a.addressLine,
//       city: a.city,
//       state: a.state,
//       country: a.country,
//       postalCode: a.postalCode,
//     });
//   };

//   // Delete address
//   const handleDelete = async (addressId) => {
//     if (!window.confirm("Are you sure you want to delete this address?")) return;
//     try {
//       await axios.delete(`/api/v1/address/delete/${userId}/${addressId}`, {
//         headers: { Authorization: `Bearer ${auth?.token}` },
//       });
//       toast.success("Address deleted successfully");
//       loadAddresses();
//     } catch (err) {
//       console.error(err);
//       toast.error("Error deleting address");
//     }
//   };

//   // Set default address
//   const handleSetDefault = async (addressId) => {
//     try {
//       await axios.put(
//         `/api/v1/address/set-default/${userId}/${addressId}`,
//         {},
//         { headers: { Authorization: `Bearer ${auth?.token}` } }
//       );
//       toast.success("Default address updated");
//       loadAddresses();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to set default address");
//     }
//   };

//   return (
//     <Layout title={"Manage Addresses"}>
//       <div className="container-fluid m-3 p-3 dashboard">
//         <div className="row">
//           <div className="col-md-3">
//             <UserMenu />
//           </div>
//           <div className="col-md-8">
//             <div className="form-container" style={{ marginTop: "-40px" }}>
//               <h4 className="title mb-3">
//                 {editingId ? "Update Address" : "Add New Address"}
//               </h4>

//               {/* Address Form */}
//               <form onSubmit={handleSubmit}>
//                 <div className="row">
//                   {[
//                     "fullName",
//                     "phoneNumber",
//                     "addressLine",
//                     "city",
//                     "state",
//                     "country",
//                     "postalCode",
//                   ].map((field) => (
//                     <div className="col-md-6 mb-3" key={field}>
//                       <input
//                         type="text"
//                         name={field}
//                         value={form[field] || ""}
//                         onChange={handleChange}
//                         className="form-control"
//                         placeholder={`Enter ${field
//                           .replace(/([A-Z])/g, " $1")
//                           .toLowerCase()}`}
//                         required
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 <button type="submit" className="btn btn-primary">
//                   {editingId ? "Update Address" : "Add Address"}
//                 </button>
//                 {editingId && (
//                   <button
//                     type="button"
//                     className="btn btn-secondary ms-2"
//                     onClick={() => {
//                       setEditingId(null);
//                       setForm({
//                         fullName: "",
//                         phoneNumber: "",
//                         addressLine: "",
//                         city: "",
//                         state: "",
//                         country: "",
//                         postalCode: "",
//                       });
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </form>

//               {/* Address List */}
//               <h4 className="mt-5 mb-3">Your Saved Addresses</h4>
//               {addresses.length === 0 ? (
//                 <p>No addresses found. Add one above!</p>
//               ) : (
//                 <div className="row">
//                   {addresses.map((a) => (
//                     <div key={a.id} className="col-md-6 mb-3">
//                       <div className="card p-3 shadow-sm">
//                         <h5>{a.fullName}</h5>
//                         <p className="mb-1">{a.addressLine}</p>
//                         <p className="mb-1">
//                           {a.city}, {a.state}, {a.country} - {a.postalCode}
//                         </p>
//                         <p className="mb-1">
//                           <strong>Phone:</strong> {a.phoneNumber}
//                         </p>
//                         {a.isDefault && (
//                           <span className="badge bg-success">Default</span>
//                         )}
//                         <div className="mt-3">
//                           <button
//                             onClick={() => handleEdit(a)}
//                             className="btn btn-sm btn-warning me-2"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(a.id)}
//                             className="btn btn-sm btn-danger me-2"
//                           >
//                             Delete
//                           </button>
//                           {!a.isDefault && (
//                             <button
//                               onClick={() => handleSetDefault(a.id)}
//                               className="btn btn-sm btn-outline-primary"
//                             >
//                               Set Default
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ManageAddress;



import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal, Table, Button } from "antd";

const ManageAddress = () => {
  const [auth] = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

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
      const { data } = await axios.get(`/api/v1/address/user/${userId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      console.log(data.data);
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
          `/api/v1/address/update/${userId}/${editingAddress.id}`,
          form,
          { headers: { Authorization: `Bearer ${auth?.token}` } }
        );
        toast.success("Address updated successfully");
      } else {
        await axios.post(`/api/v1/address/add/${userId}`, form, {
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
      await axios.delete(`/api/v1/address/delete/${userId}/${id}`, {
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
        `/api/v1/address/set-default/${userId}/${id}`,
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
            <UserMenu />
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

export default ManageAddress;
