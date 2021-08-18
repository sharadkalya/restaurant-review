import React from 'react';
import { Modal as MaterialModal } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import propTypes from 'prop-types';

export const Modal = ({ children, close, isOpen }) => {
    return (
        <div>
            <MaterialModal
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
                className='material-modal'
                closeAfterTransition
                onClose={() => close(false)}
                open={isOpen}
            >
                <Fade
                    className='material-modal-fade'
                    in={isOpen}
                >
                    <div className='material-modal-content'>
                        <div className='material-modal-inner'>
                            {children}
                        </div>
                    </div>
                </Fade>
            </MaterialModal>
        </div>
    );
};

Modal.propTypes = {
    children: propTypes.node.isRequired,
    close: propTypes.func.isRequired,
    isOpen: propTypes.bool.isRequired
};
