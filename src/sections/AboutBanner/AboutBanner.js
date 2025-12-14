import React from 'react';
import { Link } from 'react-router-dom';
import './AboutBanner.scss';
import bannerOne from '../../assets/about/banner/banner_1.png'
import bannerTwo from '../../assets/about/banner/banner_2.png'
import pattern from '../../assets/banner/pattern.png'

const AboutBanner = () => {
    return (
        <section className='about-section' data-aos="fade-up" data-aos-duration="1500">
            <div className="d-table">
                <div className="d-table-cell">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-5">
                                <div className="about-banner-text">
                                    <h2>About Us</h2>
                                    <p>WavLang provides a great quality transcription by blending Whisper AI's precision with GPT-4.0's analytical prowess to deliver fast, accurate, and insightful text outputs from audio. Driven by a passion for accessibility and innovation, our team is dedicated to providing top-tier transcription services that cater to both professional and personal needs. Discover the future of transcription with us, where every word counts and insights abound.</p>
                                    {/* <div className="theme-btn">
                                        <Link to='/contact'>Contact Us</Link>
                                    </div> */}
                                    <div className="theme-btn">
                                        <a href='https://openai.com/research/whisper' target="_blank" rel="noreferrer" style={{float: 'left'}} >Learn about Whisper AI</a>
                                        <a href='https://openai.com/gpt-4' target="_blank" rel="noreferrer" style={{float: 'right'}} >Learn about GPT-4.0</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="about-banner-img">
                                    <img src={bannerOne} alt="about banner"/>
                                    <img src={bannerTwo} alt="about banner two"/>
                                    <img className='pattern' src={pattern} alt="about banner two"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutBanner;