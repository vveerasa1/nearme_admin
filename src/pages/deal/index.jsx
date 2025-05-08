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

  // This will hold the current page's coupons to be displayed
  const [paginatedDeals, setPaginatedDeals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:4001/coupons?discountType=Deal";
        const response = await axios.get(url);
        console.log(response.data.data);
        setGetDeal(response.data.data);
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
        {/* breadcrumb */}
        <div className="breadcrumb-wrapper">
          <div className="breadcrumb-block">
            <h2 className="page-heading">Deals</h2>
            <ul className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link to={"/dashboard"} className="breadcrumb-link">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <a className="breadcrumb-link">Deals</a>
              </li>
            </ul>
          </div>
        </div>

        {/* list */}
        <div className="coupon-list container-fluid">
          <div className="list-filter d-flex justify-content-end">
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
          <div className="row">
            {paginatedDeals.length > 0 &&
              paginatedDeals.map((item) => {
                const isDisabled = item.active === false; // Define variable inside curly braces

                return (
                  <div
                    className="col-lg-4   py-2 text-decoration-none"
                    key={item._id}
                    state={item}
                  >
                    <Card
                      hoverable // Disable hover effect for inactive items
                      className="w-100 h-100 d-lg-flex align-items-center"
                      style={{
                        marginBottom: "20px",
                        opacity: isDisabled ? 0.6 : 1, // Apply opacity for disabled coupons
                      }}
                    >
                      <div className="row">
                        <div className="col-lg-3 col-12">
                          <Link
                            to={`/view/${item.discountType}/${item._id}`}
                            state={item}
                          >
                            <img
                              src={item.images[0]}
                              style={{
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                              className="img-fluid"
                              alt="Coupon Image"
                            />
                          </Link>
                        </div>
                        <div className="col-lg-7 col mt-lg-0 mt-4 d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="card-title">{item.title}</h5>
                            <p className="d-flex">
                              <b>Date: &nbsp;</b>{" "}
                              {formatDate(item.dateRange.startDate)} -{" "}
                              {formatDate(item.dateRange.endDate)}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-1 col-2 mt-lg-0 mt-4 d-flex flex-column align-items-end justify-content-between">
                          <div>
                            <Link
                              className="btn border rounded-5 btn-sm mb-1 "
                              to={`/edit-offer/${item._id}`}
                              disabled={isDisabled}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Edit className="fs-6 text-primary mb-1  " />
                            </Link>

                            <Popconfirm
                              title="Delete the task"
                              description="Are you sure to delete this task?"
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
                                style={{ outline: "none", boxShadow: "none" }}
                                disabled={isDisabled}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                              />
                            </Popconfirm>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="d-flex justify-content-center p-2">
          {/* Pagination */}
          {getDeal.length > pageSize && (
            <Pagination
              current={currentPage}
              total={getDeal.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false} // Hide the size changer if you want fixed page size
            />
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        // onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName="Sample Item"
      />
    </>
  );
};

export default Deal;
