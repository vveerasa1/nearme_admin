import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Card, Switch } from "antd";
import fallbackImage from "../../assets/images/landingPage.png";
import { CheckCircleTwoTone } from "@ant-design/icons";
import axios from "axios";

const ViewUser = () => {
  const { _id } = useParams();
  const { state: user } = useLocation();
  const [isEnabled, setIsEnabled] = useState(user?.enabled ?? false);

  // const { state: data } = useLocation();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const formatDOB = (dob) => {
    if (!dob) return "Not available";
    const date = new Date(dob);
    if (isNaN(date)) return dob;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatJoinedDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const formatAddress = (address) => {
    if (!address) return "Not available";
    if (typeof address === "string") return address;
    const { addressLine, city, state, country, zip } = address;
    return [addressLine, city, state, zip, country].filter(Boolean).join(", ");
  };

  const handleStatusChange = async (checked) => {
    try {
      await axios.put(`${baseUrl}users/profile/${_id}`, { enabled: checked });
      setIsEnabled(checked);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h3 className="fw-semibold mb-2">{user?.userName || "User Details"}</h3>
      <nav className="text-muted mb-3 small">
        Home / Users / {user?.userName || "User Details"}
      </nav>

      <Card className="shadow-sm p-4" style={{ borderRadius: "10px" }}>
        <div className="row">
          {/* Left Column - Image */}
          <div className="col-lg-4 d-flex align-items-center justify-content-center">
            <img
              src={user?.image || fallbackImage}
              alt="User"
              className="img-fluid rounded"
              style={{ maxHeight: "200px", objectFit: "contain" }}
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />
          </div>

          {/* Right Column - User Info */}
          <div className="col-lg-8">
            <h5 className="fw-bold">{user?.userName || "No Name"}</h5>
            <p className="mb-1">
              <strong>DOB:</strong> {formatDOB(user?.dob)}
            </p>
            <p className="mb-1">
              <strong>Phone Number:</strong> {user?.mobile || "No mobile number"}
            </p>
            <p className="mb-1">
              <strong>Address:</strong> {formatAddress(user?.address)}
            </p>
            <p className="mb-1">
              <strong>Joined by:</strong> {formatJoinedDate(user?.createdAt)}
            </p>
            <p className="mb-1">
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              <span style={{ color: "#52c41a", marginLeft: "6px" }}>Verified</span>
            </p>
          </div>
        </div>

        {/* Switch Toggle */}
        <div className="d-flex align-items-center mt-4">
          <Switch
            checked={isEnabled}
            onChange={handleStatusChange}
            style={{ marginRight: "10px" }}
          />
          <span>{isEnabled ? "Enable user" : "Disable user"}</span>
        </div>
      </Card>
    </div>
  );
};

export default ViewUser;
