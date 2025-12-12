import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
const { Option } = Select;
const Users = () => {

  const api="https://tastetresures-backend-production.up.railway.app";
  const [Roles] = useState([
      "ROLE_ADMIN",
      "ROLE_USER"
    ]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
const [auth, setAuth] = useAuth();
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${api}/api/v1/auth/users`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      console.log(data);
      if (data && Array.isArray(data)) {
        setUsers(data);
      } else if (data?.users) {
        setUsers(data.users); // if API returns {users: [...]}
      }
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (userId, value) => {
    try {
      await axios.put(
        `${api}/api/v1/auth/update-role/${userId}`,
        { role: value },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Users</h1>
            {loading ? (
              <div>Loading...</div>
            ) : users.length === 0 ? (
              <div>No users found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      {/* <th>Address</th> */}
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr key={user.id || idx}>
                        <td>{idx + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        {/* <td>{user.address}</td> */}
                        {/* <td>{user.role}</td> */}
                        <td>
                          {
                            auth?.user?.id == user.id ? user.role :
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(user.id, value)}
                            defaultValue={user.role}
                          >
                            {Roles.map((s, idx) => (
                              <Option key={idx} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
