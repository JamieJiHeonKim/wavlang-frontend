import { React, useEffect, useState } from 'react';
import axios from 'axios';
import OpenAI from 'openai';
import { Puff, Bars, Circles, Rings, SpinningCircles, Audio, BallTriangle, Grid, Hearts, Oval, TailSpin, ThreeDots } from 'react-loading-icons';

const apiKey = process.env.REACT_APP_ASSEMBLY_API_KEY;

function TranscribeAssemblyAI({file, topic, analysisType, analysisLanguage}) {
    // Task: add Transcription and Analysis Header for each content displayed on the bottom of the screen
    const [result, setResult] = useState(null);
    const [isDone, setIsDone] = useState(false);
    const [response, setResponse] = useState(null);
    const [keyPoints, setKeyPoints] = useState(null);
    const [scriptLoaded, setScriptLoaded] = useState(true);
    const [analysisLoaded, setAnalysisLoaded] = useState(true);

    const openAIApiKey = process.env.REACT_APP_API_KEY;
    const openai = new OpenAI({
        apiKey: openAIApiKey,
        dangerouslyAllowBrowser: true
    });

    useEffect(() => {
        if (!file) {
            return;
        }
        run();
    }, [file])

    const run = async () => {
        const formData = new FormData();
        formData.append('audioFile', file);
        try {
            const response = await fetch(`http://localhost:8080/api/transcribe_assemblyai`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const res = await response.json()
                setIsDone(true);
                setResult(res.transcriptionResult.text);
                console.log(res.transcriptionResult.text);
                console.log('res:', res);
                console.log("topicType:", topic);
                setResponse(res.transcriptionResult.text);
                setAnalysisLoaded(false);
                setScriptLoaded(true);
                getAnalysisType(res.transcriptionResult.text, topic);
            } else {
                console.error('Transcription failed:', response);
                setScriptLoaded(true);
            }
        } catch (error) {
            console.error('Error submitting audio file:', error);
            setScriptLoaded(true);
        }
    };

    const getAnalysisType = async (result, topicType) => {        
        if(analysisType === 'Abstract Summary'){
            abstract_summary_extraction(result, topicType);
        } else if(analysisType === 'Key Points'){
            key_points_extraction(result, topicType);
        } else if(analysisType === 'Action Items'){
            action_item_extraction(result, topicType);
        } else {
            sentiment_analysis(result, topicType);
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

    return(
        <div className='transcribe'>
            <br />
            {scriptLoaded ? 
                <div className='text-body'>
                    {response}
                </div> : 
                <SpinningCircles className='loadingIcon' fill='#919191' stroke="transparent" strokeOpacity={.2} speed={1.25} />}
            <br />
            {analysisLoaded ? <div className='text-body'>{keyPoints}</div> : <SpinningCircles className='loadingIcon' fill='#919191' stroke="transparent" strokeOpacity={.2} speed={1.25} />}
            <br />
        </div>
    )
}

export default TranscribeAssemblyAI;
