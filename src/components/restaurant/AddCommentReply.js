import { Button, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import propTypes from 'prop-types';
import { Rating } from "@material-ui/lab";
import { Modal } from "../common";

export const AddCommentReply = (props) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const close = () => {
        setRating(0);
        setComment('');
        setErrorMsg('');
        props.setOpen(false);
    };

    const submit = () => {
        if (props.isRatingRequired && !rating) {
            setErrorMsg(props.errorMessage);
            return;
        }

        if (props.isCommentRequired && !comment) {
            setErrorMsg(props.errorMessage);
            return;
        }

        setErrorMsg('');
        props.add(comment, rating);
        close();
    };

    const { open, showRating, subTitle, title } = props;
    return (
        <Modal
            close={close}
            isOpen={open}
        >
            <div className='add-review-form'>
                <Typography className='add-restaurant-title' variant='h6'>
                    {title}
                </Typography>
                {showRating && (
                    <div className='input-container'>
                        <Rating
                            name="hover-feedback"
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            precision={1}
                            value={rating}
                        />
                    </div>
                )}
                <div className='input-container'>
                    <TextField
                        fullWidth
                        label={subTitle}
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                </div>
                <p className='error-msg'>{errorMsg}</p>
                <div className='add-restaurant-buttons'>
                    <Button
                        color="primary"
                        onClick={submit}
                        variant="contained"
                    >
                        Add
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

AddCommentReply.defaultProps = {
    isCommentRequired: false,
    isRatingRequired: false,
    showRating: false

};

AddCommentReply.propTypes = {
    add: propTypes.func.isRequired,
    errorMessage: propTypes.string.isRequired,
    isCommentRequired: propTypes.bool,
    isRatingRequired: propTypes.bool,
    open: propTypes.bool.isRequired,
    setOpen: propTypes.func.isRequired,
    showRating: propTypes.bool,
    subTitle: propTypes.string.isRequired,
    title: propTypes.string.isRequired
};
