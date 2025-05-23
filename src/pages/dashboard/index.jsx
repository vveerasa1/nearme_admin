import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { Business, LocalOffer, Person } from "@mui/icons-material";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";

const Dashboard = () => {

  const [getTotalCount, setGetTotalCount] = useState();
  const [getNewTotalCount, setGetNewTotalCount] = useState();
  const [getTotalCouponCount, setGetTotalCouponCount] = useState();
  const [getNewTotalCouponCount, setGetNewCouponTotalCount] = useState();
  const [getNewTotalUserCountount, setGetNewUserTotalCount] = useState();

  const [loadingBusinessGraph, setLoadingBusinessGraph] = useState(false);
const [loadingCouponGraph, setLoadingCouponGraph] = useState(false);

  const [getGraphWeekData, setGetGraphWeekData] = useState();
  const [getGraphMonthData, setGetGraphMonthData] = useState();
  const [getGraphYearData, setGetGraphYearData] = useState();
  const [graphType, setGraphType] = useState("week");
  const [graphTypeCoupon, setGraphTypeCoupon] = useState("week");
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_BASE_URL;


  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const dashboardRes = await axios.get(`${baseUrl}dashboard`);
        const weekGraphRes = await axios.get(`${baseUrl}dashboard/graph?type=week`);
  
        const countData = dashboardRes.data.data;
  
        setGetTotalCount(countData.businessCount);
        setGetTotalCouponCount(countData.couponCount);
        setGetNewTotalCount(countData.recentBusinesses);
        setGetNewCouponTotalCount(countData.recentCoupons);
        setGetNewUserTotalCount(countData.userCount);
        setGetGraphWeekData(weekGraphRes.data.data);
      } catch (error) {
        console.error("Error fetching initial dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInitialData();
  }, []);
  

  const fetchGraphDataIfNeeded = async (type, forGraph = "business") => {
    try {
      if (type === "month") {
        if (forGraph === "business" && !getGraphMonthData) {
          setLoadingBusinessGraph(true);
          const res = await axios.get(`${baseUrl}dashboard/graph?type=month`);
          setGetGraphMonthData(res.data.data);
          setLoadingBusinessGraph(false);
        } else if (forGraph === "coupon" && !getGraphMonthData) {
          setLoadingCouponGraph(true);
          const res = await axios.get(`${baseUrl}dashboard/graph?type=month`);
          setGetGraphMonthData(res.data.data);
          setLoadingCouponGraph(false);
        }
      }
  
      if (type === "year") {
        if (forGraph === "business" && !getGraphYearData) {
          setLoadingBusinessGraph(true);
          const res = await axios.get(`${baseUrl}dashboard/graph?type=year`);
          setGetGraphYearData(res.data.data);
          setLoadingBusinessGraph(false);
        } else if (forGraph === "coupon" && !getGraphYearData) {
          setLoadingCouponGraph(true);
          const res = await axios.get(`${baseUrl}dashboard/graph?type=year`);
          setGetGraphYearData(res.data.data);
          setLoadingCouponGraph(false);
        }
      }
    } catch (error) {
      console.error(`Failed to fetch ${type} graph data:`, error);
      if (forGraph === "business") setLoadingBusinessGraph(false);
      if (forGraph === "coupon") setLoadingCouponGraph(false);
    }
  };
  
  
  

  // useEffect(() => {
  //   if (getGraphWeekData) {
  //     console.log("✅ Week Graph Data updated:", getGraphWeekData);
  //   }
  // }, [getGraphWeekData]);

  // useEffect(() => {
  //   if (getGraphMonthData) {
  //     console.log("✅ Month Graph Data updated:", getGraphMonthData);
  //   }
  // }, [getGraphMonthData]);

  // useEffect(() => {
  //   if (getGraphYearData) {
  //     console.log("✅ Year Graph Data updated:", getGraphYearData);
  //   }
  // }, [getGraphYearData]);

  const getBusinessGraphData = () => {
    switch (graphType) {
      case "week":
        return getGraphWeekData?.businesses || [];
      case "month":
        return getGraphMonthData?.businesses || [];
      case "year":
        return getGraphYearData?.businesses || [];
      default:
        return [];
    }
  };
  

  const getCouponGraphData = () => {
    switch (graphTypeCoupon) {
      case "week":
        return getGraphWeekData?.coupons || [];
      case "month":
        return getGraphMonthData?.coupons || [];
      case "year":
        return getGraphYearData?.coupons || [];
      default:
        return [];
    }
  };
  

  return (
    <div className="content-wrapper">
      {/* breadcrumb */}
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-block">
          <h2 className="page-heading">Dashboard</h2>
          <ul className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link to={"/"} className="breadcrumb-link">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <a className="breadcrumb-link">Dashboard</a>
            </li>
          </ul>
        </div>
      </div>
      {/* counts */}
      <div className="counts-wrapper" style={{ overflowX: 'auto' }}>
  <div
    className="d-flex gap-3 flex-nowrap"
    style={{ minWidth: '100%', paddingBottom: '10px' }}
  >
    <div className="count-item">
      <div className="countitem-icon">
        <Business className="cicon" />
      </div>
      <div className="countitem-info">
        <h4>Total Shops</h4>
        <h3>
          <CountUp start={0} end={getTotalCount} duration={2} />
        </h3>
      </div>
    </div>

    <div className="count-item">
      <div className="countitem-icon">
        <Business className="cicon" />
      </div>
      <div className="countitem-info">
        <h4>
          New Shops <span>(This Week)</span>
        </h4>
        <h3>
          <CountUp start={0} end={getNewTotalCount} duration={2} />
        </h3>
      </div>
    </div>

    <div className="count-item">
      <div className="countitem-icon">
        <LocalOffer className="cicon" />
      </div>
      <div className="countitem-info">
        <h4>Total Coupons</h4>
        <h3>
          <CountUp start={0} end={getTotalCouponCount} duration={2} />
        </h3>
      </div>
    </div>

    <div className="count-item">
      <div className="countitem-icon">
        <LocalOffer className="cicon" />
      </div>
      <div className="countitem-info">
        <h4>
          New Coupons <span>(This Week)</span>
        </h4>
        <h3>
          <CountUp start={0} end={getNewTotalCouponCount} duration={2} />
        </h3>
      </div>
    </div>

    <div className="count-item">
      <div className="countitem-icon">
        <Person className="cicon" />
      </div>
      <div className="countitem-info">
        <h4>
          Users
        </h4>
        <h3>
          <CountUp start={0} end={getNewTotalUserCountount} duration={2} />
        </h3>
      </div>
    </div>
  </div>
</div>

      {/* statistics */}
      <div className="statistics-wrapper">
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12">
            <div className="graph-card-heading">
              <h3>Statistics</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-6 mb-4">
            <div className="graph-card-wrapper">
              <div className="gc-head">
                <h3>Shops</h3>
                <div className="gc-sort-btns">
                  {[ "week", "month", "year"].map((type) => (
                    <button
                    key={type}
                    type="button"
                    className={`gcBtn ${graphType === type ? "active" : ""}`}
                    onClick={() => {
                      setGraphType(type);
                      // fetchGraphDataIfNeeded(type);
                      fetchGraphDataIfNeeded(type, "business");
                    }}
                  >
                    {type[0].toUpperCase()}
                  </button>
                  
                  ))}
                </div>
              </div>
              <div className="gc-body">
                <ResponsiveContainer>
                  {loadingBusinessGraph === true ? (
                    <Spin />
                  ) : (
                    <LineChart
                      data={getBusinessGraphData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      {console.log(getBusinessGraphData(), "Line chart 📈")}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="label"
                        tickFormatter={(name) =>
                          name.charAt(0).toUpperCase() + name.slice(1)
                        }
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          value,
                          name.charAt(0).toUpperCase() + name.slice(1),
                        ]}
                      />
                      <Legend formatter={(value) => capitalize(value)} />
                      {/* Present values line */}
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#EB8137"
                        activeDot={{ r: 8 }}
                      />
                      {/* Previous values line */}
                      <Line
                        type="monotone"
                        dataKey="previous"
                        stroke="#4C74B5"
                        activeDot={{ r: 8 }}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-6 mb-4">
            <div className="graph-card-wrapper">
              <div className="gc-head">
                <h3>Coupons</h3>
                <div className="gc-sort-btns">
                  {[ "week", "month", "year"].map((type) => (
                    <button
                    key={type}
                    type="button"
                    className={`gcBtn ${graphTypeCoupon === type ? "active" : ""}`}
                    onClick={() => {
                      setGraphTypeCoupon(type);
                      // fetchGraphDataIfNeeded(type);
                      fetchGraphDataIfNeeded(type, "coupon");
                    }}
                  >
                    {type[0].toUpperCase()}
                  </button>
                  
                  ))}
                </div>
              </div>
              <div className="gc-body">
                <ResponsiveContainer>
                  {loadingCouponGraph === true ? (
                    <Spin />
                  ) : (
                    <LineChart data={getCouponGraphData()}>
                      {console.log(getCouponGraphData(), "Coupon chart 📈")}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#EB8137"
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#4C74B5"
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
