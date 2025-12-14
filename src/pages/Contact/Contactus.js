import React from 'react';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import Navbar from '../../components/Navbar/Navbar';
import './Contactus.scss';
import ContactForm from '../../components/ContactForm/ContactForm';
import Footer from '../../sections/Footer/Footer';

// task 1: Contact us Jamie field is only accepting email
// task 2: message doesn't get sent to email yet

const Contactus = () => {
    return (
        <>
            {/* <Navbar /> */}
            <div className='contact-section'>
                <h2 className='header'>
                    Contact Us
                </h2>
                <p>Please leave a feedback or ask any questions related to our service</p>
            </div>
            <section className='contact-form-area' data-aos="fade-up" data-aos-duration="1500">
                <ContactForm />
            </section>
            {/* <Footer /> */}
        </>
    );
};

export default Contactus;