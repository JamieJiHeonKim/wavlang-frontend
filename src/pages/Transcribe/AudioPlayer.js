import { useState, useRef, useEffect, memo } from 'react';
import './AudioPlayer.scss';
import WaveSurfer from 'wavesurfer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlay,
    faPause,
    faVolumeUp,
    faVolumeDown,
    faVolumeMute,
    faVolumeOff
} from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as PlayPause } from '../../assets/transcription/playpause-fill-22.svg';

const formWaveSurferOptions = (ref) => ({
    container: ref,
    waveColor: '#ccc',
    progressColor: '#0178ff',
    cursorColor: 'transparent',
    responsive: true,
    height: 80,
    normalize: true,
    backend: 'WebAudio',
    barWidth: 2,
    barGap: 3,
});

function formatTime(seconds) {
    let date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

const AudioPlayer = memo(({ file, fileName }) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioFileName, setAudioFileName] = useState('');
    const [audioFile, setAudioFile] = useState(null)

    useEffect(() => {
        let isActive = true;
        let ws = null;
        
        const initWavesurfer = async () => {
            try {
                const options = formWaveSurferOptions(waveformRef.current);
                ws = WaveSurfer.create(options);
                wavesurfer.current = ws;

                ws.on('error', (error) => {
                    if (!isActive) return;
                    
                    if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
                        return;
                    }
                    console.error('WaveSurfer error:', error);
                });

                ws.on('ready', () => {
                    if (isActive) {
                        setVolume(ws.getVolume());
                        setDuration(ws.getDuration());
                        setAudioFileName(file.split('/').pop());
                    }
                });

                ws.on('audioprocess', () => {
                    if (isActive) {
                        setCurrentTime(ws.getCurrentTime());
                    }
                });

                ws.load(file);
            } catch (error) {
                if (isActive && error?.name !== 'AbortError') {
                    console.error('Error initializing WaveSurfer:', error);
                }
            }
        };

        initWavesurfer();
        
        return () => {
            isActive = false;
            
            if (ws) {
                try {
                    if (ws.isPlaying && ws.isPlaying()) {
                        ws.pause();
                    }
                    
                    ws.unAll();
                    
                    if (ws.empty) {
                        ws.empty();
                    }
                    
                    wavesurfer.current = null;
                } catch (e) {
                }
            }
        };
    }, [file]);

    // const formatTime = (seconds) => {
    //     let date = new Date(0);
    //     date.setSeconds(seconds);
    //     return date.toISOString().substr(11, 8);
    // }

    const handlePlayPause = () => {
        try {
            if (wavesurfer.current) {
                setPlaying(!playing);
                wavesurfer.current.playPause();
            }
        } catch (e) {
        }
    };

    const handleVolumeChange = (newVolume) => {
        try {
            if (wavesurfer.current) {
                setVolume(newVolume);
                wavesurfer.current.setVolume(newVolume);
                setMuted(newVolume === 0);
            }
        } catch (e) {
        }
    };

    const handleMute = () => {
        try {
            if (wavesurfer.current) {
                setMuted(!muted);
                wavesurfer.current.setVolume(muted ? volume : 0);
            }
        } catch (e) {
        }
    };

    const handleVolumeUp = () => {
        try {
            if (wavesurfer.current) {
                handleVolumeChange(Math.min(volume + 0.1, 1));
            }
        } catch (e) {
        }
    };

    const handleVolumeDown = () => {
        try {
            if (wavesurfer.current) {
                handleVolumeChange(Math.max(volume - 0.1, 0));
            }
        } catch (e) {
        }
    };

    return (

        <div id='waveform' ref={waveformRef} style={{ width: '100%' }}>
            <div className='controls'>

                {/* Play/Pause button */}
                <button onClick={handlePlayPause} style={{ marginTop: '5px' }}>
                    <PlayPause />
                </button>

                {/* Volumn slider */}
                <input 
                    type='range'
                    id='volume'
                    name='volume'
                    min='0'
                    max='1'
                    step='0.05'
                    value={ muted ? 0 : volume }
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                />

                {/* Volume Down button */}
                <button onClick={handleVolumeDown}>
                    <FontAwesomeIcon icon={ faVolumeDown } />
                </button>

                {/* Volume Up button */}
                <button onClick={handleVolumeUp}>
                    <FontAwesomeIcon icon={ faVolumeUp } />
                </button>

                {/* Mute/Unmute button */}
                <button onClick={handleMute}>
                    <FontAwesomeIcon icon={ muted ? faVolumeOff : faVolumeMute } />
                </button>
            </div>
            <div className='audio-info'>
                {/* Audio file name and current play time */}
                <span>
                    Playing: {fileName} <br />
                </span>
                <span>
                    Current Time:{' '} {formatTime(currentTime)} | Duration: {formatTime(duration)}
                    <br />
                </span>
                <span>
                    Volumn: {Math.round(volume * 100)}%
                </span>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    // Only re-render if file or fileName actually changes
    return prevProps.file === nextProps.file && prevProps.fileName === nextProps.fileName;
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;