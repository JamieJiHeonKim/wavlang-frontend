import React from 'react';
import './ContactForm.scss';
import icon from '../../assets/banner/icons/mail.png';

const ContactForm = () => {
    return (
        <form>
            <div className="row">
                <div className="col-lg-6">
                    <div className="form-group">
                        <label>Your Name</label>
                        <input type="email" className="form-control" placeholder="Enter your name..." />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="form-group">
                        <label> Your E-mail Address</label>
                        <input type="email" className="form-control" placeholder="Enter email address..." />
                    </div>
                </div>
                {/* <div className="col-lg-6">
                    <div className="form-group">
                        <label>Service</label>
                        <select className="form-control">
                            <option>Teeth Whitening</option>
                            <option>Teeth Whitening</option>
                            <option>Teeth Whitening</option>
                            <option>Teeth Whitening</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="form-group">
                        <label>Department</label>
                        <select className="form-control">
                            <option>Select Department</option>
                            <option>Select Department</option>
                            <option>Select Department</option>
                            <option>Select Department</option>
                        </select>
                    </div>
                </div> */}
                <div className="col-lg-12">
                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Messages</label>
                        <textarea className="form-control" placeholder='Enter your messages...' rows="3"></textarea>
                    </div>
                </div>

                <div className="col-lg-6">
                    <button type="submit" className="btn appointment-btn">Submit</button>
                </div>
                <div className="col-lg-6">
                    <div className="appointment-call">
                        <div className='icon'>
                            <img src={icon} alt="icon" />
                        </div>
                        <div className='call-text'>
                            <p>Typical Response</p>
                            <p>~ 48 Hours</p>
                            <h5>admin@wavlang.com</h5>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ContactForm;