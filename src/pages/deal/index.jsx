import { useState, useEffect, useCallback, useMemo } from "react";
import "./style.css";
import dayjs from "dayjs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Pagination, Button, Popconfirm, message, Spin } from "antd";
import { Edit, Delete } from "@mui/icons-material";
import { debounce } from "lodash";
import fallbackImage from "../../assets/images/landingPage.png";
import axiosInstance from "../../interceptors/axiosInstance";

const Deal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [getDeal, setGetDeal] = useState(location.state?.deals || []);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const hostUrl = import.meta.env.VITE_BASE_URL;

  // Format the valid date range for display
  const formatValidDateRange = (startDateStr, endDateStr) => {
    const start = dayjs(startDateStr).format("D/M/YY");
    const end = dayjs(endDateStr).format("D/M/YY");
    return `Valid: ${start} - ${end}`;
  };

  // Fetch data function
  const fetchData = async (searchText) => {
    try {
      setLoading(true);
      const baseUrl = `${hostUrl}coupons?discountType=Deal`;
      const url = searchText
        ? `${baseUrl}&keyword=${encodeURIComponent(searchText)}`
        : baseUrl;
      const response = await axiosInstance.get(url);
      setGetDeal(response.data.data.couponInfo || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch deals");
    } finally {
      setLoading(false);
    }
  };

  // Only fetch if no data in location.state
  useEffect(() => {
    if (!location.state?.deals) {
      fetchData();
    }
  }, [location.state?.deals]);

  // Debounce the search input to avoid too many API calls
  const debouncedFetchData = useMemo(
    () =>
      debounce((searchText) => {
        setCurrentPage(1);
        fetchData(searchText);
      }, 500),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchData.cancel();
    };
  }, [debouncedFetchData]);

  const handleSearchChange = (e) => {
    debouncedFetchData(e.target.value);
  };

  // Slice deals for current page
  const pagedDeals = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return getDeal.slice(startIdx, startIdx + pageSize);
  }, [currentPage, getDeal]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
  };

  // Delete handler
  const handleDelete = async (_id) => {
    try {
      await axiosInstance.delete(`coupons/${_id}`);
      message.success("Deal deleted successfully");
      fetchData(); // refetch after delete
    } catch (err) {
      console.error("Error deleting deal:", err);
      message.error("Failed to delete deal");
    }
  };

  const cancel = () => {
    message.info("Deletion cancelled");
  };

  return (
    <div className="content-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb-wrapper d-flex flex-column flex-md-row">
        <div className="breadcrumb-block">
          <h2 className="page-heading">Deals</h2>
          <ul className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link to={"/dashboard"} className="breadcrumb-link">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <span className="breadcrumb-link">Deals</span>
            </li>
          </ul>
        </div>
      </div>

      {/* List Section */}
      <div className="lists-container py-4">
        <div className="row">
          <div className="col-12">
            <div className="lists-wrapper businesslist">
              {/* Search bar */}
              <div className="list-filter d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-semibold">Deals List</h5>

                <input
                  className="lfs-input"
                  type="text"
                  placeholder="Search here..."
                  onChange={handleSearchChange}
                  style={{ maxWidth: "300px" }}
                />
              </div>

              {/* Deals Cards */}
              <div className="row">
                {loading ? (
                  <div className="d-flex justify-content-center w-100">
                    <Spin size="large" />
                  </div>
                ) : pagedDeals.length > 0 ? (
                  pagedDeals.map((item) => {
                    const isDisabled = item.active === false;

                    return (
                      <div
                        className="col-lg-4 col-md-6 col-12 d-flex py-3"
                        key={item._id}
                      >
                        <Card
                          hoverable
                          onClick={() =>
                            navigate(`/view/${item.discountType}/${item._id}`, {
                              state: item,
                            })
                          }
                          className="w-100 "
                          style={{
                            marginBottom: "20px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                            borderRadius: "10px",
                            opacity: isDisabled ? 0.6 : 1,
                            cursor: "pointer",
                          }}
                        >
                          <div
                            className="d-flex "
                            
                          >
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
                                onError={(e) => {
                                  e.target.src = fallbackImage;
                                }}
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
                              <p className="mb-1">
                                <strong>Store:</strong>{" "}
                                {item.storeInfo.display_name}
                              </p>
                              <p className="mb-1 text-muted">
                                <strong>
                                  {formatValidDateRange(
                                    item.dateRange?.startDate,
                                    item.dateRange?.endDate
                                  )}
                                </strong>
                              </p>
                              <span className="text-primary fw-semibold text-decoration-none">
                                View
                              </span>
                            </div>

                            {/* Right-top corner: Edit & Delete buttons */}
                            <div
                            className="col-1 "
                              // style={{
                              //   position: "absolute",
                              //   top: 10,
                              //   right: 10,
                              //   display: "flex",
                              //   flexDirection: "column",
                              //   gap: "6px",
                              // }}
                            >
                              <div className="d-flex flex-column ">
                              <Button
                                type="text"
                                className="btn border rounded-5 btn-sm"
                                icon={<Edit className="fs-6 text-primary" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/edit-offer/${item.discountType}/${item._id}`,
                                    {
                                      state: item,
                                    }
                                  );
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
                                  className="btn border rounded-5 d-flex mt-2"
                                  icon={<Delete className="fs-6" />}
                                  danger
                                  onClick={(e) => e.stopPropagation()} // stop bubbling on button click
                                  style={{ outline: "none", boxShadow: "none" }}
                                  disabled={item.active === false}
                                />
                              </Popconfirm>

                              </div>
                              
                            </div>
                          </div>
                        </Card>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center mt-3">
                    <p>No Deals Found</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {getDeal.length > pageSize && (
                <div className="d-flex justify-content-center p-2">
                  <Pagination
                    current={currentPage}
                    total={getDeal.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deal;
