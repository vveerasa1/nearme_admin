import React from "react";
import { Link } from "react-router-dom";
import { Button, Popconfirm } from "antd";
import { Edit, Delete } from "@mui/icons-material";
import fallbackImage from "../../assets/images/landingPage.png";

const formatValidDateRange = (startDateStr, endDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const format = (d) =>
    `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`;
  return `${format(start)} - ${format(end)}`;
};

const CardComponent = ({
  item,
  handleDelete,
  cancel,
}) => {
  const isDisabled = item.active === false;

  return (
    <div className="col-lg-4 col-md-6 col-12 d-flex py-3">
      <div
        className="w-100 h-100 position-relative card"
        style={{
          marginBottom: "20px",
          opacity: isDisabled ? 0.6 : 1,
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          border: "none",
        }}
      >
        <div className="row w-100 g-0">
          {/* Left Image */}
          <div className="col-4">
            <Link
              to={`/view/${item.discountType}/${item._id}`}
              state={item}
              className="text-decoration-none"
            >
              <img
                src={
                  item.images?.[0]?.trim()
                    ? item.images[0]
                    : fallbackImage
                }
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}
                className="img-fluid"
                alt="Deal"
                style={{
                  height: "100px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            </Link>
          </div>

          {/* Right Content */}
          <div className="col-8 position-relative">
            {/* Action buttons - top right */}
            <div
              className="position-absolute"
              style={{
                top: "0",
                right: "0",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <Link
                to={`/edit-offer/${item.discountType}/${item._id}`}
                state={item}
                className="btn border rounded-5 btn-sm"
                disabled={isDisabled}
                onClick={(e) => e.stopPropagation()}
              >
                <Edit className="fs-6 text-primary" />
              </Link>
              <Popconfirm
                title="Delete the deal"
                description="Are you sure you want to delete this deal?"
                onConfirm={() => handleDelete(item._id)}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  className="btn border rounded-5 d-flex"
                  icon={<Delete className="fs-6" />}
                  danger
                  disabled={isDisabled}
                  onClick={(e) => e.stopPropagation()}
                  style={{ outline: "none", boxShadow: "none" }}
                />
              </Popconfirm>
            </div>

            {/* Deal Text */}
            <div className="pe-4" style={{ paddingRight: "60px" }}>
              <h6
                className="fw-semibold mb-1"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.title || "No Title"}
              </h6>
              <p style={{ marginTop: "10px" }}>
                <strong>Store: </strong>
                {item.storeInfo?.display_name || "N/A"}
              </p>

              <p className="mb-1 text-muted">
                <strong>
                  {formatValidDateRange(
                    item.dateRange?.startDate,
                    item.dateRange?.endDate
                  )}
                </strong>
              </p>

              <Link
                to={`/view/${item.discountType}/${item._id}`}
                state={item}
                className="text-decoration-underline text-primary fw-semibold"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
