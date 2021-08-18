import {
    IconButton,
    Typography
} from '@material-ui/core';
import propTypes from 'prop-types';

export const ButtonWithIcon = ({ icon, label, onClick }) => {
    return (
        <IconButton
            className='button-with-icon'
            color="inherit"
            onClick={onClick}
        >
            {icon}
            <Typography
                className='button-with-icon-label'
                variant='h6'
            >
                {label}
            </Typography>
        </IconButton>
    );
};

ButtonWithIcon.defaultProps = {
    label: ''
};

ButtonWithIcon.propTypes = {
    icon: propTypes.objectOf(Object).isRequired,
    label: propTypes.string,
    onClick: propTypes.func.isRequired
};
