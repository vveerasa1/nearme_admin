import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Switch } from "antd";
import axios from "axios";
import Slider from "react-slick";

const ViewData = () => {
  const [active, setActive] = useState(false);
  const { _id } = useParams();
  const { state: data } = useLocation();
  console.log(data);
  useEffect(() => {
    const fetchCouponStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/coupons/${_id}`
        );
        setActive(response.data.active);
      } catch (error) {
        console.error("Error fetching coupon status:", error);
      }
    };

    if (data && data._id === _id) {
      setActive(data.active);
    } else {
      fetchCouponStatus();
    }
  }, [data, _id]);

  const onChange = async (checked) => {
    try {
      const response = await axios.patch(
        `http://localhost:4001/coupons/${_id}/status`,
        { active: checked }
      );
      console.log("Status updated:", response.data);
      setActive(checked);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <div className="container-fluid mt-3">
        <h2>{data ? data.title : "Loading..."}</h2>
        <div className="offer-data container">
          <div className="row border d-flex p-5">
            <div className="col-lg-4">
              <div className="slider-container">
                {data &&
                Array.isArray(data.images) &&
                data.images.length > 0 ? (
                  <div
                    id="carouselExampleIndicators"
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-indicators ">
                      {data.images.map((_, index) => (
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
                      {console.log(data.images)}

                      {data.images.map((img, index) => (
                        <div
                          key={index}
                          className={`carousel-item ${
                            index === 0 ? "active" : ""
                          }`}
                        >
                          <img
                            src={img}
                            className="img-fluid "
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

              <div className="mt-5 d-flex gap-2">
                <Switch checked={active} onChange={onChange} />
                <p className="m-0">
                  {active ? "Disable Coupon" : "Enable Coupon"}
                </p>
              </div>
            </div>
            <div className="col mt-lg-0 mt-4">
              <div>{/* <h4>{data.title}</h4> */}</div>
              <div>
                <p>{data.description}</p>
              </div>
              <div>
                <p>
                  <b>Date:</b> {formatDate(data.dateRange.startDate)} -{" "}
                  {formatDate(data.dateRange.endDate)}
                </p>
                <p>
                  <b>Discount Type:</b> {data.discountType}
                </p>
                <div>
                  <h5>Active Time</h5>
                  {data.activeTime &&
                  data.activeTime.startTime &&
                  data.activeTime.endTime ? (
                    <p className="d-flex">
                      <b>Time: </b> &nbsp; {data.activeTime.startTime} -{" "}
                      {data.activeTime.endTime}
                    </p>
                  ) : (
                    <p>No Active Time Available</p>
                  )}

                  <h5>Custom Days</h5>
                  {Array.isArray(data.customDays) &&
                  data.customDays.length > 0 ? (
                    data.customDays.map((dayItem) => (
                      <p key={dayItem._id}>
                        <b>{dayItem.day}:</b> {dayItem.startTime} -{" "}
                        {dayItem.endTime}
                      </p>
                    ))
                  ) : (
                    <p>No Custom Days Available</p>
                  )}
                </div>
              </div>
            </div>                                                                                  
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewData;
