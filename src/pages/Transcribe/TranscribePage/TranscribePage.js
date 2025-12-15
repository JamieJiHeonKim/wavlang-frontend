import { useState, useEffect, useMemo } from 'react';
import './TranscribePage.scss';
import AudioPlayer from '../AudioPlayer';
// import Transcribe from '../Whisper/TranscribeWhisper';
import Transcribe from '../AssemblyAI/TranscribeAssembly';
import DropFileInput from '../DropFileInput/DropFileInput';
import Analysis from '../Analysis/Analysis';
import Alert from 'react-bootstrap/Alert';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LoggedOutTranscribePage from '../TranscribePage/LoggedOutTranscribePage';
import { useAuth } from '../../../components/AuthContext/AuthContext';
import Cookies from 'js-cookie';

const languages = [
    {
        label: 'Afrikaans',
        code: 'af'
    },
    {
        label: 'Arabic',
        code: 'ar'
    },
    {
        label: 'Armenian',
        code: 'hy'
    },
    {
        label: 'Azerbaijani',
        code: 'az'
    },
    {
        label: 'Belarusian',
        code: 'be'
    },
    {
        label: 'Bosnian',
        code: 'bs'
    },
    {
        label: 'Bulgarian',
        code: 'bg'
    },
    {
        label: 'Catalan',
        code: 'ca'
    },
    {
        label: 'Chinese',
        code: 'zh'
    },
    {
        label: 'Croatian',
        code: 'hr'
    },
    {
        label: 'Czech',
        code: 'cs'
    },
    {
        label: 'Danish',
        code: 'da'
    },
    {
        label: 'Dutch',
        code: 'nl'
    },
    {
        label: 'English',
        code: 'en'
    },
    {
        label: 'Estonian',
        code: 'et'
    },
    {
        label: 'Finnish',
        code: 'fi'
    },
    {
        label: 'French',
        code: 'fr'
    },
    {
        label: 'Galician',
        code: 'gl'
    },
    {
        label: 'German',
        code: 'de'
    },
    {
        label: 'Greek',
        code: 'el'
    },
    {
        label: 'Hebrew',
        code: 'he'
    },
    {
        label: 'Hindi',
        code: 'hi'
    },
    {
        label: 'Hungarian',
        code: 'hu'
    },
    {
        label: 'Icelandic',
        code: 'is'
    },
    {
        label: 'Indonesian',
        code: 'id'
    },
    {
        label: 'Italian',
        code: 'it'
    },
    {
        label: 'Japanese',
        code: 'ja'
    },
    {
        label: 'Kannada',
        code: 'kn'
    },
    {
        label: 'Kazakh',
        code: 'kk'
    },
    {
        label: 'Korean',
        code: 'ko'
    },
    {
        label: 'Latvian',
        code: 'lv'
    },
    {
        label: 'Lithuanian',
        code: 'lt'
    },
    {
        label: 'Macedonian',
        code: 'mk'
    },
    {
        label: 'Malay',
        code: 'ms'
    },
    {
        label: 'Marathi',
        code: 'mr'
    },
    {
        label: 'Maori',
        code: 'mi'
    },
    {
        label: 'Nepali',
        code: 'ne'
    },
    {
        label: 'Norwegian',
        code: 'no'
    },
    {
        label: 'Persian',
        code: 'fa'
    },
    {
        label: 'Polish',
        code: 'pl'
    },
    {
        label: 'Portuguese',
        code: 'pt'
    },
    {
        label: 'Romanian',
        code: 'ro'
    },
    {
        label: 'Russian',
        code: 'ru'
    },
    {
        label: 'Serbian',
        code: 'sr'
    },
    {
        label: 'Slovak',
        code: 'sk'
    },
    {
        label: 'Slovenian',
        code: 'sl'
    },
    {
        label: 'Spanish',
        code: 'es'
    },
    {
        label: 'Swahili',
        code: 'sw'
    },
    {
        label: 'Swedish',
        code: 'sv'
    },
    {
        label: 'Tagalog',
        code: 'tl'
    },
    {
        label: 'Tamil',
        code: 'ta'
    },
    {
        label: 'Thai',
        code: 'th'
    },
    {
        label: 'Turkish',
        code: 'tr'
    },
    {
        label: 'Ukrainian',
        code: 'uk'
    },
    {
        label: 'Urdu',
        code: 'ur'
    },
    {
        label: 'Vietnamese',
        code: 'vi'
    },
    {
        label: 'Welsh',
        code: 'cy'
    }
];

function TranscribePage() {
    const [file, setFile] = useState(null);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [response, setResponse] = useState(null);
    const [scriptLoaded, setScriptLoaded] = useState(true);
    const [analysisType, setAnalysisType] = useState("Abstract Summary");
    const [transcriptionLoaded, setTranscriptionLoaded] = useState(false);
    const [keyPoints, setKeyPoints] = useState(null);
    const [analysisLoaded, setAnalysisLoaded] = useState(true);
    const [topic, setTopic] = useState(null);
    const [confirmation, setConfirmation] = useState(false);
    const [analysisLanguage, setAnalysisLanguage] = useState('English');
    const { isLoggedIn } = useAuth();

    // Memoize audio URL to prevent AudioPlayer re-renders during transcription
    const audioUrl = useMemo(() => {
        return file ? URL.createObjectURL(file) : null;
    }, [file]);

    // Cleanup audio URL when component unmounts or file changes
    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    // props DropFileInput
    const onFileChange = (file) => {
        console.log(file);
        setFile(file);
        if (file) {
            setFileUploaded(true);
        }
    };

    const onAnalysisChange = (analysisType) => {
        setAnalysisType(analysisType);
        console.log(analysisType);
    }

    const handleTranscribeButton = (e) => {
        e.preventDefault();
        if(file) {
            if (window.confirm('If you are aware of the pricing and would like to proceed further, please click OK')) {
                setConfirmation(true);
            } else {
                setConfirmation(false);
            }
        } else {
            setConfirmation(true);
        }
    }

    const handleOverSizeFile = (audioFile) => {
        if(audioFile.size > 25000000) {
            return(
                <>
                    <Alert key={'danger'} variant={'danger'}>
                        The uploaded file size exceeded Whisper AI's max file size (25MB).
                        Please split the audio file into shorter length.
                    </Alert>
                </>   
            )
        }
        else {
            return(
                <>
                    <h4 className='p-searchbar' style={{ fontWeight: 'bolder' }}>
                        <br />
                        Choose the desired language
                    </h4>
                    <div className='searchbar-autocomplete'>
                        <p className='p-searchbar'><br />Analyze the texts in</p>
                        <Autocomplete 
                            disablePortal
                            className='searchbar'
                            id="searchbar2"
                            options={languages}
                            onChange={(event, newValue) => {
                                setAnalysisLanguage(newValue);
                                console.log('transcription laugnage set to', newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="English" />}
                        />
                    </div>
                    <button type="submit" className="btn appointment-btn" onClick={handleTranscribeButton}>
                        Transcribe
                    </button>
                </>
            )
        }
    }
    
    useEffect(() => {
        console.log("Authentication state changed. isLoggedIn:", isLoggedIn);
        setConfirmation(false);
        const unloadCallback = (event) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
          };
        
          window.addEventListener("beforeunload", unloadCallback);
          return () => window.removeEventListener("beforeunload", unloadCallback);
    }, [file, confirmation, isLoggedIn]);
    
    return (
        <section className='transcribe-section' >
            <div className='transcribe'>
                <h2 className='header'>
                    Transcription & Analysis
                </h2>
                <p>Please Select an Analysis Type & Topic Before Uploading an Audio File</p>
                <div className='main-page' data-aos="fade-up" data-aos-duration="1500">
                    <main className='main-property'>
                        <Analysis 
                            onAnalysisChange={(analysisType) => onAnalysisChange(analysisType)}
                        />
                        <br />
                        <div className='box'>
                            <p>
                                Upload an Audio File for Transcription
                            </p>
                            <DropFileInput 
                                onFileChange={(file) => onFileChange(file)}
                            />
                        </div>
                    { fileUploaded && audioUrl ? <AudioPlayer file={audioUrl} fileName={file.name} /> : <></> }
                    {!isLoggedIn && (
                        <Alert variant="warning" className="login-alert">
                            You must be logged in to use the transcription feature.
                        </Alert>
                    )}
                    <button
                        type="submit"
                        className="btn appointment-btn"
                        onClick={handleTranscribeButton}
                        disabled={!isLoggedIn} // Disable button if not logged in
                    >
                        Transcribe
                    </button>
                    {/* { file ? handleOverSizeFile(file) : null} */}
                    { confirmation ? <Transcribe file={file} analysisType={analysisType} topic={topic} analysisLanguage={analysisLanguage} /> : <Transcribe /> }
                    </main>
                </div>
            </div>
        </section>
    )
}

export default TranscribePage;