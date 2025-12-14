import { useState, useRef, useEffect } from 'react';
import './Uploader.scss';
import {  MdCloudUpload, MdDelete} from 'react-icons/md';
import { AiFillFileImage } from 'react-icons/ai';

function Uploader() {
    const inputRef = useRef();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No File Selected");

    const onChangeFile = () => {
        setFile(inputRef.current.files[0]);
    };

    useEffect(() => {
        uploadAudioFile();
    }, [file]);

    const uploadAudioFile = () => {
        if(!file) {
            return;
        };
    }
    
    return (
        <div>
            <main>
                <form action="" onClick={() => document.querySelector(".input-field").click()}>
                    <input type="file" accept=".mp3" className='input-field' hidden
                        onChange={({ target: {files} }) => {
                            files[0] && setFileName(files[0].name)
                            if(files && files.length > 0) {
                                setFile(URL.createObjectURL(files[0]));
                            }
                        }}
                    />
                    {file ?
                        <input src={file} width={150} height={150} alt={fileName} />
                        :
                        <>
                            <MdCloudUpload color='1475cf' size={60} />
                            <p>Browse to Upload an Audio File</p>
                        </>
                    }
                </form>
                <section className='uploaded-row'>
                    <AiFillFileImage color='#1475cf' />
                    <span className='uploaded-content'>
                        {fileName}
                        {/* Warn the user and confirm if they want to delete the file uploaded previously */}
                        <MdDelete className='delete-button'
                            onClick={() => {
                                setFileName("No File Selected");
                                setFile(null);
                            }}
                        />

                    </span>
                </section>
            </main>
        </div>
    )
}

export default Uploader;