import React, { useState } from "react";
import { LinearProgress, Typography } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import { CloudUpload } from '@material-ui/icons';
import propTypes from 'prop-types';
import { uploadImage } from "../../firebase/api";

export const FileUpload = ({ setUrl }) => {
    const [name, setName] = useState('');
    const [progress, setProgress] = useState(0);

    const handleUpload = (e) => {
        if (e.target.files[0]) {
            setName(e.target.files[0].name);
            try {
                uploadImage(e.target.files[0], setProgress, setUrl);
            } catch (error) {
                /* eslint no-console: 0 */
                console.log(`Error in uploading file`, error);
            }
        }
    };

    return (
        <div className='file-upload-container'>
            <label className='file-upload-label' htmlFor='file-upload-input'>
                <input
                    accept="image/*"
                    className='file-upload-input'
                    id='file-upload-input'
                    onChange={handleUpload}
                    type='file'
                />
                <Button
                    color="default"
                    component="span"
                    startIcon={<CloudUpload />}
                    variant="contained"
                >
                    Upload Restaurant Image
                </Button>
                <Typography>{name}</Typography>
            </label>
            <LinearProgress
                value={progress}
                variant="determinate"
            />
        </div>
    );
};

FileUpload.propTypes = {
    setUrl: propTypes.func.isRequired
};
