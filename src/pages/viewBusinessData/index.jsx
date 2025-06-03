import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosInstance from '../../interceptors/axiosInstance';

const ViewBusinessData = () => {
  const { _id } = useParams();
  const { state: initialData } = useLocation();

  const [businessData, setBusinessData] = useState(initialData || null);
  const [selectedImage, setSelectedImage] = useState(initialData?.photo?.[0]);

  useEffect(() => {
    const fetchBusinessStatus = async () => {
      try {
        const response = await axiosInstance.get(`business/${_id}`);
        if (response?.data?.data) {
          setBusinessData(response.data.data);
          setSelectedImage(response.data.data.photo?.[0]);
        }
      } catch (error) {
        console.error("Error fetching business:", error);
      }
    };
    fetchBusinessStatus();
  }, [_id]);

  const data = businessData || initialData;

  const workingHours = (() => {
    try {
      if (typeof data?.working_hours === "string") {
        return JSON.parse(data.working_hours.replace(/'/g, '"'));
      }
      return data?.working_hours;
    } catch (e) {
      console.error("Invalid working_hours format", e);
      return null;
    }
  })();

  const renderStars = (rating) => {
    const total = 5;
    const parsedRating = Number(rating);
    if (isNaN(parsedRating)) return <span>Not rated</span>;

    const safeRating = Math.min(Math.max(parsedRating, 0), total);
    const full = Math.floor(safeRating);
    const half = safeRating - full >= 0.5;
    const empty = total - full - (half ? 1 : 0);

    return (
      <>
        {[...Array(full)].map((_, i) => (
          <span key={`f-${i}`} style={{ color: "#FFD700" }}>★</span>
        ))}
        {half && <span style={{ color: "#FFD700" }}>☆</span>}
        {[...Array(empty)].map((_, i) => (
          <span key={`e-${i}`} style={{ color: "#ccc" }}>★</span>
        ))}
      </>
    );
  };

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="container my-4">
      <div className="mb-3">
        <h4>
          {data.display_name}{" "}
          <small className="text-muted">{data.category}</small>
        </h4>
        <small className="text-muted">
          Home / Business Listing / {data.display_name}
        </small>
      </div>

      <div className="card shadow-lg p-4 rounded-4 elevation-3">
        <div className="row">
          {/* Images */}
          <div className="col-md-4 mb-3">
            {data?.photo?.length > 0 ? (
              <>
                <img
                  src={selectedImage}
                  className="img-fluid rounded mb-2"
                  alt="Main"
                  style={{
                    height: "400px",
                    objectFit: "cover",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                />
                <div className="d-flex gap-2 overflow-auto">
                  {data.photo.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`thumb-${idx}`}
                      onClick={() => handleImageClick(img)}
                      style={{
                        height: "80px",
                        width: "80px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p>No images available</p>
            )}
          </div>

          {/* Business Info */}
          <div className="col-md-6 mb-3">
            <h5>{data.display_name}</h5>
            <div className="d-flex align-items-center mb-2">
              <span className="me-2">{data.rating}</span>
              {renderStars(data.rating)}
              <span className="ms-2">({data.reviews})</span>
            </div>

            <div className="mb-2">
              <strong>Address</strong>
              <p className="mb-1">{data.address}</p>
            </div>

            <div className="mb-2">
              <strong>Contact</strong>
              <p className="mb-1">{data.phone}</p>
              {data.email_1 && <p className="mb-1">{data.email_1}</p>}
            </div>

            <div className="mt-3">
              <strong>Working Hours</strong>
              {workingHours ? (
                Object.entries(workingHours).map(([day, hrs]) => (
                  <div className="mb-2" key={day}>
                    <div className="d-flex justify-content-start align-items-center">
                      <span className="fw-bold me-2">{day}:</span>
                      <span>{hrs}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No working hours available</p>
              )}
            </div>

            <div className="col-12 ">
              <div><strong>Location</strong></div>
              <div className="py-3">
                <iframe
                  width="100%"
                  height="350"
                  style={{
                    borderRadius: "12px",
                    border: 0,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    data.address
                  )}&output=embed`}
                  allowFullScreen
                  loading="lazy"
                  title="Business Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBusinessData;
