import { Grid, Typography } from '@material-ui/core';
import { LocationOn, MailOutline } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import propTypes from 'prop-types';

export const RestDetails = ({ averageRating, restaurant }) => {
    return (
        <Grid className='single-rest-details'>
            <Typography
                className='single-rest-name'
                variant='h5'
            >
                {restaurant.name}
            </Typography>
            <Grid className='single-rest-address'>
                <LocationOn />
                <Typography
                    color="textPrimary"
                    variant="body2"
                >
                    {restaurant.address || ''}
                </Typography>
            </Grid>
            <Grid className='single-rest-email'>
                <MailOutline />
                <Typography
                    className='single-rest-email-text'
                    color="textPrimary"
                    variant="body2"
                >
                    {restaurant.email || ''}
                </Typography>
            </Grid>
            <Grid className='single-rest-rating'>
                <Rating
                    precision={0.1}
                    readOnly
                    value={averageRating}
                />
            </Grid>
        </Grid>
    );
};

RestDetails.propTypes = {
    averageRating: propTypes.number.isRequired,
    restaurant: propTypes.objectOf(Object).isRequired
};
