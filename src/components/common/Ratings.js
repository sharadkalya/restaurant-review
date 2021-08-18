import { Star } from '@material-ui/icons';
import propTypes from 'prop-types';

export default function Ratings({ rating }) {
    const stars = [];
    let r = 0;
    while (r < rating) {
        stars.push(<Star className='star' key={r} />);
        r += 1;
    }
    return (
        <div className='ratings'>
            {stars}
        </div>
    );
};

Ratings.defaultProps = {
    rating: 0
};

Ratings.propTypes = {
    rating: propTypes.number
};
