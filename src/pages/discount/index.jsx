import { useState, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../components/deleteConfirmation";
import axios from "axios";
import { Card, Pagination, Button, Popconfirm, message } from "antd";
import { Edit, Delete } from "@mui/icons-material";

const Discount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getDiscount, setGetDiscount] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12); // Number of items per page
  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const options = { day: "2-digit", month: "long" }; // e.g., 30 April
    return `${date.toLocaleDateString("en-GB", options)} ${timeStr}`;
  };

  // This will hold the current page's coupons to be displayed
  const [paginatedDiscounts, setPaginatedDiscounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:4001/coupons?discountType=Discount";
        const response = await axios.get(url);
        console.log(response.data.data);
        setGetDiscount(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Update paginatedCoupons whenever the data or currentPage changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    setPaginatedDiscounts(getDiscount.slice(startIndex, endIndex));
  }, [currentPage, getDiscount]);

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
      setPaginatedDiscounts(getDiscount.slice(startIndex, endIndex));
      return;
    }

    const searchData = getDiscount.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );

    setPaginatedDiscounts(searchData);
    setCurrentPage(1);
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
                <Link to={"/dashboard"} className="breadcrumb-link">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <span className="breadcrumb-link">Discounts</span>
              </li>
            </ul>
          </div>
        </div>

        {/* List section */}
        <div className="lists-container py-4">
          <div className="row">
            <div className="col-12">
              <div className="lists-wrapper businesslist">
                {/* Search bar */}
                <div className="list-filter d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-semibold">Discount Lists</h5>

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

                {/* Discount Cards */}
                <div className="row">
                  {paginatedDiscounts.length > 0 ? (
                    paginatedDiscounts.map((item) => {
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
                            }}
                          >
                            <div className="row w-100">
                              {/* Image */}
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
                                    alt="Discount"
                                    style={{
                                      height: "100px",
                                      width: "100%",
                                      objectFit: "cover",
                                      borderRadius: "6px",
                                    }}
                                  />
                                </Link>
                              </div>

                              {/* Content */}
                              <div className="col-8 d-flex flex-column justify-content-between position-relative">
                                {/* Edit/Delete Buttons */}
                                <div
                                  className="position-absolute"
                                  style={{
                                    top: 0,
                                    right: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                  }}
                                >
                                  <Link
                                    to={`/edit-offer/${item.discountType}/${item._id}`}
                                    // state={item}
                                    state={{item}}
                                    className="btn border rounded-5 btn-sm"
                                    disabled={isDisabled}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Edit className="fs-6 text-primary" />
                                  </Link>
                                  <Popconfirm
                                    title="Delete the discount"
                                    description="Are you sure to delete this discount?"
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

                                {/* Main Content */}
                                <div className="mt-2">
                                  <h6
                                    className="mb-1 fw-semibold"
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

                                  {/* Validity Line */}
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

                                  {/* View Link */}
                                  <Link
                                    className="text-decoration-underline text-primary fw-semibold"
                                    to={`/view/${item.discountType}/${item._id}`}
                                    state={item}
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
                      <p>No Discounts Found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        itemName="Sample Item"
      />
    </>
  );
};

export default Discount;
