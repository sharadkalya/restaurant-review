import React from 'react';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import propTypes from 'prop-types';
import { Rating } from '@material-ui/lab';
import { formatDate } from '../../helper';
import { AddReply } from './AddReply';
import { EditDeleteMenu } from '../common';

export default function Review({ addReply, isAdmin, onDelete, onEdit, review, showPending, showReplyButton }) {
    const add = (comment) => {
        const updatedReview = {
            ...review,
            reply: comment,
            replyDate: Date.now()
        };

        addReply(updatedReview);
    };

    let renderReview = true;

    if (showPending) {
        renderReview = !review.reply;
    }

    return (
        <>
            {renderReview && (
                <ListItem
                    alignItems="flex-start"
                    className='review-list-item'
                >
                    <Grid
                        alignItems='center'
                        container
                    >
                        <Rating
                            readOnly
                            value={review.rating}
                        />
                        {isAdmin && (
                            <EditDeleteMenu
                                onDelete={() => onDelete(review)}
                                onEdit={() => onEdit(review)}
                            />
                        )}
                    </Grid>
                    <ListItemText
                        primary={review.comment || ''}
                        secondary={
                            <>
                                <Typography
                                    className='display-name'
                                    color="textPrimary"
                                    component="span"
                                    variant="body2"
                                >
                                    {`${review.first} ${review.last}`}
                                </Typography>
                                {` - ${formatDate(review.reviewDate)}`}
                            </>
                        }
                    />
                    {(review.reply) ? (
                        <Typography
                            color="textSecondary"
                            component="span"
                            variant="body2"
                        >
                            {review.reply}
                            {` - ${formatDate(review.replyDate)}`}
                        </Typography>
                    ) : (showReplyButton && (
                        <AddReply
                            add={add}
                        />
                    ))}
                </ListItem>
            )}
        </>
    );
}

Review.defaultProps = {
    showPending: false
};

Review.propTypes = {
    addReply: propTypes.func.isRequired,
    isAdmin: propTypes.bool.isRequired,
    onDelete: propTypes.func.isRequired,
    onEdit: propTypes.func.isRequired,
    review: propTypes.objectOf(Object).isRequired,
    showPending: propTypes.bool,
    showReplyButton: propTypes.bool.isRequired
};
