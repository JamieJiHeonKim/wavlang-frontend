import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer';
import { Link } from 'react-router-dom';
import './NotFoundPage.scss';

function NotFoundPage() {
    return(
        <div className='not-found-content' data-aos="fade-up" data-aos-duration="1500">
            <section className="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100">
                <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                    <div className="max-w-md text-center">
                        <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
                            <span className="sr-only" style={{ fontWeight: 'bold' }} >Error 404</span>
                        </h2>
                        <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
                        <p className="mt-4 mb-8 dark:text-gray-400">But dont worry, you can find plenty of other things on our homepage.</p>
                        <div className='theme-btn'>
                            <Link to="/">Back to Homepage</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>        
    )
}

export default NotFoundPage;