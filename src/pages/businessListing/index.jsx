import { useState, useContext, useEffect } from "react";
import "./style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { Toaster, toast } from "react-hot-toast";
import { Card, Button, Spin, message, Popconfirm } from "antd";
import { BusinessContext } from "./businessContext";
import fallbackImage from "../../assets/images/landingPage.png";

const BusinessListing = () => {
  const location = useLocation();
const navigate = useNavigate();
  const { businessList, setBusinessList, searchText, setSearchText } =
    useContext(BusinessContext);
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const shouldSearch =
      location.state?.updated || (businessList.length === 0 && searchText.trim());
  
    if (shouldSearch) {
      handleSearch(); // Fetch updated data
  
      if (location.state?.updated) {
        navigate(location.pathname, { replace: true, state: {} }); // Clear the state after fetching
      }
    }
  }, [location.state]);

  useEffect(() => {
    handleSearch();
  }, []);
  

  const cancel = () => {
    message.error("Cancelled delete");
  };

  // const handleSearch = async () => {
  //   if (!searchText.trim()) return;
  //   console.log("hello", baseUrl);
  //   try {
  //     setLoading(true);
  //     const url = `${baseUrl}business?searchText=${searchText}&page=1&limit=20`;
  //     const response = await axios.get(url);
  //     setBusinessList(response.data.data.data);
  //     toast.success("Business data fetched successfully");
  //     setSearchText("");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     toast.error("Failed to fetch business data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSearch = async () => {
    // Prevent multiple calls if already loading
    if (loading) return;
  
    try {
      setLoading(true);
  
      // Construct the URL based on whether searchText is provided
      const url = searchText.trim()
        ? `${baseUrl}business?searchText=${searchText}&page=1&limit=20`
        : `${baseUrl}business?page=1&limit=20`; // Fetch all if no searchText
  
      // Fetch data from the server
      const response = await axios.get(url);
  
      // Update the business list with the latest data
      setBusinessList(response.data.data.data);
  
      // Show appropriate toast messages
      // if (searchText.trim()) {
      //   toast.success("Filtered businesses fetched");
      // } else if (location.state?.updated) {
      //   toast.success("Business updated");
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
  
      // Show error toast message
      // toast.error(error.response?.data?.message || "Failed to fetch business data");
    } finally {
      // Ensure loading state is reset
      setLoading(false);
    }
  };
  

  const deleteBusiness = async (_id) => {
    try {
      const url = `${baseUrl}business/${_id}`;
      await axios.delete(url);
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
      <div className="content-wrapper ">
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

        {/* Search */}
        <div className="lists-container py-4">
          <div className="row">
            <div className="col-12">
              <div className="lists-wrapper businesslist">
                {/* Header + Search */}
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
                          {loading ? (
                            <Spin
                              indicator={<LoadingOutlined spin />}
                              className="search-spinner"
                            />
                          ) : (
                            <div onClick={handleSearch}>
                              <Search className="lf-searchicon" />
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Listings */}
                <div className="row mt-4">
                  {loading ? (
    <div className="col-12 text-center">
      <Spin size="large" />
    </div>
  ) : businessList.length > 0 ? (
                    businessList.map(
                      (item) => (
                        console.log("", item?.photo),
                        (
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
                                  className="btn btn-sm p-1"
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
                                  title="Delete Business"
                                  description="Are you sure to delete this data?"
                                  onConfirm={() => deleteBusiness(item._id)}
                                  onCancel={cancel}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button
                                    type="text"
                                    danger
                                    icon={<Delete className="fs-6" />}
                                    style={{
                                      border: "1px solid #d9d9d9",
                                      borderRadius: "50%",
                                      width: "28px",
                                      height: "28px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: 0,
                                      boxShadow: "none",
                                      background: "white",
                                    }}
                                  />
                                </Popconfirm>
                              </div>

                              <div className="row w-100">
                                {/* Image Column */}
                                <div className="col-4">
                                  <Link
                                    className="text-decoration-none"
                                    to={`/view-business/${item._id}`}
                                    state={item}
                                  >
                                    <img
                                      alt={item.name || "Business"}
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: "cover",
                                        borderRadius: "6px",
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
                                  </Link>
                                </div>

                                {/* Content Column */}
                                <div className="col-lg-7 col-5 d-flex flex-column justify-content-between">
                                  <div className="">
                                    <h6
                                      className="mb-1"
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {item.display_name || "No Name"}
                                    </h6>
                                    <p
                                      className="mb-2 text-muted"
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {item.address || "No Address"}
                                    </p>
                                    <Link
                                      to={`/add-offer/${item._id}`}
                                      className="lw-info-coupon-link available"
                                    >
                                      Create coupon
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        )
                      )
                    )
                  ) : (
                    <div className="col-12 text-center mt-3">
                      <p>No Business Found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessListing;
