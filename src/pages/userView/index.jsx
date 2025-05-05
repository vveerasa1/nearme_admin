import { useState } from 'react'
import "./style.css"
import { Link } from 'react-router-dom'
import UserImg from '../../assets/images/user.png'
import DeleteConfirmationModal from '../../components/deleteConfirmation'
import { VerifiedUser } from '@mui/icons-material'

const UserView = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleConfirmDelete = () => {
        console.log("Item deleted");
        setIsModalOpen(false);
    };

    return (
        <>
            <div className='content-wrapper'>
                {/* breadcrumb */}
                <div className='breadcrumb-wrapper'>
                    <div className='breadcrumb-block'>
                        <h2 className='page-heading'>John Doe</h2>
                        <ul className='breadcrumb-list'>
                            <li className='breadcrumb-item'>
                                <Link to={'/dashboard'} className='breadcrumb-link'>Home</Link>
                            </li>
                            <li className='breadcrumb-item'>
                                <Link to={'/coupons'} className='breadcrumb-link'>Users</Link>
                            </li>
                            <li className='breadcrumb-item'>
                                <a className='breadcrumb-link'>John Doe</a>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* list */}
                <div className='view-container'>
                    <div className='row'>
                        <div className='col-12 col-md-5 col-lg-5 mb-4'>
                            <div className='view-images-wrapper'>
                                <div className='view-big-image'>
                                    <img className='img-fluid' src={UserImg} alt='Img' />
                                </div>
                                <div className='vswitchbtns'>
                                    <div className="radio-list">
                                        <label className="radio" htmlFor="radio__toggle2">
                                            <input className="radio__toggle" id="radio__toggle2" type="checkbox" />
                                            <span className="radio__span">
                                                Disable
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 col-md-7 col-lg-7 mb-4'>
                            <div className='view-content-wrapper'>
                                <h3 className='vheading'>John Doe</h3>
                                <p>DOB: 20 June, 2020</p>
                                <p>Phone Number: +1(234) 567 8901</p>
                                <p>Address: 1234, New Winston Road, New York, NY AB2 X12</p>
                                <p>Joined by: 23 Jan, 2025 10:20 AM</p>

                                <span className='userbadge'>
                                    <VerifiedUser className='ubicon verified' />
                                    <p className='verified'>Verified</p>
                                </span>
                            </div>
                        </div>

                        <div className='col-12 col-md-12'>
                            <div className='vbtns'>
                                <button className='theme-btn btn-border' onClick={handleOpenModal} type='button'>Delete</button>
                                <button className='theme-btn btn-main' type='button'>Verify</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                itemName="Sample Item"
            />
        </>
    );
};

export default UserView;