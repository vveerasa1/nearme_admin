import { useState } from 'react'
import "./style.css"
import { Link } from 'react-router-dom'
import { Search, Edit, Delete, VerifiedUser } from '@mui/icons-material';
import UserImg from '../../assets/images/user.png'
import DeleteConfirmationModal from '../../components/deleteConfirmation'

const Users = () => {

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
                        <h2 className='page-heading'>Users</h2>
                        <ul className='breadcrumb-list'>
                            <li className='breadcrumb-item'>
                                <Link to={'/dashboard'} className='breadcrumb-link'>Home</Link>
                            </li>
                            <li className='breadcrumb-item'>
                                <a className='breadcrumb-link'>Users</a>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* list */}
                <div className='lists-container'>
                    <div className='row'>
                        <div className='col-12 col-md-12 col-lg-12'>
                            <div className='lists-wrapper'>
                                <div className='lw-top'>
                                    <div className='list-head'>
                                        <h3>User Lists</h3>
                                    </div>
                                    <div className='list-filter'>
                                        <div className='lf-search'>
                                            <input className='lfs-input' type='text' placeholder='Search here...' />
                                            <Search className='lf-searchicon' />
                                        </div>
                                    </div>
                                </div>
                                <div className='lw-main'>
                                    <div className='row'>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={UserImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <div className='usercard-name'>
                                                        <Link to={'/user-view'} className='lw-info-heading'>
                                                        John Doe
                                                        </Link>
                                                        <span className='userbadge'>
                                                            <VerifiedUser className='ubicon verified' />
                                                            <p className='verified'>Verified</p>
                                                        </span>
                                                    </div>
                                                    <p className='lw-info-address'>DOB: 20 June, 2020</p>
                                                    <p className='lw-info-options mb-1'>Phone: +1(234) 567 8901</p>
                                                    <p className='lw-info-options'>Address: 1234, New Winston Road</p>
                                                    <Link to={'/user-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={UserImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <div className='usercard-name'>
                                                        <Link to={'/user-view'} className='lw-info-heading'>
                                                        John Doe
                                                        </Link>
                                                        <span className='userbadge'>
                                                            <VerifiedUser className='ubicon notverified' />
                                                            <p className='notverified'>Verified</p>
                                                        </span>
                                                    </div>
                                                    <p className='lw-info-address'>DOB: 20 June, 2020</p>
                                                    <p className='lw-info-options mb-1'>Phone: +1(234) 567 8901</p>
                                                    <p className='lw-info-options'>Address: 1234, New Winston Road</p>
                                                    <Link to={'/user-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={UserImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <div className='usercard-name'>
                                                        <Link to={'/user-view'} className='lw-info-heading'>
                                                        John Doe
                                                        </Link>
                                                        <span className='userbadge'>
                                                            <VerifiedUser className='ubicon verified' />
                                                            <p className='verified'>Verified</p>
                                                        </span>
                                                    </div>
                                                    <p className='lw-info-address'>DOB: 20 June, 2020</p>
                                                    <p className='lw-info-options mb-1'>Phone: +1(234) 567 8901</p>
                                                    <p className='lw-info-options'>Address: 1234, New Winston Road</p>
                                                    <Link to={'/user-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={UserImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <div className='usercard-name'>
                                                        <Link to={'/user-view'} className='lw-info-heading'>
                                                        John Doe
                                                        </Link>
                                                        <span className='userbadge'>
                                                            <VerifiedUser className='ubicon notverified' />
                                                            <p className='notverified'>Verified</p>
                                                        </span>
                                                    </div>
                                                    <p className='lw-info-address'>DOB: 20 June, 2020</p>
                                                    <p className='lw-info-options mb-1'>Phone: +1(234) 567 8901</p>
                                                    <p className='lw-info-options'>Address: 1234, New Winston Road</p>
                                                    <Link to={'/user-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={UserImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <div className='usercard-name'>
                                                        <Link to={'/user-view'} className='lw-info-heading'>
                                                        John Doe
                                                        </Link>
                                                        <span className='userbadge'>
                                                            <VerifiedUser className='ubicon verified' />
                                                            <p className='verified'>Verified</p>
                                                        </span>
                                                    </div>
                                                    <p className='lw-info-address'>DOB: 20 June, 2020</p>
                                                    <p className='lw-info-options mb-1'>Phone: +1(234) 567 8901</p>
                                                    <p className='lw-info-options'>Address: 1234, New Winston Road</p>
                                                    <Link to={'/user-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={UserImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <div className='usercard-name'>
                                                        <Link to={'/user-view'} className='lw-info-heading'>
                                                        John Doe
                                                        </Link>
                                                        <span className='userbadge'>
                                                            <VerifiedUser className='ubicon verified' />
                                                            <p className='verified'>Verified</p>
                                                        </span>
                                                    </div>
                                                    <p className='lw-info-address'>DOB: 20 June, 2020</p>
                                                    <p className='lw-info-options mb-1'>Phone: +1(234) 567 8901</p>
                                                    <p className='lw-info-options'>Address: 1234, New Winston Road</p>
                                                    <Link to={'/user-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={UserImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <div className='usercard-name'>
                                                        <Link to={'/user-view'} className='lw-info-heading'>
                                                        John Doe
                                                        </Link>
                                                        <span className='userbadge'>
                                                            <VerifiedUser className='ubicon notverified' />
                                                            <p className='notverified'>Verified</p>
                                                        </span>
                                                    </div>
                                                    <p className='lw-info-address'>DOB: 20 June, 2020</p>
                                                    <p className='lw-info-options mb-1'>Phone: +1(234) 567 8901</p>
                                                    <p className='lw-info-options'>Address: 1234, New Winston Road</p>
                                                    <Link to={'/user-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={UserImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <div className='usercard-name'>
                                                        <Link to={'/user-view'} className='lw-info-heading'>
                                                        John Doe
                                                        </Link>
                                                        <span className='userbadge'>
                                                            <VerifiedUser className='ubicon verified' />
                                                            <p className='verified'>Verified</p>
                                                        </span>
                                                    </div>
                                                    <p className='lw-info-address'>DOB: 20 June, 2020</p>
                                                    <p className='lw-info-options mb-1'>Phone: +1(234) 567 8901</p>
                                                    <p className='lw-info-options'>Address: 1234, New Winston Road</p>
                                                    <Link to={'/user-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={UserImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <div className='usercard-name'>
                                                        <Link to={'/user-view'} className='lw-info-heading'>
                                                        John Doe
                                                        </Link>
                                                        <span className='userbadge'>
                                                            <VerifiedUser className='ubicon verified' />
                                                            <p className='verified'>Verified</p>
                                                        </span>
                                                    </div>
                                                    <p className='lw-info-address'>DOB: 20 June, 2020</p>
                                                    <p className='lw-info-options mb-1'>Phone: +1(234) 567 8901</p>
                                                    <p className='lw-info-options'>Address: 1234, New Winston Road</p>
                                                    <Link to={'/user-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* pagination */}
                                    <div className='lw-pagination'>
                                        <div className='row'>
                                            <div className='col-12 col-md-12 col-lg-12'>
                                                <div className='lw-pagination-lists'>
                                                    <button className='lw-pagbtn' type='button'>Previous</button>
                                                    <button className='lw-pagbtn' type='button'>1</button>
                                                    <button className='lw-pagbtn active' type='button'>2</button>
                                                    <button className='lw-pagbtn' type='button'>3</button>
                                                    <button className='lw-pagbtn' type='button'>Next</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

export default Users;