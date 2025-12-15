import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import './TranscribeWhisper.scss';
import { Puff, Bars, Circles, Rings, SpinningCircles, Audio, BallTriangle, Grid, Hearts, Oval, TailSpin, ThreeDots } from 'react-loading-icons';
import OpenAI from 'openai';
import Select from 'react-select';
import Autocomplete from '@mui/material/Autocomplete';

const model = "whisper-1";
const response_format = "text";
const initial_prompt = "Hello, welcome to my lecture.\nMy name is Jamie.\nIt is nice to see everyone here today.\n";
const verbose = true;
// const language = 'kor';

function TranscribeWhisper({file, topic, analysisType, analysisLanguage}) {
    // const [file, setFile] = useState();
    const [response, setResponse] = useState(null);
    const [keyPoints, setKeyPoints] = useState(null);
    const [scriptLoaded, setScriptLoaded] = useState(true);
    const [analysisLoaded, setAnalysisLoaded] = useState(true);

    const openAIApiKey = process.env.REACT_APP_API_KEY;
    const openai = new OpenAI({
        apiKey: openAIApiKey,
        dangerouslyAllowBrowser: true
    });

    // Task 3: Allow user to select what language to be transcribed, as well as the analysis
    
    const fetchAudioFile = async () => {
        if (!file) {
            return;
        }
        console.log('file:', file);
        
    //     try{
    //         const formData = new FormData();
    //         // formData.append("model", model);
    //         formData.append("file", file);
    //         // formData.append("response_format", response_format);
    //         // formData.append("initial_prompt", initial_prompt);
    //         // formData.append("verbose", verbose);
    //         // formData.append("language", language);
    //         setScriptLoaded(false);
    //         const response = await fetch(`http://localhost:8080/api/transcribe_whisperai`, {
    //                 method: 'POST',
    //                 body: formData
    //             })
    //         if (response.ok) {
    //             console.log(response.data);
    //             setResponse(response.data);
    //             setAnalysisLoaded(false);
    //             setScriptLoaded(true);
    //             getAnalysisType(response, topic);
    //         } else {
    //             console.error(response.error)
    //             setScriptLoaded(true);
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // };

        try{
            const formData = new FormData();
            formData.append("model", model);
            formData.append("file", file);
            formData.append("response_format", response_format);
            formData.append("initial_prompt", initial_prompt);
            formData.append("verbose", verbose);
            // formData.append("language", language);
            setScriptLoaded(false);
            await axios
                .post("https://api.openai.com/v1/audio/transcriptions", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
                    },
                    timeout: 120000, // 2 minutes timeout for transcription
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        console.log(`Upload Progress: ${percentCompleted}%`);
                    },
                })
                .then((res) => {
                    console.log(res.data);
                    setResponse(res.data);
                    setAnalysisLoaded(false);
                    setScriptLoaded(true);
                    getAnalysisType(res, topic);
                })
                .catch((err) => {
                    if (axios.isCancel(err) || err.name === 'AbortError' || err.name === 'CanceledError') {
                        console.log('Transcription request was cancelled');
                        return;
                    }
                    console.log(err)
                    setScriptLoaded(true);
                });
        } catch (error) {
            if (axios.isCancel(error) || error.name === 'AbortError' || error.name === 'CanceledError') {
                console.log('Transcription request was cancelled');
                return;
            }
            throw error;
        }
    };

    useEffect(() => {
        if (!file) return;
        
        let isActive = true;
        
        const runFetch = async () => {
            if (isActive) {
                await fetchAudioFile();
            }
        };
        
        runFetch();
        
        return () => {
            isActive = false;
        };
    }, [file]);

    const getAnalysisType = async (result, topicType) => {        
        if(analysisType === 'Abstract Summary'){
            abstract_summary_extraction(result.data, topicType);
        } else if(analysisType === 'Key Points'){
            key_points_extraction(result.data, topicType);
        } else if(analysisType === 'Action Items'){
            action_item_extraction(result.data, topicType);
        } else {
            sentiment_analysis(result.data, topicType);
        }
    };

    const abstract_summary_extraction = async (transcription, topicType) => {
        console.log("abstract summary extraction is working");
        const key_points = await openai.chat.completions.create(
            {
                model: "gpt-4-1106-preview",
                temperature: 0,
                messages: [
                    {
                        "role": "system",
                        "content": "You are a highly skilled AI trained in language comprehension and summarization. I would like you to read the following text and summarize it into a concise abstract paragraph related to the topic - " + topicType + ". Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the discussion without needing to read the entire text. Please avoid unnecessary details or tangential points. Don't forget to separate phrases with a new line and answer in " + analysisLanguage.label
                    },
                    {
                        "role": "user",
                        "content": transcription
                    }
                ],
            }
        );
        setKeyPoints(key_points['choices'][0]['message']['content']);
        setAnalysisLoaded(true);
    }

    const key_points_extraction = async (transcription, topicType) => {
        console.log("key points is working");
        const key_points = await openai.chat.completions.create(
            {
                model: "gpt-4-1106-preview",
                temperature: 0,
                messages: [
                    {
                        "role": "system",
                        "content": "You are a proficient AI with a specialty in distilling information into key points. Based on the following text, identify and list the main points that were discussed or brought up related to the topic - " + topicType + ". These should be the most important ideas, findings, or topics that are crucial to the essence of the discussion. Your goal is to provide a list that someone could read to quickly understand what was talked about. Don't forget to separate phrases with a new line and answer in " + analysisLanguage.label
                    },
                    {
                        "role": "user",
                        "content": transcription
                    }
                ]
            }
        );
        setKeyPoints(key_points['choices'][0]['message']['content']);
        setAnalysisLoaded(true);
    }

    const action_item_extraction = async (transcription, topicType) => {
        console.log("action item extraction is working");
        const key_points = await openai.chat.completions.create(
            {
                model: "gpt-4-1106-preview",
                temperature: 0,
                messages: [
                    {
                        "role": "system",
                        "content": "You are an AI expert in analyzing conversations and extracting action items. Please review the text and identify any tasks, assignments, or actions that were agreed upon or mentioned as needing to be done related to the topic - " + topicType + ". These could be tasks assigned to specific individuals, or general actions that the group has decided to take. Please list these action items clearly and concisely. Don't forget to separate phrases with a new line and answer in " + analysisLanguage.label
                    },
                    {
                        "role": "user",
                        "content": transcription
                    }
                ]
            }
        );
        setKeyPoints(key_points['choices'][0]['message']['content']);
        setAnalysisLoaded(true);
    }

    const sentiment_analysis = async (transcription, topicType) => {
        console.log("sentiment analysis is working");
        const key_points = await openai.chat.completions.create(
            {
                model: "gpt-4-1106-preview",
                temperature: 0,
                messages: [
                    {
                        "role": "system",
                        "content": "As an AI with expertise in language and emotion analysis, your task is to analyze the sentiment of the following text related to the topic - " + topicType + ". Please consider the overall tone of the discussion, the emotion conveyed by the language used, and the context in which words and phrases are used. Indicate whether the sentiment is generally positive, negative, or neutral, and provide brief explanations for your analysis where possible. Don't forget to separate phrases with a new line and answer in " + analysisLanguage.label
                    },
                    {
                        "role": "user",
                        "content": transcription
                    }
                ]
            }
        );
        setKeyPoints(key_points['choices'][0]['message']['content']);
        setAnalysisLoaded(true);
    }

    const generate_corrected_transcript = async (transcription) => {
        console.log("checking for punctuation");
        console.log(transcription);
        console.log('topic:', topic);
        const res = await openai.chat.completions.create(
            {
                model: "gpt-4-1106-preview",
                temperature: 0,
                messages: [
                    {
                        "role": "system",
                        "content": "You are a helpful grammar and spelling assistant in any language. Your task is to correct any spelling discrepancies and basic punctuations in the provided text. For convenience, form phrases and separate them with new lines."
                    },
                    {
                        "role": "user",
                        "content": transcription
                    }
                ]
            }
        )
        
        if (res['choices'][0]['finish_reason'] === 'content_filter') {
            setResponse('Unfortunately, this seems to violate copyright laws to display full lyrics here for the uploaded audio.\nHowever, I am more than happy to continue the anlysis process for you!\n')
        } else {
            setResponse(res['choices'][0]['message']['content']);
        }

        setScriptLoaded(true);
    }

    return (
        <div className='transcribe'>
            <br />
            {scriptLoaded ? 
                <div className='text-body' contentEditable>
                    {response}
                </div> : 
                <div style={{ textAlign: 'center' }}>
                    <SpinningCircles className='loadingIcon' fill='#919191' stroke="transparent" strokeOpacity={.2} speed={1.25} />
                    <p style={{ marginTop: '10px', color: '#666' }}>Transcribing audio... This may take a moment.</p>
                </div>
            }
            <br />
            {analysisLoaded ? 
                <div className='text-body'>{keyPoints}</div> : 
                <div style={{ textAlign: 'center' }}>
                    <SpinningCircles className='loadingIcon' fill='#919191' stroke="transparent" strokeOpacity={.2} speed={1.25} />
                    <p style={{ marginTop: '10px', color: '#666' }}>Generating analysis...</p>
                </div>
            }
            <br />
        </div>  
    );
};  
  
export default TranscribeWhisper;
  