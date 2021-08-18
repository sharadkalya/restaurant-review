import { Button, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import propTypes from 'prop-types';
import { Rating } from "@material-ui/lab";
import { Modal } from "../common";

export const EditCommentReply = (props) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reply, setReply] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { open, review } = props;

    const close = () => {
        setRating(0);
        setComment('');
        setErrorMsg('');
        setReply('');
        props.setOpen(false);
    };

    const submit = () => {
        setErrorMsg('');
        props.update(comment, rating, reply);
        close();
    };

    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setComment(review.comment);
            setReply(review.reply);
        }
    }, [review]);

    return (
        <Modal
            close={close}
            isOpen={open}
        >
            <div className='add-review-form'>
                <Typography className='add-restaurant-title' variant='h6'>
                    Edit Review
                </Typography>
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
                <div className='input-container'>
                    <TextField
                        fullWidth
                        label='Comment'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                </div>
                {(review && review.reply) && (
                    <div className='input-container'>
                        <TextField
                            fullWidth
                            label='Reply'
                            onChange={(e) => setReply(e.target.value)}
                            value={reply}
                        />
                    </div>
                )}
                <p className='error-msg'>{errorMsg}</p>
                <div className='add-restaurant-buttons'>
                    <Button
                        color="primary"
                        onClick={submit}
                        variant="contained"
                    >
                        Update
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

EditCommentReply.propTypes = {
    open: propTypes.bool.isRequired,
    review: propTypes.objectOf(Object).isRequired,
    setOpen: propTypes.func.isRequired,
    update: propTypes.func.isRequired
};
