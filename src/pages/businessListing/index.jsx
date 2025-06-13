import { useState, useContext, useEffect } from "react";
import "./style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Edit, Delete } from "@mui/icons-material";
import { Toaster, toast } from "react-hot-toast";
import { Card, Button, Spin, message, Popconfirm, Pagination } from "antd";
import { BusinessContext } from "./businessContext";
import fallbackImage from "../../assets/images/landingPage.png";
import axiosInstance from "../../interceptors/axiosInstance";

const BusinessListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { businessList, setBusinessList, searchText, setSearchText } =
    useContext(BusinessContext);
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const shouldSearch =
      location.state?.updated ||
      (businessList.length === 0 && searchText.trim());

    if (shouldSearch) {
      handleSearch(1);
      if (location.state?.updated) {
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state]);

  const cancel = () => {
    message.error("Cancelled delete");
  };

  const handleSearch = async (page = 1) => {
    if (loading) return;
    try {
      setLoading(true);
      const url = searchText.trim()
        ? `${baseUrl}business?searchText=${searchText}&page=${page}&limit=10`
        : `${baseUrl}business?page=${page}&limit=10`;

      const response = await axiosInstance.get(url);
      const data = response.data.data;

      setBusinessList(data.data);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBusiness = async (_id) => {
    try {
      await axiosInstance.delete(`business/${_id}`);
      setBusinessList((prev) => prev.filter((item) => item._id !== _id));
      toast.success("Business deleted successfully");
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("Failed to delete business");
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="content-wrapper">
        <div className="breadcrumb-wrapper d-flex flex-column flex-md-row">
          <div className="breadcrumb-block">
            <h2 className="page-heading">Business Listings</h2>
            <ul className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link to="/dashboard" className="breadcrumb-link">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <span className="breadcrumb-link">Business Listings</span>
              </li>
            </ul>
          </div>
          <div className="buttons-block d-flex">
            <Link
              to="/add-new-business"
              className="theme-btn btn-main"
              onClick={() => setSidebarTab("business-listings")}
            >
              Add New Business
            </Link>
          </div>
        </div>

        <div className="lists-container py-4">
          <div className="row">
            <div className="col-12">
              <div className="lists-wrapper businesslist">
                <div className="lw-top d-flex flex-column flex-md-row">
                  <div className="list-head py-lg-0 py-3">
                    <h3>Shops</h3>
                  </div>
                  <div className="list-filter">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                      }}
                    >
                      <div className="lf-search">
                        <input
                          className="lfs-input"
                          type="text"
                          placeholder="Search here..."
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                        <div className="search-icon-container">
                          <div onClick={handleSearch}>
                            <Search className="lf-searchicon" />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="row mt-4">
                  {loading ? (
                    <div className="col-12 text-center">
                      <Spin size="large" />
                    </div>
                  ) : businessList.length > 0 ? (
                    businessList.map((item) => (
                      <div
                        className="col-lg-4 col-md-6 col-12 d-flex py-3"
                        key={item._id}
                      >
                        <Card
                          hoverable
                          className="w-100 h-100 position-relative"
                          style={{ marginBottom: "20px" }}
                        >
                          <div
                            className="card-click-wrapper"
                            onClick={(e) => {
                              if (!e.target.closest(".no-click")) {
                                navigate(`/view-business/${item._id}`, {
                                  state: item,
                                });
                              }
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                                zIndex: 2,
                              }}
                            >
                              <Link
                                to={`/edit-business/${item._id}`}
                                state={{ item }}
                                onClick={(e) => e.stopPropagation()}
                                className="btn btn-sm p-1 no-click"
                                style={{
                                  border: "1px solid #d9d9d9",
                                  borderRadius: "50%",
                                  width: "28px",
                                  height: "28px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Edit className="fs-6 text-primary" />
                              </Link>
                              <Popconfirm
                                title="Delete the task"
                                description="Are you sure to delete this task?"
                                onConfirm={(e) => {
                                  e.stopPropagation();
                                  deleteBusiness(item._id);
                                }}
                                onCancel={(e) => {
                                  e.stopPropagation();
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
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    outline: "none",
                                    boxShadow: "none",
                                  }}
                                />
                              </Popconfirm>
                            </div>

                            {/* ✅ Image and content aligned properly */}
                            <div className="row w-100">
                              <div className="col-5" style={{ height: "150px" }}>
                                <img
                                  alt={item.name || "Business"}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    objectPosition: "center",
                                    borderRadius: "6px",
                                    backgroundColor: "#f5f5f5",
                                  }}
                                  src={
                                    Array.isArray(item?.photo) &&
                                    item.photo.length > 0 &&
                                    item.photo[0]?.trim()
                                      ? item.photo[0]
                                      : fallbackImage
                                  }
                                  onError={(e) => {
                                    e.target.src = fallbackImage;
                                  }}
                                  className="img-fluid"
                                />
                              </div>

                              <div className="col-7 ps-3 d-flex flex-column justify-content-between">
                                <div>
                                  <h6 className="mb-1">
                                    {item.display_name || "No Name"}
                                  </h6>
                                  <p className="mb-2 text-muted">
                                    {item.address || "No Address"}
                                  </p>
                                  <Link
                                    to={`/add-offer/${item._id}`}
                                    className="lw-info-coupon-link available no-click"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Create coupon
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center mt-3">
                      <p>No Business Found</p>
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination
                      current={currentPage}
                      total={totalPages * 10}
                      pageSize={10}
                      onChange={(page) => {
                        setCurrentPage(page);
                        handleSearch(page);
                      }}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessListing;
