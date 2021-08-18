import { Skeleton } from '@material-ui/lab';
import propTypes from 'prop-types';
import { useState } from 'react';

export const ImagePlaceholder = ({ alt, imageHeight, skeletonHeight, src }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imgHeight, setImgHeight] = useState(0);

    const onImageLoad = () => {
        setImageLoaded(true);
        setImgHeight(imageHeight);
    };

    return (
        <div className='img-placeholder-wrapper'>
            <img
                alt={alt}
                onLoad={onImageLoad}
                src={src}
                style={{
                    height: imgHeight
                }}
            />
            {!imageLoaded && (
                <Skeleton
                    className='image-skeleton'
                    height={skeletonHeight}
                    variant='rect'
                />
            )}
        </div>
    );
};

ImagePlaceholder.defaultProps = {
    alt: 'Image'
};

ImagePlaceholder.propTypes = {
    alt: propTypes.string,
    imageHeight: propTypes.string.isRequired,
    skeletonHeight: propTypes.number.isRequired,
    src: propTypes.string.isRequired
};
