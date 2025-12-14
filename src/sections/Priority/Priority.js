import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import priorityImg from '../../assets/about/objectives.png';
import './Priority.scss';
import Demo from '../../pages/Transcribe/Demo/Demo';

const Priority = () => {
    const [demoState, setDemoState] = useState(false);
    const handleDemoButton = (e) => {
        e.preventDefault();
        setDemoState(!demoState);
    }
    return (
        <section className='priority-section emergency-section' data-aos="fade-up" data-aos-duration="2000">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-6">
                        <div className="priority-img">
                            <img src={priorityImg} alt="Emergency" />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="priority-text">
                            <SectionTitle 
                                subTitle="OUR OBJECTIVES" 
                                title="Transcribe and Summarize"
                                description="
                                Our mission is to transform audio into concise, readable text, leveraging the latest AI to distill calls and meetings into clear, focused key points, streamlining your daily activities."
                            />

                            <div className="theme-btn">
                                <button type="submit" className="btn appointment-btn" onClick={handleDemoButton}>
                                    Try Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {demoState ? <Demo /> : <></>}
        </section>
    );
};

export default Priority;