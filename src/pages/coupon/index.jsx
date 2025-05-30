import { useState, useEffect, useMemo } from "react";
import "./style.css";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { Card, Pagination, Button, Popconfirm, message, Spin } from "antd";
import { Edit, Delete } from "@mui/icons-material";
import { debounce } from "lodash";
import fallbackImage from "../../assets/images/landingPage.png";
import axiosInstance from "../../interceptors/axiosInstance";

const Coupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 9;
  const hostUrl = import.meta.env.VITE_BASE_URL;

  const formatValidDateRange = (start, end) =>
    `Valid: ${dayjs(start).format("D/M/YY")} - ${dayjs(end).format("D/M/YY")}`;

  const fetchCoupons = async (page = 1, keyword = "") => {
    try {
      setLoading(true);
      const url = `${hostUrl}coupons?discountType=Coupon&page=${page}&limit=${pageSize}${
        keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""
      }`;

      const response = await axiosInstance.get(url);
      const data = response.data.data;

      setCoupons(data.couponInfo || []);
      setTotalCount(data.pagination?.totalCount || 0);
      setCurrentPage(data.pagination?.page || page);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      message.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(currentPage, searchText);
  }, []);

  const debouncedFetch = useMemo(
    () =>
      debounce((value) => {
        fetchCoupons(1, value);
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setCurrentPage(1); // Reset to page 1 on search
    debouncedFetch(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCoupons(page, searchText);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (_id) => {
    try {
      await axiosInstance.delete(`coupons/${_id}`);
      message.success("Coupon deleted successfully");
      fetchCoupons(currentPage, searchText);
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Failed to delete coupon");
    }
  };

  const cancel = () => message.info("Deletion cancelled");

  return (
    <div className="content-wrapper">
      <div className="breadcrumb-wrapper d-flex flex-column flex-md-row">
        <div className="breadcrumb-block">
          <h2 className="page-heading">Coupons</h2>
          <ul className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link to={"/dashboard"} className="breadcrumb-link">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <span className="breadcrumb-link">Coupons</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="lists-container py-4">
        <div className="row">
          <div className="col-12">
            <div className="lists-wrapper businesslist">
              <div className="list-filter d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-semibold">Coupons List</h5>
                <input
                  className="lfs-input"
                  type="text"
                  placeholder="Search here..."
                  value={searchText}
                  onChange={handleSearchChange}
                  style={{ maxWidth: "300px" }}
                />
              </div>

              <div className="row">
                {loading ? (
                  <div className="d-flex justify-content-center w-100">
                    <Spin size="large" />
                  </div>
                ) : coupons.length > 0 ? (
                  coupons.map((item) => {
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
                            marginBottom: "20px",
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
                                onError={(e) => {
                                  e.target.src = fallbackImage;
                                }}
                                className="img-fluid"
                                alt="Coupon"
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
                              <p className="mb-1"><strong>Store:</strong> {item.storeInfo.display_name}</p>
                              <p className="mb-1 text-muted">
                                <strong>
                                  {formatValidDateRange(item.dateRange?.startDate, item.dateRange?.endDate)}
                                </strong>
                              </p>
                              <span className="text-primary fw-semibold text-decoration-none">View</span>
                            </div>

                            <div className="col-1">
                              <div className="d-flex flex-column">
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
                                  title="Delete the coupon"
                                  description="Are you sure to delete this coupon?"
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
                    <p>No Coupons Found</p>
                  </div>
                )}
              </div>

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

export default Coupons;
