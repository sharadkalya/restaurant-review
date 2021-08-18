import { AddCircleOutline } from "@material-ui/icons";
import { useState } from "react";
import propTypes from 'prop-types';
import { ButtonWithIcon } from "../common";
import { AddCommentReply } from "./AddCommentReply";

export const AddReview = ({ add }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className='add-review'>
            <ButtonWithIcon
                icon={<AddCircleOutline />}
                label='Add Review'
                onClick={() => setOpen(true)}
            />
            <AddCommentReply
                add={add}
                errorMessage='Please provide rating'
                isCommentRequired={false}
                isRatingRequired
                open={open}
                setOpen={setOpen}
                showRating
                subTitle='Comment'
                title='Add Review'
            />
        </div >
    );
};

AddReview.propTypes = {
    add: propTypes.func.isRequired
};
