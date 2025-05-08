import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { LocationPin } from "@mui/icons-material";
import axios from "axios";

const ViewBusinessData = () => {
  const { _id } = useParams();
  const { state: data } = useLocation();

  useEffect(() => {
    const fetchBusinessStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/business/${_id}`
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching coupon status:", error);
      }
    };

    fetchBusinessStatus();
  }, [data, _id]);

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;
    const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <span key={`full-${i}`} style={{ color: "#FFD700" }}>
          ★
        </span>
      );
    }

    if (halfStar) {
      stars.push(
        <span key="half" style={{ color: "#FFD700" }}>
          ☆
        </span>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} style={{ color: "#ccc" }}>
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div>
      <div className="container-fluid  py-2 px-3">
        <div className="d-flex justify-content-between">
          <div className="">
            <h2>{data ? data.display_name : "Loading..."}</h2>
          </div>

          <div className="text-center">
            <a
              href={data.reviews_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LocationPin className="fs-1 text-primary mb- " />
            </a>
            <div className="">
              <p>
                {" "}
                <p className="">View Location</p>
              </p>
            </div>
          </div>
        </div>
        <div className="offer-data container">
          <div className="row border d-flex p-5 ">
            <div className="col-lg-4">
              <div className="slider-container">
                {data && Array.isArray(data.photo) && data.photo.length > 0 ? (
                  <div
                    id="carouselExampleIndicators"
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-indicators ">
                      {data.photo.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          data-bs-target="#carouselExampleIndicators"
                          data-bs-slide-to={index}
                          className={index === 0 ? "active" : ""}
                          aria-current={index === 0 ? "true" : undefined}
                          aria-label={`Slide ${index + 1}`}
                        ></button>
                      ))}
                    </div>
                    <div className="carousel-inner">
                      {console.log(data.photo)}

                      {data.photo.map((img, index) => (
                        <div
                          key={index}
                          className={`carousel-item ${
                            index === 0 ? "active" : ""
                          }`}
                        >
                          <img
                            src={img}
                            className="img-fluid"
                            alt={`Slide ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
            <div className="col-4 mt-lg-0 mt-4 mx-5">
              <div>
                {" "}
                <h4>{data.display_name}</h4>
              </div>
              <div className="d-flex align-items-center ">
                <p className="">
                  {data.rating}
                  {renderStars(data.rating)}({data.reviews})
                </p>
              </div>

              <div>
                <b>Address</b>

                <p>{data.address}</p>
              </div>
              <div className="">
                <b>Contact</b>
                <p>{data.phone}</p>
                <p>{data.email_1}</p>
              </div>
            </div>

            <div className="col text-center">
              <div className="border shadow text-center rounded-5 p-2">
                <b>Working Hours</b>
                {(() => {
                  let workingHours = null;

                  try {
                    workingHours =
                      typeof data.working_hours === "string"
                        ? JSON.parse(data.working_hours.replace(/'/g, '"'))
                        : data.working_hours;
                  } catch (error) {
                    console.error("Invalid JSON in working_hours:", error);
                  }

                  return workingHours ? (
                    <div className="mt-2">
                      {Object.entries(workingHours).map(([day, hours]) => (
                        <div
                          className="d-flex justify-content-between px-3 py-1 border-bottom"
                          key={day}
                        >
                          <strong>{day}</strong>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No working hours available</p>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBusinessData;
