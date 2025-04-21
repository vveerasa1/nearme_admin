import { useState } from 'react'
import "./style.css"
import { Link } from 'react-router-dom'
import { Upload, Star, Add, Remove } from '@mui/icons-material'

const AddBusiness = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className='content-wrapper'>
            {/* breadcrumb */}
            <div className='breadcrumb-wrapper'>
                <div className='breadcrumb-block'>
                    <h2 className='page-heading'>Add Business</h2>
                    <ul className='breadcrumb-list'>
                        <li className='breadcrumb-item'>
                            <Link to={'/dashboard'} className='breadcrumb-link'>Home</Link>
                        </li>
                        <li className='breadcrumb-item'>
                            <a className='breadcrumb-link'>Business</a>
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
                                {/* name */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Name</label>
                                        <input type='text' className='form-input' placeholder='Enter name here' />
                                    </div>
                                </div>
                                {/* types */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Types</label>
                                        <select className='form-input'>
                                            <option></option>
                                        </select>
                                    </div>
                                </div>
                                {/* address */}
                                <div className='col-12 col-md-12 col-lg-12'>
                                    <div className='form-group'>
                                        <label className='form-label'>Types</label>
                                        <div className='row'>
                                            <div className='col-12 col-md-6 col-lg-6 mb-3'>
                                                <input type='text' className='form-input' placeholder='Address line 1' />
                                            </div>
                                            <div className='col-12 col-md-6 col-lg-6 mb-3'>
                                                <input type='text' className='form-input' placeholder='Address line 2' />
                                            </div>
                                            <div className='col-12 col-md-6 col-lg-6 mb-3'>
                                                <input type='text' className='form-input' placeholder='City' />
                                            </div>
                                            <div className='col-12 col-md-6 col-lg-6 mb-3'>
                                                <input type='text' className='form-input' placeholder='State / Province / Region' />
                                            </div>
                                            <div className='col-12 col-md-6 col-lg-6 mb-3'>
                                                <input type='text' className='form-input' placeholder='Postal code / Zip code' />
                                            </div>
                                            <div className='col-12 col-md-6 col-lg-6 mb-3'>
                                                <input type='text' className='form-input' placeholder='Country' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Latitude */}
                                <div className='col-12 col-md-12 col-lg-6 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Latitude</label>
                                        <input type='text' className='form-input' placeholder='Latitude' />
                                    </div>
                                </div>
                                {/* Longitude */}
                                <div className='col-12 col-md-12 col-lg-6 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Longitude</label>
                                        <input type='text' className='form-input' placeholder='Longitude' />
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
                                {/* phone */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Phone number</label>
                                        <input type='text' className='form-input' placeholder='Phone number' />
                                    </div>
                                </div>
                                {/* email */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Email address</label>
                                        <input type='text' className='form-input' placeholder='Email address' />
                                    </div>
                                </div>
                                {/* place link */}
                                <div className='col-12 col-md-12 col-lg-12 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Place Link</label>
                                        <input type='text' className='form-input' placeholder='Place Link' />
                                    </div>
                                </div>
                                {/* rating */}
                                <div className='col-12 col-md-6 col-lg-6 mb-3'>
                                    <div className='form-group'>
                                        <label className='form-label'>Rating</label>
                                        <div className='ratinginput'>
                                            <div className='position-relative'>
                                                <input type='text' className='form-input' placeholder='0' />
                                                <Star className='ratingInputStar' />
                                            </div>
                                            <div className='position-relative'>
                                                <input type='text' className='form-input' placeholder='000' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6 col-lg-6 mb-4'>
                                    <div className='form-group'>
                                        <label className='form-label'>Review</label>
                                        <input type='text' className='form-input' placeholder='' />
                                    </div>
                                </div>
                                {/* working hours */}
                                <div className='col-12 col-md-12 col-lg-12 mb-4'>
                                    <div className='form-group'>
                                        <label className='form-label'>Working hours</label>
                                        <select className='form-input'>
                                            <option>Open 24 hours</option>
                                            <option>Closed</option>
                                            <option>Custom time</option>
                                        </select>
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

export default AddBusiness;