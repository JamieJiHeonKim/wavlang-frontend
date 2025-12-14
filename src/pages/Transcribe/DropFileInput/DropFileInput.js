import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';

import './DropFileInput.scss';

import { AudioConfig } from '../../Config/AudioConfig'; 
import uploadImg from '../../../assets/transcription/cloud-upload-regular-240.png';
import trashBinImg from '../../../assets/transcription/delete-trash-96.png';

const DropFileInput = props => {
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(null);
    const [fileUploaded, setFileUploaded] = useState(false);
    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    // Task 1: Make sure the file size doesn't go over 25MB. If so, split the length.

    const onChangeFile = (e) => {
        const newFile = e.target.files[0]
        if(newFile) {
            setFile(newFile);
            setFileUploaded(true);
            
        } else {
            setFileUploaded(false);
        }
        props.onFileChange(newFile);
    };
            

    const fileRemove = () => {
        setFile(null);
        setFileUploaded(false);
        props.onFileChange(file);
    }

    const handleOverSizeFile = (audioFile) => {
        if(audioFile.size > 25000000) {
            return(
                <Alert key={'danger'} variant={'danger'}>
                    The uploaded file size exceeded Whisper AI's max file size (25MB).
                    Please split the audio file into shorter length.
                </Alert>
            )
        }
        else {
            <div className="drop-file-preview">
                { <div className="drop-file-preview__item">
                    <img src={AudioConfig['audio']} alt="" className='file' />
                    <div className="drop-file-preview__item__info">
                        <p className='p'>{file.name}</p>
                    </div>
                    <span className="drop-file-preview__item__del" onClick={() => fileRemove(file)}>
                        <img src={trashBinImg} className='trash-bin' />
                    </span>
                </div> }
            </div>
        }
    }
    
    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Drag & Drop your files here</p>
                </div>
                <input className='dropzone' value="" type="file" accept=".mp3" onChange={onChangeFile}/>
            </div>
            {
                file ? (
                    <div className="drop-file-preview">
                        { <div className="drop-file-preview__item">
                                    <img src={AudioConfig['audio']} alt="" className='file' />
                                    <div className="drop-file-preview__item__info">
                                        <p className='p'>{file.name}</p>
                                    </div>
                                    <span className="drop-file-preview__item__del" onClick={() => fileRemove(file)}>
                                        <img src={trashBinImg} className='trash-bin' />
                                    </span>
                                </div> }
                    </div>
                ) : null
            }
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;