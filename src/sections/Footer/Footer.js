import React from 'react';
import logo from '../../assets/footer_logo.png';
import './Footer.scss';
import { FaFacebookF, FaInstagram, FaTwitter} from "react-icons/fa";
import { Link } from 'react-router-dom';
import mail from '../../assets/footer/mail.png';
import time from '../../assets/footer/time.png';
import location from '../../assets/footer/location.png';

const Footer = () => {

    const footerMenu = [
        {
            'name' : 'Home',
            'link' : '/'
        },
        {
            'name' : 'Transcribe',
            'link' : '/transcribe'
        },
        {
            'name' : 'Pricing',
            'link' : '/pricing'
        },
        {
            'name' : 'Updates',
            'link' : '/updates'
        },
        {
            'name' : 'Contact Us',
            'link' : '/contact'
        }
    ];

    const footerContacts = [
        {
            'title': 'Email',
            'info': 'admin@wavlang.com',
            'icon': mail
        },
        // {
        //     'title': 'Open Hour',
        //     'info': '09:00 AM - 18:00 PM',
        //     'icon': time
        // },
        // {
        //     'title': 'Clinic Address',
        //     'info': '35 West Dental Street California 1004',
        //     'icon': location
        // }
    ]

    return (
        <footer className='pt-100 pb-70'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-5">
                        <div className="footer-logo">
                            <img src={logo} alt="logo" />
                        </div>
                        <p>WavLang provides a transcription service with Whisper AI and GPT-4.0 for an accurate result</p>

                        {/* <div className="social-logo">
                            <p>Follow us on</p>
                            <ul>
                                <li><a href="/"><FaFacebookF/></a></li>
                                <li><a href="/"><FaTwitter/></a></li>
                                <li><a href="/"><FaInstagram/></a></li>
                            </ul>
                        </div> */}
                    </div>
                    <div className="col-lg-2 col-md-2">
                        <div className="footer-link">
                            <p>Quick Links</p>
                            <ul>
                                {
                                    footerMenu.map((singleMenu, index) => (
                                        <li key={`menu-item-${index}`}>
                                            <Link to={singleMenu.link}>{singleMenu.name}</Link>
                                        </li>
                                    ))
                                    // footerMenu.map(singleMenu => <li><Link to={singleMenu.link}>{singleMenu.name}</Link></li>)
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-5">
                        <div className="footer-contact">
                            <p>Contact & Information</p>

                            {
                                footerContacts.map((footerContact, index) => (
                                    <div className="contact-list" key={`contact-item-${index}`}>
                                        <div className="contact-icon">
                                            <img src={footerContact.icon} alt="icon" />
                                        </div>
                                        <div className="contact-text">
                                            <p>{footerContact.title}</p>
                                            <h5>{footerContact.info}</h5>
                                        </div>
                                    </div>
                                ))
                                // footerContacts.map(footerContact => {
                                //     return  <div className="contact-list">
                                //                 <div className="contact-icon">
                                //                     <img src={footerContact.icon} alt="mail" />
                                //                 </div>
                                //                 <div className="contact-text">
                                //                     <p>{footerContact.title}</p>
                                //                     <h5>{footerContact.info}</h5>
                                //                 </div>
                                //             </div>
                                // })
                            }
                        </div>
                    </div>
                </div>

                <div className="copyright-area">
                    <div className='copy-text'>
                        <p>&copy; WavLang. All Right Reserved</p>
                    </div>  
                    <div className='copy-links'>
                        <ul>
                            <li><Link to='/'>Terms of Use</Link></li>
                            <li><Link to='/'>Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;