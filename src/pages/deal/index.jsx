import { useState, useEffect, useCallback, useMemo } from "react";
import "./style.css";
import dayjs from "dayjs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, Pagination, Button, Popconfirm, message, Spin } from "antd";
import { Edit, Delete } from "@mui/icons-material";
import { debounce } from "lodash";
import fallbackImage from "../../assets/images/landingPage.png";
import axiosInstance from "../../interceptors/axiosInstance";

const Deals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [getDeals, setGetDeals] = useState(location.state?.deals || []);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 9;
  const hostUrl = import.meta.env.VITE_BASE_URL;

  const formatValidDateRange = (startDateStr, endDateStr) => {
    const start = dayjs(startDateStr).format("D/M/YY");
    const end = dayjs(endDateStr).format("D/M/YY");
    return `Valid: ${start} - ${end}`;
  };

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      if (searchText.trim()) {
        const url = `${hostUrl}coupons?discountType=Deal&keyword=${encodeURIComponent(searchText)}&page=${page}&limit=${pageSize}`;
        const response = await axiosInstance.get(url);
        setGetDeals(response.data.data.couponInfo || []);
        setTotalCount(response.data.data.pagination?.totalCount || 0);
        setCurrentPage(response.data.data.pagination?.page || 1);
      } else {
        const url = `${hostUrl}coupons?discountType=Deal`;
        const response = await axiosInstance.get(url);
        setGetDeals(response.data.data.couponInfo || []);
        setTotalCount(0);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      message.error("Failed to fetch deals");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!location.state?.deals) {
      if (searchText.trim()) {
        debouncedFetchData(searchText);
      } else {
        fetchData(); // Call non-paginated API when search is cleared
      }
    }
  }, [searchText]);
  

  const debouncedFetchData = useMemo(
    () =>
      debounce((value) => {
        fetchData(1);
      }, 500),
    [searchText]
  );

  useEffect(() => {
    return () => {
      debouncedFetchData.cancel();
    };
  }, [debouncedFetchData]);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedFetchData.cancel(); // cancel previous calls
    setSearchText(value);
    debouncedFetchData(value);
  };
  

  const pagedDeals = useMemo(() => {
    if (searchText.trim()) return getDeals;
    const startIdx = (currentPage - 1) * pageSize;
    return getDeals.slice(startIdx, startIdx + pageSize);
  }, [currentPage, getDeals, searchText]);

  const handlePageChange = (page) => {
    if (searchText.trim()) {
      fetchData(page);
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (_id) => {
    try {
      await axiosInstance.delete(`coupons/${_id}`);
      message.success("Deal deleted successfully");
      fetchData(currentPage);
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

      <div className="lists-container py-4">
        <div className="row">
          <div className="col-12">
            <div className="lists-wrapper businesslist">
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

              <div className="row">
                {loading ? (
                  <div className="d-flex justify-content-center w-100">
                    <Spin size="large" />
                  </div>
                ) : pagedDeals.length > 0 ? (
                  pagedDeals.map((item) => {
                    const isDisabled = item.active === false;

                    return (
                      <div className="col-lg-4 col-md-6 col-12 d-flex py-3" key={item._id}>
                        <Card
                          hoverable
                          onClick={() =>
                            navigate(`/view/${item.discountType}/${item._id}`, {
                              state: item,
                            })
                          }
                          className="w-100"
                          style={{
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                            borderRadius: "10px",
                            opacity: isDisabled ? 0.6 : 1,
                            cursor: "pointer",
                          }}
                        >
                          <div className="d-flex">
                            <div style={{ width: "100px", flexShrink: 0 }}>
                              <img
                                src={
                                  Array.isArray(item?.images) &&
                                  item.images.length > 0 &&
                                  item.images[0]?.trim()
                                    ? item.images[0]
                                    : fallbackImage
                                }
                                onError={(e) => (e.target.src = fallbackImage)}
                                className="img-fluid"
                                alt="Deal"
                                style={{
                                  height: "100px",
                                  width: "100px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                            </div>
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
                                <strong>Store:</strong> {item.storeInfo.display_name}
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

                            <div className="col-1">
                              <div className="d-flex flex-column">
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
                                  title="Delete the deal"
                                  description="Are you sure to delete this deal?"
                                  onConfirm={(e) => {
                                    e?.stopPropagation?.();
                                    handleDelete(item._id);
                                  }}
                                  onCancel={(e) => {
                                    e?.stopPropagation?.();
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
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ outline: "none", boxShadow: "none" }}
                                    disabled={isDisabled}
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

              {/* Pagination only on search */}
              {totalCount > pageSize && (
                <div className="d-flex justify-content-center p-2">
                  <Pagination
                    current={currentPage}
                    total={totalCount}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
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

export default Deals;
