import { useState, useContext, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { Search, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { Toaster, toast } from "react-hot-toast";
import { Card, Button, Spin, message, Popconfirm } from "antd";
import { BusinessContext } from "./businessContext";

const BusinessListing = () => {
  const { businessList, setBusinessList, searchText, setSearchText } =
    useContext(BusinessContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (businessList.length === 0 && searchText.trim()) {
      handleSearch(); // auto-fetch if searchText exists
    }
  }, []);

  const cancel = () => {
    message.error("Cancelled delete");
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    try {
      setLoading(true);
      const url = `http://localhost:4001/business?searchText=${searchText}&page=1&limit=20`;
      const response = await axios.get(url);
      setBusinessList(response.data.data.data);
      toast.success("Business data fetched successfully");
      setSearchText(""); // Clear only after success
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch business data");
    } finally {
      setLoading(false);
    }
  };

  const deleteBusiness = async (_id) => {
    try {
      const url = `http://localhost:4001/business/${_id}`;
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
      <Toaster />
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
            <Link to="/add-new-business" className="theme-btn btn-main">
              Add New Business
            </Link>
          </div>
        </div>

        {/* Search */}
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
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="lists-container">
          <div className="row">
            {businessList.length > 0 ? (
              businessList.map((item) =>{ 
             console.log( item?.photo && item.photo.length > 0 ,item.photo[0]);
               
                return (
                <div
                  className="col-lg-4 col-md-6 col-12 d-flex py-3"
                  key={item._id}
                >
                  <Card
                    hoverable
                    className="w-100 h-100 d-flex align-items-center"
                    style={{ marginBottom: "20px" }}
                  >
                    <div className="row">
                      <div className="col-4">
                        <Link
                          className="text-decoration-none"
                          to={`/view-business/${item._id}`}
                          state={item}
                        >
                          {console.log(item.photo)}
                          {item?.photo && item.photo.length > 0 && (
                            <img
                              alt={item.name}
                              style={{
                                height: "100px",
                                width: "100%",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                              src={item.photo[0]}
                              className="img-fluid"
                            />
                          )}
                        </Link>
                      </div>
                      <div className="col-lg-7 col-5 d-flex flex-column justify-content-between">
                        <div>
                          <h6 className="mb-1">
                            {item.display_name || "No Name"}
                          </h6>
                          <p className="mb-2 text-muted">
                            {item.address || "No Description"}
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-1 col-2 d-flex flex-column align-items-end justify-content-between">
                        <div>
                          <Link
                            to={`/edit-business/${item._id}`}
                            className="btn border rounded-5 btn-sm mb-1"
                          >
                            <Edit className="fs-6 text-primary mb-1" />
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
                              className="btn border rounded-5 d-flex"
                              icon={<Delete className="fs-6" />}
                              danger
                              style={{ outline: "none", boxShadow: "none" }}
                            />
                          </Popconfirm>
                        </div>
                      </div>
                      <div className="col-12 mt-2 text-center">
                        <Link
                          to={`/add-offer/${item._id}`}
                          className="lw-info-coupon-link available"
                        >
                          Create coupon
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              )})
            ) : (
              <div className="col-12 text-center mt-3">
                <p>No Business Found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessListing;
