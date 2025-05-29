import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { Input, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Toaster } from "react-hot-toast";
const { Search } = Input;
import { Card } from "antd"; // Import Card from Ant Design
import fallbackimage from "../../assets/images/landingPage.png";
import axiosInstance from '../../interceptors/axiosInstance';

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const hostUrl = import.meta.env.VITE_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedFetchData(value);
  };

  const debouncedFetchData = debounce((searchText) => {
    setCurrentPage(1);
    fetchUsers(searchText);
  }, 500);

  useEffect(()=>{
    fetchUsers(searchText)
  },[])

  const fetchUsers = async (search = "") => {
    try {
      const queryParam = search ? `?search=${encodeURIComponent(search)}` : "";
      const response = await axiosInstance.get(`/users${queryParam}`);
      const userData = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
  
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = users.filter((user) =>
      user?.mobile?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const formatDOB = (dob) => {
    if (!dob) return "Not available";
    const date = new Date(dob);
    if (isNaN(date)) return dob; // fallback for non-ISO strings
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatAddress = (address) => {
    if (!address) return "Not available";
    if (typeof address === "string") return address;
    const { addressLine, city, state, country, zip } = address;
    return [addressLine, city, state, zip, country].filter(Boolean).join(", ");
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="content-wrapper">
        <div className="breadcrumb-wrapper d-flex flex-column flex-md-row">
          <div className="breadcrumb-block">
            <h2 className="page-heading">Users</h2>
            <ul className="breadcrumb-list">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="breadcrumb-link">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <span className="breadcrumb-link">Users</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Search */}
        <div className="lists-container py-4">
          <div className="row">
            <div className="col-12">
              <div className="lists-wrapper userlist">
                {/* Header + Search */}
                <div className="lw-top d-flex flex-column flex-md-row">
                  <div className="list-head py-lg-0 py-3">
                    <h3>Users</h3>
                  </div>
                  <div className="list-filter">
                  <form>
                    <div className="lf-search">
                      <input
                        className="lfs-input"
                        type="text"
                        placeholder="Search here..."
                        onChange={handleSearchChange}
                      />
                      <div className="search-icon-container">
                        <div type="button"></div>
                      </div>
                    </div>
                  </form>
</div>

                </div>

                {/* Listings */}
                <div className="row mt-4">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        className="col-lg-4 col-md-6 col-12 d-flex py-3"
                        key={user._id}
                      >
                        <Card
                          hoverable
                          className="w-100 h-100 position-relative"
                          style={{
                            marginBottom: "20px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                          }}
                        >
                          <div className="row g-0 h-100">
                            {/* Left Column - Image */}
                            <div className="col-4 d-flex align-items-center justify-content-center p-3">
                              <img
                                src={fallbackimage}
                                alt="User"
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  maxHeight: "120px",
                                  objectFit: "contain",
                                  borderRadius: "8px",
                                }}
                              />
                            </div>

                            {/* Right Column - User Info */}
                            <div className="col-8">
                              <div className="card-body">
                                <h5 className="card-title d-flex align-items-center gap-2 mb-2">
                                  {user.userName || "No Name"}
                                  {user.active ? (
                                    <Tag
                                      icon={<CheckCircleOutlined />}
                                      color="success"
                                    >
                                      Verified
                                    </Tag>
                                  ) : (
                                    <Tag
                                      icon={<CloseCircleOutlined />}
                                      color="error"
                                    >
                                      Not-Verified
                                    </Tag>
                                  )}
                                </h5>
                                <p className="card-text mb-1">
                                  <strong>Mobile:</strong>{" "}
                                  {user.mobile || "N/A"}
                                </p>
                                <p className="card-text mb-1">
                                  <strong>Postal Code:</strong>{" "}
                                  {user.postalCode || "N/A"}
                                </p>
                                <p className="card-text mb-1">
                                  <strong>DOB:</strong> {formatDOB(user.dob)}
                                </p>
                                <p className="card-text mb-0">
                                  <strong>Address:</strong>{" "}
                                  {formatAddress(user.address)}
                                </p>
                                <Link
                                  to={`/view-users/${user._id}`}
                                  state={user} // Pass the user data to the detail page
                                  className="text-decoration-underline text-primary fw-semibold"
                                >
                                  View
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center mt-3">
                      <p>No Users Found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
