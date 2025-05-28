import { useState, useEffect } from "react";
import "./style.css";
import {Spin} from "antd";
import { Link ,useNavigate} from "react-router-dom";
import DeleteConfirmationModal from "../../components/deleteConfirmation";
import axios from "axios";
import { Card, Pagination, Button, Popconfirm, message } from "antd";
import { Edit, Delete } from "@mui/icons-material";
import { debounce } from "lodash";
import fallbackImage from "../../assets/images/landingPage.png";
import dayjs from 'dayjs';

const Coupon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getCoupon, setGetCoupon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const options = { day: "2-digit", month: "long" };
    return `${date.toLocaleDateString("en-GB", options)} `;
  };

  const hostUrl = import.meta.env.VITE_BASE_URL;


  useEffect(()=>{
    fetchData()
  },[])

  const fetchData = async (searchText) => {
    try {
      setLoading(true)
      const baseUrl = `${hostUrl}coupons?discountType=Coupon`;
      const url = searchText
        ? `${baseUrl}&keyword=${encodeURIComponent(searchText)}`
        : baseUrl;      
      const response = await axios.get(url);
      console.log(response)
      setGetCoupon(response.data.data.couponInfo);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedFetchData(value);
  };
  
  const debouncedFetchData = debounce((searchText) => {
    setCurrentPage(1);
    fetchData(searchText);
  }, 500);
  
  

  useEffect(() => {

}, [currentPage, getCoupon]);

  const handleConfirmDelete = () => {
    console.log("Item deleted");
    setIsModalOpen(false);
  };

  // const formatValidDateRange = (startDateStr, endDateStr) => {
  //   const startDate = new Date(startDateStr);
  //   const endDate = new Date(endDateStr);
  
  //   const options = { day: '2-digit', month: 'short' , year: 'numeric' }; // e.g., "19 May"
  //   const formattedStart = startDate.toLocaleDateString('en-GB', options);
  //   const formattedEnd = endDate.toLocaleDateString('en-GB', options);
  
  //   return `Valid: ${formattedStart} - ${formattedEnd}`;
  // };

const formatValidDateRange = (startDateStr, endDateStr) => {
  const start = dayjs(startDateStr).format('D/M/YY');
  const end = dayjs(endDateStr).format('D/M/YY');
  return `Valid: ${start} - ${end}`;
};


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (_id) => {
    try {
      const response = await axios.delete(
        `${hostUrl}coupons/${_id}`
      );
      console.log(response);
      fetchData();
    } catch (err) {
      console.log("Error", err);
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };


  return (
    <>
      <div className="content-wrapper">
        {/* Breadcrumb */}
        <div className="breadcrumb-wrapper d-flex flex-column flex-md-row">
          <div className="breadcrumb-block">
            <h2 className="page-heading">Coupons</h2>
            <ul className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link to={"/dashboard"} className="breadcrumb-link">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <span className="breadcrumb-link">Coupons</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Search + List */}
        <div className="lists-container py-4">
          <div className="row">
            <div className="col-12">
              <div className="lists-wrapper businesslist">
                {/* Search bar */}
                <div className="list-filter d-flex justify-content-between align-items-center mb-3">
                  {/* Left side - Heading */}
                  <h5 className="mb-0 fw-semibold">Coupon Lists</h5>

                  {/* Right side - Search form */}
                  <form>
                    <div className="lf-search">
                      <input
                        className="lfs-input"
                        type="text"
                        placeholder="Search here..."
                        onChange={handleSearchChange}
                      />
                      <div className="search-icon-container">
                        <div type="button"></div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Coupons list */}
                <div className="row">
                {console.log(getCoupon,"GETCOUPIN")}

                  {loading === true ? <Spin /> :
                  getCoupon.length > 0 ? (
                    getCoupon.map((item) => {
                      const isDisabled = item.active === false;

                      return (
                        <div
                        className="col-lg-4 col-md-6 col-12 d-flex py-3"
                        key={item._id}
                      >
                        <Card
                          hoverable
                          onClick={() =>
                            navigate(`/edit-offer/${item.discountType}/${item._id}`, {
                              state: item,
                            })
                          }
                          className="w-100"
                          style={{
                            marginBottom: "20px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                            borderRadius: "10px",
                            opacity: item.active === false ? 0.6 : 1,
                            cursor: "pointer",
                          }}
                        >
                          <div className="d-flex w-100">
                            {/* Image Section */}
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
                      
                            {/* Details + Actions */}
                            <div className="ms-3 d-flex justify-content-between flex-grow-1">
                              {/* Left: Details */}
                              <div>
                                <h5 className="card-title mb-1">{item.title}</h5>
                                <p className="mb-1">
                                  <strong>Store:</strong> {item.storeInfo.display_name}
                                </p>
                                <p className="mb-1">
                                  <strong>{formatValidDateRange(item.dateRange?.startDate, item.dateRange?.endDate)}</strong>
                                </p>
                              </div>
                      
                              {/* Right: Action Buttons */}
                              <div className="d-flex flex-column align-items-end">
  <Button
    type="text"
    className="btn border rounded-5 d-flex mb-1"
    icon={<Edit className="fs-6 text-primary" />}
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/edit-offer/${item.discountType}/${item._id}`, {
        state: item,
      });
    }}
  />

<Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    onConfirm={(e) => {
      e.stopPropagation();
      handleDelete(item._id);
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
      style={{ outline: "none", boxShadow: "none" }}
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
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center p-2">
          {getCoupon.length > pageSize && (
            <Pagination
              current={currentPage}
              total={getCoupon.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        itemName="Sample Item"
      />
    </>
  );
};

export default Coupon;
