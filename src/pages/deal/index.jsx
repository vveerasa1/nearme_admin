import { useState, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../components/deleteConfirmation";
import axios from "axios";
import { Card, Pagination, Button, Popconfirm, message } from "antd";
import { Edit, Delete } from "@mui/icons-material";

const Deal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getDeal, setGetDeal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12); // Number of items per page
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const options = { day: "2-digit", month: "long" }; // e.g., 30 April
    return `${date.toLocaleDateString("en-GB", options)} ${timeStr}`;
  };

  // This will hold the current page's coupons to be displayed
  const [paginatedDeals, setPaginatedDeals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:4001/coupons?discountType=Deal";
        const response = await axios.get(url);
        setGetDeal(response.data.data); // either [] or real data
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setGetDeal([]); // explicitly set empty to trigger "No deals" UI
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  // Update paginatedCoupons whenever the data or currentPage changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    setPaginatedDeals(getDeal.slice(startIndex, endIndex));
  }, [currentPage, getDeal]);

  const handleConfirmDelete = () => {
    console.log("Item deleted");
    setIsModalOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4001/coupons/${_id}`
      );
      console.log(response);
    } catch (err) {
      console.log("Error", err);
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  const handleSearchText = (searchText) => {
    if (!searchText) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = currentPage * pageSize;
      setPaginatedDeals(getDeal.slice(startIndex, endIndex));
      return;
    }

    const searchData = getDeal.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );

    setPaginatedDeals(searchData);
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <>
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

                  <form>
                    <div className="lf-search">
                      <input
                        className="lfs-input"
                        type="text"
                        placeholder="Search here..."
                        onChange={(e) => handleSearchText(e.target.value)}
                      />
                      <div className="search-icon-container">
                        <div type="button"></div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Deals Cards */}
                <div className="row">
                  {paginatedDeals.length > 0 ? (
                    paginatedDeals.map((item) => {
                      const isDisabled = item.active === false;

                      return (
                        <div
                          className="col-lg-4 col-md-6 col-12 d-flex py-3"
                          key={item._id}
                        >
                          <Card
                            hoverable
                            className="w-100 h-100 position-relative"
                            style={{
                              marginBottom: "20px",
                              opacity: isDisabled ? 0.6 : 1,
                              borderRadius: "10px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                            }}
                          >
                            <div className="row w-100">
                              {/* Left Image */}
                              <div className="col-4">
                                <Link
                                  to={`/view/${item.discountType}/${item._id}`}
                                  state={item}
                                  className="text-decoration-none"
                                >
                                  <img
                                    src={
                                      item.images?.[0]?.trim()
                                        ? item.images[0]
                                        : fallbackImage
                                    }
                                    onError={(e) => {
                                      e.target.src = fallbackImage;
                                    }}
                                    className="img-fluid"
                                    alt="Deal"
                                    style={{
                                      height: "100px",
                                      width: "100%",
                                      objectFit: "cover",
                                      borderRadius: "6px",
                                    }}
                                  />
                                </Link>
                              </div>

                              {/* Right Content */}
                              <div className="col-8 position-relative">
                                {/* Action buttons - top right */}
                                <div
                                  className="position-absolute"
                                  style={{
                                    top: "0",
                                    right: "0",
                                    zIndex: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                  }}
                                >
                                  <Link
                                    to={`/edit-offer/${item.discountType}/${item._id}`}
                                    state={item}
                                    className="btn border rounded-5 btn-sm"
                                    disabled={isDisabled}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Edit className="fs-6 text-primary" />
                                  </Link>
                                  <Popconfirm
                                    title="Delete the deal"
                                    description="Are you sure to delete this deal?"
                                    onConfirm={() => handleDelete(item._id)}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                  >
                                    <Button
                                      type="text"
                                      className="btn border rounded-5 d-flex"
                                      icon={<Delete className="fs-6" />}
                                      danger
                                      style={{
                                        outline: "none",
                                        boxShadow: "none",
                                      }}
                                      disabled={isDisabled}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </Popconfirm>
                                </div>

                                {/* Deal Text */}
                                <div
                                  className="pe-4" // padding end to avoid overlapping with buttons
                                  style={{ paddingRight: "60px" }}
                                >
                                  <h6
                                    className="fw-semibold mb-1"
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

                                  <p className="mb-1 text-muted">
                                    <strong>Valid:</strong>{" "}
                                    {formatDateTime(
                                      item.dateRange?.startDate,
                                      item.activeTime?.startTime
                                    )}{" "}
                                    -{" "}
                                    {formatDateTime(
                                      item.dateRange?.endDate,
                                      item.activeTime?.endTime
                                    )}
                                  </p>

                                  <Link
                                    to={`/view/${item.discountType}/${item._id}`}
                                    state={item}
                                    className="text-decoration-underline text-primary fw-semibold"
                                  >
                                    View
                                  </Link>
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
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center p-2">
          {paginatedDeals.length > pageSize && (
            <Pagination
              current={currentPage}
              total={paginatedDeals.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        itemName="Sample Deal"
      />
    </>
  );
};

export default Deal;
