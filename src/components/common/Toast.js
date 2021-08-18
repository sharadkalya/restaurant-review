import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import propTypes from 'prop-types';

export const Toast = ({ errorMsg, setShowFeedback, showFeedback, success, successMsg }) => {
    return (

        <Snackbar
            autoHideDuration={6000}
            onClose={() => setShowFeedback(false)}
            open={showFeedback}
        >
            <Alert
                onClose={() => setShowFeedback(false)}
                severity={success ? 'success' : 'error'}
            >
                {
                    success ?
                        successMsg :
                        errorMsg
                }
            </Alert>
        </Snackbar>
    );
};

Toast.defaultProps = {
    errorMsg: 'Error',
    successMsg: 'Success'
};

Toast.propTypes = {
    errorMsg: propTypes.string,
    setShowFeedback: propTypes.func.isRequired,
    showFeedback: propTypes.bool.isRequired,
    success: propTypes.bool.isRequired,
    successMsg: propTypes.string
};
