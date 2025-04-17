import React from "react"
import "./style.css"
import { Link } from 'react-router-dom'
import { Business, LocalOffer } from '@mui/icons-material'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

const shop = [
    { name: "Jan", present: 40, previous: 30 },
    { name: "Feb", present: 80, previous: 70 },
    { name: "Mar", present: 50, previous: 60 },
    { name: "Apr", present: 90, previous: 85 },
    { name: "May", present: 60, previous: 55 },
    { name: "Jun", present: 100, previous: 95 },
];

const coupon = [
    { name: "Jan", present: 40, previous: 30 },
    { name: "Feb", present: 80, previous: 70 },
    { name: "Mar", present: 50, previous: 60 },
    { name: "Apr", present: 90, previous: 85 },
    { name: "May", present: 60, previous: 55 },
    { name: "Jun", present: 100, previous: 95 },
];

const activity = [
    { name: 'Shop A', coupons: 120 },
    { name: 'Shop B', coupons: 80 },
    { name: 'Shop C', coupons: 150 },
    { name: 'Shop D', coupons: 200 },
    { name: 'Shop E', coupons: 95 },
];

const Dashboard = () => {
    const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <div className='content-wrapper'>
            {/* breadcrumb */}
            <div className='breadcrumb-wrapper'>
                <h2 className='page-heading'>Dashboard</h2>
                <ul className='breadcrumb-list'>
                    <li className='breadcrumb-item'>
                        <Link to={'/'} className='breadcrumb-link'>Home</Link>
                    </li>
                    <li className='breadcrumb-item'>
                        <a className='breadcrumb-link'>Dashboard</a>
                    </li>
                </ul>
            </div>
            {/* counts */}
            <div className='counts-wrapper'>
                <div className='row'>
                    <div className='col-12 col-md-6 col-lg-3 mb-4'>
                        <div className='count-item'>
                            <div className='countitem-icon'>
                                <Business className='cicon' />
                            </div>
                            <div className='countitem-info'>
                                <h4>Total Shops</h4>
                                <h3>80</h3>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-md-6 col-lg-3 mb-4'>
                        <div className='count-item'>
                            <div className='countitem-icon'>
                                <Business className='cicon' />
                            </div>
                            <div className='countitem-info'>
                                <h4>New Shops <span>(This Week)</span></h4>
                                <h3>6</h3>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-md-6 col-lg-3 mb-4'>
                        <div className='count-item'>
                            <div className='countitem-icon'>
                                <LocalOffer className='cicon' />
                            </div>
                            <div className='countitem-info'>
                                <h4>Total Coupons</h4>
                                <h3>12</h3>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-md-6 col-lg-3 mb-4'>
                        <div className='count-item'>
                            <div className='countitem-icon'>
                                <LocalOffer className='cicon' />
                            </div>
                            <div className='countitem-info'>
                                <h4>New Coupons <span>(This Week)</span></h4>
                                <h3>5</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* statistics */}
            <div className='statistics-wrapper'>
                <div className='row'>
                    <div className='col-12 col-md-12 col-lg-12'>
                        <div className='graph-card-heading'>
                            <h3>Statistics</h3>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 col-md-12 col-lg-6 mb-4'>
                        <div className='graph-card-wrapper'>
                            <div className='gc-head'>
                                <h3>Shops</h3>
                                <div className='gc-sort-btns'>
                                    <button type='button' className='gcBtn active'>D</button>
                                    <button type='button' className='gcBtn'>W</button>
                                    <button type='button' className='gcBtn'>M</button>
                                    <button type='button' className='gcBtn'>Y</button>
                                </div>
                            </div>
                            <div className='gc-body'>
                                <ResponsiveContainer>
                                    <LineChart
                                        data={shop}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tickFormatter={(name) => name.charAt(0).toUpperCase() + name.slice(1)} />
                                        <YAxis />
                                        <Tooltip formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]} />
                                        <Legend formatter={(value) => capitalize(value)} />
                                        {/* Present values line */}
                                        <Line
                                            type="monotone"
                                            dataKey="present"
                                            stroke="#EB8137"
                                            activeDot={{ r: 8 }}
                                        />
                                        {/* Previous values line */}
                                        <Line
                                            type="monotone"
                                            dataKey="previous"
                                            stroke="#4C74B5"
                                            activeDot={{ r: 8 }}
                                            strokeDasharray="5 5" // Optional dashed line for visual distinction
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-md-12 col-lg-6 mb-4'>
                        <div className='graph-card-wrapper'>
                            <div className='gc-head'>
                                <h3>Coupons</h3>
                                <div className='gc-sort-btns'>
                                    <button type='button' className='gcBtn active'>D</button>
                                    <button type='button' className='gcBtn'>W</button>
                                    <button type='button' className='gcBtn'>M</button>
                                    <button type='button' className='gcBtn'>Y</button>
                                </div>
                            </div>
                            <div className='gc-body'>
                                <ResponsiveContainer>
                                    <LineChart
                                        data={coupon}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tickFormatter={(name) => name.charAt(0).toUpperCase() + name.slice(1)} />
                                        <YAxis />
                                        <Tooltip formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]} />
                                        <Legend formatter={(value) => capitalize(value)} />
                                        {/* Present values line */}
                                        <Line
                                            type="monotone"
                                            dataKey="present"
                                            stroke="#EB8137"
                                            activeDot={{ r: 8 }}
                                        />
                                        {/* Previous values line */}
                                        <Line
                                            type="monotone"
                                            dataKey="previous"
                                            stroke="#4C74B5"
                                            activeDot={{ r: 8 }}
                                            strokeDasharray="5 5" // Optional dashed line for visual distinction
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* activity */}
            <div className='statistics-wrapper'>
                <div className='row'>
                    <div className='col-12 col-md-12 col-lg-12'>
                        <div className='graph-card-heading'>
                            <h3>Overall Activity</h3>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 col-md-12 col-lg-12'>
                        <div className='graph-card-wrapper'>
                            <div className='gc-body bargraph'>
                                <ResponsiveContainer>
                                    <BarChart data={activity}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                value,
                                                name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter of shop name
                                            ]}
                                        />
                                        <Legend formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                                        <Bar dataKey="coupons" fill="#4C74B5" />
                                    </BarChart>
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