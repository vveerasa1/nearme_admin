import { useState } from 'react'
import "./style.css"
import { Link } from 'react-router-dom'
import { Upload, Event, Add, Remove } from '@mui/icons-material';
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style
import "react-date-range/dist/theme/default.css"; // Theme style

const AddOffer = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const [showPicker, setShowPicker] = useState(false);

    const handleSelect = (ranges) => {
        setRange([ranges.selection]);
        setShowPicker(false);
    };

    const togglePicker = () => setShowPicker(!showPicker);

    return (
        <div className='content-wrapper'>
            {/* breadcrumb */}
            <div className='breadcrumb-wrapper'>
                <div className='breadcrumb-block'>
                    <h2 className='page-heading'>Add Offer</h2>
                    <ul className='breadcrumb-list'>
                        <li className='breadcrumb-item'>
                            <Link to={'/dashboard'} className='breadcrumb-link'>Home</Link>
                        </li>
                        <li className='breadcrumb-item'>
                            <a className='breadcrumb-link'>Offer</a>
                        </li>
                    </ul>
                </div>
            </div>
            {/* add form */}
            <div className='form-container'>
                <form>
                    <div className='row'>
                        <div className='col-12 col-md-12 col-lg-6'>
                            <div className='row'>
                                {/* title */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Title</label>
                                        <input type='text' className='form-input' placeholder='Enter title here' />
                                    </div>
                                </div>
                                {/* description */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Description</label>
                                        <textarea className='form-input' cols={30} rows={3} placeholder='Type something here'></textarea>
                                    </div>
                                </div>
                                {/* coupon details */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Coupon Details</label>
                                        <textarea className='form-input' cols={30} rows={3} placeholder='Type something here'></textarea>
                                    </div>
                                </div>
                                {/* discount type */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Offer Type</label>
                                        <select className='form-input'>
                                            <option>Deal</option>
                                            <option>Discount</option>
                                            <option>Coupon</option>
                                        </select>
                                    </div>
                                    {/* discount */}
                                    <div className='mt-4'>
                                        <label className='form-label'>Percentage</label>
                                        <input type='text' className='form-input' placeholder='%' />
                                    </div>
                                    {/* deal */}
                                    {/* <div className='mt-4'>
                                        <label className='form-label'>Amount</label>
                                        <input type='text' className='form-input' placeholder='%' />
                                    </div> */}
                                </div>
                                {/* primary */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='customday-wrapper'>
                                        <div className="custom-checkbox-container">
                                            <input type="checkbox" id="primary" className="custom-checkbox" />
                                            <label htmlFor="primary" className="custom-checkbox-label">
                                                Make as primary
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* image */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Image</label>
                                        <div className="file-upload-container">
                                            <label htmlFor="fileUpload">
                                                <Upload /> Upload File
                                            </label>
                                            <input
                                                type="file"
                                                id="fileUpload"
                                                accept=".jpeg, .png, .gif, .svg"
                                                onChange={handleFileChange}
                                            />
                                            <p className="file-info">
                                                {file ? (
                                                    <span>Selected File: {file.name}</span>
                                                ) : (
                                                    "Choose a file or drag and drop it here"
                                                )}
                                            </p>
                                        </div>
                                        <p className="form-note">
                                            Note: Upload images in JPEG, PNG, GIF, or SVG format, max 5MB, and
                                            between 800x600 pixels.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 col-md-12 col-lg-6 mb-4'>
                            <div className='row'>
                                {/* vaildity */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Offer Validity Period</label>
                                        <div
                                            className="custom-input"
                                            onClick={togglePicker}
                                            style={{
                                                borderRadius: "6px",
                                                border: "1px solid var(--border-color, #ccc)",
                                                minHeight: "48px",
                                                padding: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <span>
                                                {`${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`}
                                            </span>
                                            <Event className='inputIcon' />
                                        </div>
                                        {showPicker && (
                                            <div style={{ position: "absolute", zIndex: 1000 }}>
                                                <DateRangePicker
                                                    ranges={range}
                                                    onChange={handleSelect}
                                                    moveRangeOnFirstSelection={false}
                                                />
                                            </div>
                                        )}
                                        <p className="form-note">
                                            Note: Specify the duration for which the coupon is valid, including both the start and end dates.
                                        </p>
                                    </div>
                                </div>
                                {/* time */}
                                <div className='col-12 col-md-6 col-lg-6 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Offer Active Start time</label>
                                        <input type='time' className='form-input' placeholder='' />
                                    </div>
                                </div>
                                <div className='col-12 col-md-6 col-lg-6 mb-4'>
                                    <div className='form-group'>
                                        <label className='form-label'>Offer Active End time</label>
                                        <input type='time' className='form-input' placeholder='' />
                                    </div>
                                </div>
                                {/* custom days */}
                                <div className='col-12 col-md-12 col-lg-12'>
                                    <div className='customday-wrapper mb-4'>
                                        <div className="custom-checkbox-container">
                                            <input type="checkbox" id="customCheckbox" className="custom-checkbox" />
                                            <label htmlFor="customCheckbox" className="custom-checkbox-label">
                                                Custom days
                                            </label>
                                        </div>
                                    </div>
                                    {/* fields */}
                                    <div className='row'>
                                        <div className='col-12 col-md-12 col-lg-12'>
                                            <div className='customfieldtimes'>
                                                <div className='form-group day'>
                                                    <label className='form-label'>Day</label>
                                                    <input type='text' className='form-input' placeholder='' />
                                                </div>
                                                <div className='form-group'>
                                                    <label className='form-label'>Start time</label>
                                                    <input type='time' className='form-input' placeholder='' />
                                                </div>
                                                <div className='form-group'>
                                                    <label className='form-label'>End time</label>
                                                    <input type='time' className='form-input' placeholder='' />
                                                </div>
                                                <div className='customfiled-addbtn'>
                                                    <button type='button' className='cfBtn add'><Add className='' /></button>
                                                </div>
                                            </div>
                                            <div className='customfieldtimes'>
                                                <div className='form-group day'>
                                                    <label className='form-label'>Day</label>
                                                    <input type='text' className='form-input' placeholder='' />
                                                </div>
                                                <div className='form-group'>
                                                    <label className='form-label'>Start time</label>
                                                    <input type='time' className='form-input' placeholder='' />
                                                </div>
                                                <div className='form-group'>
                                                    <label className='form-label'>End time</label>
                                                    <input type='time' className='form-input' placeholder='' />
                                                </div>
                                                <div className='customfiled-addbtn'>
                                                    <button type='button' className='cfBtn remove'><Remove className='' /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* form button */}
                        <div className='col-12 col-md-12 col-lg-12'>
                            <div className='vbtns'>
                                <button className='theme-btn btn-border' type='button'>Clear</button>
                                <button className='theme-btn btn-main' type='button'>Save</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOffer;