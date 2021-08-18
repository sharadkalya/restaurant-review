import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import propTypes from 'prop-types';

export const EditDeleteMenu = ({ onDelete, onEdit }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="long-menu"
                keepMounted
                onClose={handleClose}
                open={open}
            >
                <MenuItem
                    onClick={() => {
                        handleClose();
                        onEdit();
                    }}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        onDelete();
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>
        </div>
    );
};

EditDeleteMenu.propTypes = {
    onDelete: propTypes.func.isRequired,
    onEdit: propTypes.func.isRequired
};
