import { useState } from 'react'
import "./style.css"
import { Link } from 'react-router-dom'
import { Search, Edit, Delete } from '@mui/icons-material';
import CouponImg from '../../assets/images/couponImg.png'
import DeleteConfirmationModal from '../../components/deleteConfirmation'

const Discount = () => {

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
                        <h2 className='page-heading'>Discounts</h2>
                        <ul className='breadcrumb-list'>
                            <li className='breadcrumb-item'>
                                <Link to={'/dashboard'} className='breadcrumb-link'>Home</Link>
                            </li>
                            <li className='breadcrumb-item'>
                                <a className='breadcrumb-link'>Discounts</a>
                            </li>
                        </ul>
                    </div>
                    <div className='buttons-block'>
                        <Link to={'/add-offer'} className='theme-btn btn-main'>Add Offer</Link>
                    </div>
                </div>
                {/* list */}
                <div className='lists-container'>
                    <div className='row'>
                        <div className='col-12 col-md-12 col-lg-12'>
                            <div className='lists-wrapper'>
                                <div className='lw-top'>
                                    <div className='list-head'>
                                        <h3>Discount Lists</h3>
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
                                                    <img className='img-fluid' src={CouponImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <Link to={'/discount-view'} className='lw-info-heading'>
                                                        Summer Splash 15% Off
                                                    </Link>
                                                    <p className='lw-info-address'>Discount: 15%</p>
                                                    <p className='lw-info-options'>Valid: 10 March 10:00 - 31 March 11:59</p>
                                                    <Link to={'/discount-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn edit' type='button'><Edit className='lw-icon' /></button>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={CouponImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <Link to={'/discount-view'} className='lw-info-heading'>
                                                        New Year Special $25 Off
                                                    </Link>
                                                    <p className='lw-info-address'>Discount: 15%</p>
                                                    <p className='lw-info-options'>Valid: 10 March 10:00 - 31 March 11:59</p>
                                                    <Link to={'/discount-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn edit' type='button'><Edit className='lw-icon' /></button>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={CouponImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <Link to={'/discount-view'} className='lw-info-heading'>
                                                        Weekend Flash Sale 30% Off
                                                    </Link>
                                                    <p className='lw-info-address'>Discount: 15%</p>
                                                    <p className='lw-info-options'>Valid: 10 March 10:00 - 31 March 11:59</p>
                                                    <Link to={'/discount-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn edit' type='button'><Edit className='lw-icon' /></button>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={CouponImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <Link to={'/discount-view'} className='lw-info-heading'>
                                                        Buy 1 Get 1 Free Bonanza
                                                    </Link>
                                                    <p className='lw-info-address'>Discount: 15%</p>
                                                    <p className='lw-info-options'>Valid: 10 March 10:00 - 31 March 11:59</p>
                                                    <Link to={'/discount-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn edit' type='button'><Edit className='lw-icon' /></button>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={CouponImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <Link to={'/discount-view'} className='lw-info-heading'>
                                                        Summer Splash 15% Off
                                                    </Link>
                                                    <p className='lw-info-address'>Discount: 15%</p>
                                                    <p className='lw-info-options'>Valid: 10 March 10:00 - 31 March 11:59</p>
                                                    <Link to={'/discount-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn edit' type='button'><Edit className='lw-icon' /></button>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={CouponImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <Link to={'/discount-view'} className='lw-info-heading'>
                                                        New Year Special $25 Off
                                                    </Link>
                                                    <p className='lw-info-address'>Discount: 15%</p>
                                                    <p className='lw-info-options'>Valid: 10 March 10:00 - 31 March 11:59</p>
                                                    <Link to={'/discount-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn edit' type='button'><Edit className='lw-icon' /></button>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={CouponImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <Link to={'/discount-view'} className='lw-info-heading'>
                                                        Weekend Flash Sale 30% Off
                                                    </Link>
                                                    <p className='lw-info-address'>Discount: 15%</p>
                                                    <p className='lw-info-options'>Valid: 10 March 10:00 - 31 March 11:59</p>
                                                    <Link to={'/discount-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn edit' type='button'><Edit className='lw-icon' /></button>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={CouponImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <Link to={'/discount-view'} className='lw-info-heading'>
                                                        Buy 1 Get 1 Free Bonanza
                                                    </Link>
                                                    <p className='lw-info-address'>Discount: 15%</p>
                                                    <p className='lw-info-options'>Valid: 10 March 10:00 - 31 March 11:59</p>
                                                    <Link to={'/discount-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn edit' type='button'><Edit className='lw-icon' /></button>
                                                    <button className='lw-abtn delete' onClick={handleOpenModal} type='button'><Delete className='lw-icon' /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-6 col-lg-4 mb-4'>
                                            <div className='lw-card'>
                                                <div className='lw-img'>
                                                    <img className='img-fluid' src={CouponImg} alt="Img" />
                                                </div>
                                                <div className='lw-info'>
                                                    <Link to={'/discount-view'} className='lw-info-heading'>
                                                        Buy 1 Get 1 Free Bonanza
                                                    </Link>
                                                    <p className='lw-info-address'>Discount: 15%</p>
                                                    <p className='lw-info-options'>Valid: 10 March 10:00 - 31 March 11:59</p>
                                                    <Link to={'/discount-view'} className='lw-info-coupon-link available'>
                                                        View
                                                    </Link>
                                                </div>
                                                <div className='lw-actionbtns'>
                                                    <button className='lw-abtn edit' type='button'><Edit className='lw-icon' /></button>
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

export default Discount;