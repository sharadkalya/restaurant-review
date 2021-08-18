import { Button, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import propTypes from 'prop-types';
import { validateEmail } from "../../helper";
import { FileUpload, Modal } from "../common";

export const RestaurantForm = ({ add, onClose, open, restaurant }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [titles, setTitles] = useState({
        heading: 'Add Restaurant',
        submitButton: 'Add'
    });

    const [errorMsg, setErrorMsg] = useState('');

    const close = () => {
        setName('');
        setEmail('');
        setAddress('');
        setErrorMsg('');
        onClose(false);
    };

    const submit = () => {
        if (!name || !address || !email) {
            setErrorMsg('Please fill in all the details');
            return;
        }

        if (!validateEmail(email)) {
            setErrorMsg('Invalid email address');
            return;
        }

        setErrorMsg('');
        add({
            address,
            email,
            imageUrl: imageUrl || '',
            name
        });
        close();
    };

    useEffect(() => {
        if (restaurant) {
            setName(restaurant.name);
            setEmail(restaurant.email);
            setAddress(restaurant.address);
            setImageUrl(restaurant.imageUrl);
            setTitles({
                heading: 'Edit Restaurant',
                submitButton: 'Update'
            });
        }
    }, [restaurant]);

    return (
        <Modal
            close={close}
            isOpen={open}
        >
            <div className='add-restaurant-form'>
                <Typography className='add-restaurant-title' variant='h6'>
                    {titles.heading}
                </Typography>
                <FileUpload
                    setUrl={setImageUrl}
                />
                <div className='input-container'>
                    <TextField
                        fullWidth
                        label='Name'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>
                <div className='input-container'>
                    <TextField
                        fullWidth
                        label='Email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className='input-container'>
                    <TextField
                        fullWidth
                        label='Address'
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                    />
                </div>
                <p className='error-msg'>{errorMsg}</p>
                <div className='add-restaurant-buttons'>
                    <Button
                        color="primary"
                        onClick={submit}
                        variant="contained"
                    >
                        {titles.submitButton}
                    </Button>
                    <Button
                        color="secondary"
                        onClick={close}
                        variant="contained"
                    >
                        Cancel
                    </Button>

                </div>
            </div>
        </Modal>
    );
};

RestaurantForm.defaultProps = {
    restaurant: null
};

RestaurantForm.propTypes = {
    add: propTypes.func.isRequired,
    onClose: propTypes.func.isRequired,
    open: propTypes.bool.isRequired,
    restaurant: propTypes.objectOf(Object)
};
