import { useState } from 'react'
import "./style.css"
import { Link } from 'react-router-dom'
import BusineessImg from '../../assets/images/businessImg.jpg'
import DeleteConfirmationModal from '../../components/deleteConfirmation'

const DiscountView = () => {

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
                        <h2 className='page-heading'>Summer Splash 15% Off</h2>
                        <ul className='breadcrumb-list'>
                            <li className='breadcrumb-item'>
                                <Link to={'/dashboard'} className='breadcrumb-link'>Home</Link>
                            </li>
                            <li className='breadcrumb-item'>
                                <Link to={'/coupons'} className='breadcrumb-link'>Coupons</Link>
                            </li>
                            <li className='breadcrumb-item'>
                                <a className='breadcrumb-link'>Summer Splash 15% Off</a>
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
                                    <img className='img-fluid' src={BusineessImg} alt='Img' />
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
                                <h3 className='vheading'>Summer Splash 15% Off</h3>
                                <p>Enjoy 15% off on all swimwear and beach accessories. Offer valid until June 30th. Applicable on purchases above $50. Terms and conditions apply.</p>
                                <div className='vadress'>
                                    <h4 className='vblockheading'>Discount</h4>
                                    <p>15%</p>
                                </div>
                                <div className='vcontact'>
                                    <h4 className='vblockheading'>Valid</h4>
                                    <p>10 March 10:00 - 31 March 23:59</p>
                                </div>
                                <div className='vhours'>
                                    <h4 className='vblockheading'>Custom Days</h4>
                                    <ul>
                                        <li>
                                            <p>Monday</p>
                                            <p>12:00 - 23:59</p>
                                        </li>
                                        <li>
                                            <p>Tuesday</p>
                                            <p>12:00 - 23:59</p>
                                        </li>
                                    </ul>
                                </div>
                                <div className='vbtns'>
                                    <button className='theme-btn btn-border' onClick={handleOpenModal} type='button'>Delete</button>
                                    <button className='theme-btn btn-main' type='button'>Edit</button>
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

export default DiscountView;