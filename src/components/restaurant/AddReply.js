import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import propTypes from 'prop-types';
import { AddCommentReply } from './AddCommentReply';

export const AddReply = ({ add }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Typography
                className='typography-button'
                color='primary'
                onClick={() => setOpen(true)}
            >
                Reply
            </Typography>
            <AddCommentReply
                add={add}
                errorMessage='Please enter reply'
                isCommentRequired
                open={open}
                setOpen={setOpen}
                subTitle='Reply'
                title='Add Your Reply'
            />

        </>
    );
};

AddReply.propTypes = {
    add: propTypes.func.isRequired
};
