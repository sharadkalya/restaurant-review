import { Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import propTypes from 'prop-types';
import { useHistory } from "react-router-dom";
import { ImagePlaceholder } from "../common";

export default function ListItem({ isAdmin, onDelete, onEdit, previousState, restaurant }) {
    const history = useHistory();

    const onClick = () => {
        history.push({
            pathname: `/restaurant/${restaurant.id}`,
            state: {
                previousState,
                restaurant
            }
        });
    };

    return (
        <Grid
            className='listitem'
            item
            lg={3}
            md={4}
            sm={6}
            xs={12}
        >
            <Paper
                className='listitem-paper'
                elevation={3}
            >
                <Typography
                    className='rest-name'
                    color='primary'
                    onClick={onClick}
                    variant='h6'
                >
                    {restaurant.name}
                </Typography>
                <div onClick={onClick}>
                    <ImagePlaceholder
                        alt={restaurant.name}
                        imageHeight='200px'
                        skeletonHeight={190}
                        src={restaurant.imageUrl}
                    />
                </div>
                <Grid
                    alignItems='center'
                    className='rest-rating-and-buttons-container'
                    container
                    justifyContent='space-between'
                >
                    <Rating
                        precision={0.1}
                        readOnly
                        value={restaurant.averageRating}
                    />
                    {isAdmin && (
                        <Grid item>
                            <IconButton
                                className='typography-button'
                                color='primary'
                                onClick={() => onEdit(restaurant)}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton
                                className='typography-button'
                                color='secondary'
                                onClick={() => onDelete(restaurant)}
                            >
                                <Delete />
                            </IconButton>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Grid>
    );
}

ListItem.defaultProps = {
    isAdmin: false
};

ListItem.propTypes = {
    isAdmin: propTypes.bool,
    onDelete: propTypes.func.isRequired,
    onEdit: propTypes.func.isRequired,
    previousState: propTypes.objectOf(Object).isRequired,
    restaurant: propTypes.objectOf(Object).isRequired
};
