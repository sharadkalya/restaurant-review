import { CircularProgress } from "@material-ui/core";
import propTypes from 'prop-types';

export const FullScreenLoader = ({ isVisible, withBg }) => (
    <>
        {isVisible && (
            <div className={`full-screen-loader ${withBg ? 'bg' : ''}`}>
                <div className='full-screen-loader-inner'>
                    <CircularProgress />
                </div>
            </div>
        )}
    </>
);

FullScreenLoader.defaultProps = {
    isVisible: true,
    withBg: false
};

FullScreenLoader.propTypes = {
    isVisible: propTypes.bool,
    withBg: propTypes.bool
};
