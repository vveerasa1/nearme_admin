import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import "./style.css";
import {Spin} from "antd";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../../interceptors/axiosInstance';
import axios from "axios";
import { Card, Pagination, Button, Popconfirm, message } from "antd";
import { Edit, Delete } from "@mui/icons-material";
import { debounce } from "lodash";
import fallbackImage from "../../assets/images/landingPage.png";

const Discount = () => {
  const navigate = useNavigate();
  const [getDiscount, setGetDiscount] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [loading,setLoading] = useState(false);

  const hostUrl = import.meta.env.VITE_BASE_URL;

  // Fetch data function
  const fetchData = async (searchText) => {
    try {
      setLoading(true);
      const baseUrl = `${hostUrl}coupons?discountType=Discount`;
      const url = searchText
        ? `${baseUrl}&keyword=${encodeURIComponent(searchText)}`
        : baseUrl;
      const response = await axiosInstance.get(url);
      setGetDiscount(response.data.data.couponInfo || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load discounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Debounced search fetch
  const debouncedFetchData = debounce((searchText) => {
    setCurrentPage(1);
    fetchData(searchText);
  }, 500);

  useEffect(() => {
    // Cleanup debounce on unmount
    return () => {
      debouncedFetchData.cancel();
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedFetchData(value);
  };

  // Pagination: slice the data for current page
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDiscounts = getDiscount.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (_id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`${hostUrl}coupons/${_id}`);
      message.success("Deleted successfully");
      fetchData();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      message.error("Delete failed");
    }
  };

  const cancel = (e) => {
    e.stopPropagation();
    message.info("Delete cancelled");
  };

  const formatValidDateRange = (startDateStr, endDateStr) => {
    const start = dayjs(startDateStr).format('D/M/YY');
    const end = dayjs(endDateStr).format('D/M/YY');
    return `Valid: ${start} - ${end}`;
  };

  return (
    <>
      <div className="content-wrapper">
        {/* Breadcrumb */}
        <div className="breadcrumb-wrapper d-flex flex-column flex-md-row">
          <div className="breadcrumb-block">
            <h2 className="page-heading">Discounts</h2>
            <ul className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link to={"/dashboard"} className="breadcrumb-link">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <span className="breadcrumb-link">Discounts</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Search Bar */}
        <div className="list-filter d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-semibold">Discount Lists</h5>
          <form>
            <div className="lf-search">
              <input
                className="lfs-input"
                type="text"
                placeholder="Search here..."
                onChange={handleSearchChange} // pass event here, not just value
              />
              <div className="search-icon-container">
                <div type="button"></div>
              </div>
            </div>
          </form>
        </div>

        {/* Discount Cards */}
        <div className="row">
          {loading ? (
            <Spin />
          ) : paginatedDiscounts.length > 0 ? (
            paginatedDiscounts.map((item) => {
              const isDisabled = item.active === false;
              return (
                <div className="col-lg-4 col-md-6 col-12 d-flex py-3" key={item._id}>
                  <Card
                    hoverable
                    onClick={() =>
                      navigate(`/view/${item.discountType}/${item._id}`, { state: item })
                    }
                    className="w-100"
                    style={{
                      marginBottom: "20px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                      borderRadius: "10px",
                      opacity: isDisabled ? 0.6 : 1,
                      cursor: "pointer",
                    }}
                  >
                    <div className="d-flex w-100 align-items-start" style={{ position: 'relative' }}>
                      {/* Left: Image */}
                      <div style={{ width: "100px", flexShrink: 0 }}>
                        <img
                          src={
                            Array.isArray(item?.images) &&
                            item.images.length > 0 &&
                            item.images[0]?.trim()
                              ? item.images[0]
                              : fallbackImage
                          }
                          onError={(e) => { e.target.src = fallbackImage; }}
                          className="img-fluid"
                          alt="Discount"
                          style={{
                            height: "100px",
                            width: "100px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      </div>

                      {/* Right: Text Content */}
                      <div className="ms-3 flex-grow-1">
                        <h6
                          className="mb-2 fw-semibold"
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
                        <p className="mb-1"><strong>Store:</strong> {item.storeInfo.display_name}</p>
                        <p className="mb-1 text-muted">
                          <strong>
                            {formatValidDateRange(item.dateRange?.startDate, item.dateRange?.endDate)}
                          </strong>
                        </p>
                        <span className="text-primary fw-semibold text-decoration-none">View</span>
                      </div>

                      {/* Right-top corner: Edit & Delete buttons */}
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <Button
                          type="text"
                          className="btn border rounded-5 btn-sm"
                          icon={<Edit className="fs-6 text-primary" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-offer/${item.discountType}/${item._id}`, {
                              state: item,
                            });
                          }}
                          disabled={isDisabled}
                        />


<Popconfirm
  title="Delete the discount"
  description="Are you sure to delete this discount?"
  onConfirm={(e) => {
    e?.stopPropagation?.(); // stop bubbling on confirm
    handleDelete(item._id);
  }}
  onCancel={(e) => {
    e?.stopPropagation?.(); // stop bubbling on cancel
    cancel(e);
  }}
  okText="Yes"
  cancelText="No"
>
  <Button
    type="text"
    className="btn border rounded-5 d-flex"
    icon={<Delete className="fs-6" />}
    danger
    onClick={(e) => e.stopPropagation()} // stop bubbling on button click
    style={{ outline: "none", boxShadow: "none" }}
    disabled={item.active === false}
  />
</Popconfirm>

                      </div>
                    </div>
                  </Card>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center mt-3">
              <p>No Discounts Found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center p-2">
          {getDiscount.length > pageSize && (
            <Pagination
              current={currentPage}
              total={getDiscount.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Discount;
