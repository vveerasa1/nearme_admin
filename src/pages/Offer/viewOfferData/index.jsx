import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; 

import { Card, Switch } from "antd";
import axios from "axios";

const ViewOfferData = () => {
  const navigate = useNavigate(); 
  const [active, setActive] = useState(false);
  const { _id } = useParams();
  const { state: data } = useLocation();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${baseUrl}coupons/${_id}`);
        setActive(res.data.active);
      } catch (err) {
        console.error("Failed to fetch coupon:", err);
      }
    };

    if (data && data._id === _id) {
      setActive(data.active);
    } else {
      fetchStatus();
    }
  }, [data, _id]);

  const handleStatusChange = async (checked) => {
    try {
      await axios.patch(`${baseUrl}coupons/${_id}/status`, { active: checked });
      setActive(checked);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")} ${d.toLocaleString("default", {
      month: "long",
    })} ${d.getFullYear()}`;
  };

  return (
    <div className="container-fluid mt-4">
      <h3 className="fw-semibold mb-2">{data?.title}</h3>
      <nav className="text-muted mb-3 small">
        Home / {data?.discountType} / {data?.title}
      </nav>

      <Card className="shadow-sm p-4 position-relative" style={{ borderRadius: "10px" }}>
        <div className="row">
          {/* Left - Image + Toggle */}
          <div className="col-lg-4 d-flex flex-column">
  <img
    src={data?.images?.[0]}
    alt="Coupon"
    className="img-fluid rounded"
    style={{ maxHeight: "100%", objectFit: "cover" }}
  />

  <div className="mt-4 d-flex align-items-center gap-2">
    <Switch checked={active} onChange={handleStatusChange} />
    <span className="fw-medium">
      {active ? "Disable discount" : "Enable discount"}
    </span>
  </div>
</div>


          {/* Right - Details */}
          <div className="col-lg-8 mt-4 mt-lg-0">
            <h4 className="fw-bold mb-3">{data?.title}</h4>

            <div className="mb-3">
              {[
                { label: "Store Name", value: data?.storeInfo.display_name },
                { label: "Address", value: data?.storeInfo.address },
                { label: "Phone", value: data?.storeInfo.phone },
                { label: "How to Use", value: data?.description, muted: true },
                { label: "Coupon Details", value: data?.couponDescription, muted: true },
              ].map(({ label, value, muted }, i) => (
                <div className="row mb-2" key={i}>
                  <div className="col-4 fw-semibold text-muted">{label}:</div>
                  <div className={`col-8 ${muted ? "text-muted" : "fw-medium"}`}>{value}</div>
                </div>
              ))}
            </div>

            {(data?.discountType === "Discount" || data?.discountType === "Deal") && (
              <div className="mb-3 row">
                <div className="col-4 fw-semibold text-muted">{data.discountType}:</div>
                <div className="col-8 fw-medium">
                  {data.discountValue}
                  {data.discountType === "Discount" ? "%" : ""}
                </div>
              </div>
            )}

            <div className="mb-3 row">
              <div className="col-4 fw-semibold text-muted">Valid:</div>
              <div className="col-8 fw-medium">
  {formatDate(data?.dateRange?.startDate)} - {formatDate(data?.dateRange?.endDate)}
</div>

            </div>

            <div className="mb-3 row">
              <div className="col-4 fw-semibold text-muted">Offer Timing:</div>
              <div className="col-8">
                {data?.customDays?.length > 0 ? (
                  <ul className="list-unstyled mb-0">
                    {data.customDays.map((d) => (
                      <li key={d._id}>
                        {d.day}: {d.startTime} - {d.endTime}
                      </li>
                    ))}
                  </ul>
                ) : data?.activeTime?.startTime && data?.activeTime?.endTime ? (
                  <p className="mb-0">
                    Offer starts at {data.activeTime.startTime}, ends at {data.activeTime.endTime}
                  </p>
                ) : (
                  <p className="mb-0">No custom time added</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-right buttons */}
        <div
          className="position-absolute d-flex gap-2"
          style={{ bottom: "20px", right: "20px" }}
        >
          {/* <button className="theme-btn btn-border" type="button">
            Clear
          </button> */}
          <button
      className="theme-btn btn-main"
      style={{ fontWeight: 500 }}
      onClick={() =>
        navigate(`/edit-offer/${data.discountType}/${data._id}`, {
          state: data,
        })
      }
    >
      Edit
    </button>
        </div>
      </Card>
    </div>
  );
};

export default ViewOfferData;
