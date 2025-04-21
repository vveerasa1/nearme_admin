import { useState } from 'react'
import "./style.css"
import { Link } from 'react-router-dom'
import BusineessImg from '../../assets/images/businessImg.jpg'
import { Star } from '@mui/icons-material';
import MapImg from '../../assets/images/mapImg.png'

const BusinessView = () => {
    return (
        <div className='content-wrapper'>
            {/* breadcrumb */}
            <div className='breadcrumb-wrapper'>
                <div className='breadcrumb-block'>
                    <h2 className='page-heading'>North East Kitchen  ( Specialty Cuisine Restaurant )</h2>
                    <ul className='breadcrumb-list'>
                        <li className='breadcrumb-item'>
                            <Link to={'/dashboard'} className='breadcrumb-link'>Home</Link>
                        </li>
                        <li className='breadcrumb-item'>
                            <Link to={'/business-listings'} className='breadcrumb-link'>Business Listings</Link>
                        </li>
                        <li className='breadcrumb-item'>
                            <a className='breadcrumb-link'>North East Kitchen  ( Specialty Cuisine Restaurant )</a>
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
                            <div className='view-small-image'>
                                <img className='img-fluid' src={BusineessImg} alt='Img' />
                                <img className='img-fluid' src={BusineessImg} alt='Img' />
                                <img className='img-fluid' src={BusineessImg} alt='Img' />
                            </div>
                        </div>
                        {/* <div className='coupons-view'>
                            <button type='button' className='theme-btn btn-border'>View Offers</button>
                        </div> */}
                    </div>
                    <div className='col-12 col-md-7 col-lg-7 mb-4'>
                        <div className='view-content-wrapper'>
                            <h3 className='vheading'>North East Kitchen ( Specialty Cuisine Restaurant )</h3>
                            <div className='vrating'>
                                <p>4.3</p>
                                <span>
                                    <Star className='vstars' />
                                    <Star className='vstars' />
                                    <Star className='vstars' />
                                    <Star className='vstars' />
                                    <Star className='vstars' />
                                </span>
                                <p>(1.2K)</p>
                            </div>
                            <div className='vadress'>
                                <h4 className='vblockheading'>Address</h4>
                                <p>Wellingdon Estate, 53, New Winston Road, New York, NY A4E V23</p>
                            </div>
                            <div className='vcontact'>
                                <h4 className='vblockheading'>Contact</h4>
                                <p>+1(123)456-7890</p>
                                <p>info@example.com</p>
                            </div>
                            <div className='vhours'>
                                <h4 className='vblockheading'>Working hours</h4>
                                <ul>
                                    <li>
                                        <p>Monday</p>
                                        <p>12-10 pm</p>
                                    </li>
                                    <li>
                                        <p>Tuesday</p>
                                        <p>12-10 pm</p>
                                    </li>
                                    <li>
                                        <p>Wednesday</p>
                                        <p>12-10 pm</p>
                                    </li>
                                    <li>
                                        <p>Thursday</p>
                                        <p>12-10 pm</p>
                                    </li>
                                </ul>
                            </div>
                            <div className='vmap'>
                                <img className='img-fluid' src={MapImg} alt='Img' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessView;