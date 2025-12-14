import { useState, useCallback, useRef, useEffect } from 'react';
import Select from 'react-select';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import PropTypes from 'prop-types';

const listOfTopics = [
    { value: 'General Speech', label: 'General Speech' },
];


const DemoAnalysis = props => {
    const [keyPoints, setKeyPoints] = useState(null);
    const [analysis, setAnalysis] = useState('Abstract Summary');
    const analysisTypes = ['Abstract Summary ', 'Key Points ', 'Action Items ', 'Sentiment Analysis '];
    const [scriptLoaded, setScriptLoaded] = useState(true);
    const [analysisLoaded, setAnalysisLoaded] = useState(true);
    const [topic, setTopic] = useState('General Meeting');
    const [analysisStore, setAnalysisStore] = useState('Abstract Summary');

    const handleAnalysisChange = (event, newTopic) => {
        if(newTopic === null) {
            setAnalysis(analysisStore);
            props.onAnalysisChange(analysisStore);
        } else {
            setAnalysis(newTopic);
            setAnalysisStore(newTopic);
            props.onAnalysisChange(newTopic);
        }
    };

    const handleTopicChange = (e) => {
        setTopic(e.value);
        console.log(e.value);
    }

    useEffect(() => {
    }, [analysis,topic])

    return (
        <div className='transcribe'>
            <br />
            <div className="toggle-button-group">
                <ToggleButtonGroup
                    color="primary"
                    value={analysis}
                    exclusive
                    aria-label="Platform"
                    fullWidth
                    onChange={handleAnalysisChange}
                >
                    <ToggleButton value='Abstract Summary' style={{ fontWeight: '550' }} >Abstract Summary</ToggleButton>
                    <ToggleButton value='Key Points' style={{ fontWeight: '550' }} >Key Points</ToggleButton>
                    <ToggleButton value='Action Items' style={{ fontWeight: '550' }} >Action Items</ToggleButton>
                    <ToggleButton value='Sentiment Analysis' style={{ fontWeight: '550' }} >Sentiment Analysis</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <br />
            <br />
            <Select 
                className='item'
                onChange={handleTopicChange}
                style={{ width: "20px" }}
                value={listOfTopics.value}
                defaultValue={listOfTopics[0]}
                options={listOfTopics}
            />
            <br />
            {/* <br />
            {scriptLoaded ? <div className='body' >{response}</div> : <SpinningCircles className='loadingIcon' fill='#919191' stroke="transparent" strokeOpacity={.2} speed={1.25} />}
            <br />
            {analysisTypes[analysisType]}
            <br />
            {analysisLoaded ? <div className='body' >{keyPoints}</div> : <SpinningCircles className='loadingIcon' fill='#919191' stroke="transparent" strokeOpacity={.2} speed={1.25} />}
            <br /> */}
        </div>
        
    );
}
DemoAnalysis.propTypes = {
    onAnalysisChange: PropTypes.func
}

export default DemoAnalysis;