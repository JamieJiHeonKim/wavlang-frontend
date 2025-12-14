import { useState, useRef, useEffect } from 'react';
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

function AudioPlayer({ file, fileName }) {
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
        // Create WaveSurfer instance with options
        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);

        // Load the audio file
        wavesurfer.current.load(file);

        // When WaveSurfer is ready
        wavesurfer.current.on('ready', () => {
            setVolume(wavesurfer.current.getVolume());
            setDuration(wavesurfer.current.getDuration());
            setAudioFileName(file.split('/').pop());
        });

        // Update current time in state as audio plays
        wavesurfer.current.on('audioprocess', () => {
            setCurrentTime(wavesurfer.current.getCurrentTime());
        });
        
        // Clean up event listeners and destroy instance on unmount
        return () => {
            wavesurfer.current.un('audioprocess');
            wavesurfer.current.un('ready');
            wavesurfer.current.destroy();
        };
    }, [file]);

    // const formatTime = (seconds) => {
    //     let date = new Date(0);
    //     date.setSeconds(seconds);
    //     return date.toISOString().substr(11, 8);
    // }

    // Toggle playback of audio
    const handlePlayPause = () => {
        setPlaying(!playing);
        wavesurfer.current.playPause();
    };

    // Adjust audio volume
    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        wavesurfer.current.setVolume(newVolume);
        setMuted(newVolume === 0);
    };

    // Toggle mute/unmute audio
    const handleMute = () => {
        setMuted(!muted);
        wavesurfer.current.setVolume(muted ? volume : 0);
    };

    // Increase volume by 10%
    const handleVolumeUp = () => {
        handleVolumeChange(Math.min(volume + 0.1, 1));
    };

    // Decrease volume by 10%
    const handleVolumeDown = () => {
        handleVolumeChange(Math.max(volume - 0.1, 0));
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
}

export default AudioPlayer;