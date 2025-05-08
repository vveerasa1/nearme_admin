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
        {/* breadcrumb */}
        <div className="breadcrumb-wrapper">
          <div className="breadcrumb-block">
            <h2 className="page-heading">Discounts</h2>
            <ul className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link to={"/dashboard"} className="breadcrumb-link">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <a className="breadcrumb-link">Discounts</a>
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
            {paginatedDiscounts.length > 0 &&
              paginatedDiscounts.map((item) => {
                const isDisabled = item.active === false; // Define variable inside curly braces

                return (
                  <div
                    className="col-lg-4  py-2 text-decoration-none"
                    key={item._id}
                    state={item}
                  >
                    <Card
                      hoverable
                      className="w-100 h-100 d-flex align-items-center"
                      style={{
                        marginBottom: "20px",
                        opacity: isDisabled ? 0.6 : 1, // Apply opacity for disabled coupons
                      }}
                    >
                      <div className="row">
                        <div className="col">
                          <Link
                            to={`/view/${item.discountType}/${item._id}`}
                            state={item}
                          >
                            <img
                              src={item.images[0]}
                              style={{
                                height: "100px",
                                width: "100%",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                              className="img-fluid"
                              alt="Coupon Image"
                            />
                          </Link>
                        </div>
                        <div className="col-7 d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="card-title">{item.title}</h5>
                            <p>{item.startDate}</p>
                            <p className="card-text">
                              Discount: {item.discountType}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-1 col-2 d-flex flex-column align-items-end justify-content-between">
                          <div>
                          <Link
                            className="btn border rounded-5 btn-sm mb-1 "
                            to={`/edit-offer/${item._id}`}
                            disabled={isDisabled}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Your edit logic here
                            }}
                            >
                            <Edit className="fs-6 text-primary mb-1 " />
                            
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
                                disabled={isDisabled} // Disable delete button if item is disabled
                                onClick={(e) => e.stopPropagation()} // Prevent Link navigation
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
          {getDiscount.length > pageSize && (
            <Pagination
              current={currentPage}
              total={getDiscount.length}
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

export default Discount;
