import { CircularProgress, Grid } from "@material-ui/core";
import propTypes from 'prop-types';
import ListItem from "./ListItem";

export default function List({ endOfList, isAdmin, onDelete, onEdit, loading, previousState, restaurants }) {
    return (
        <Grid
            container
            spacing={2}
        >

            {restaurants.map((restaurant) => (
                <ListItem
                    isAdmin={isAdmin}
                    key={restaurant.id}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    previousState={previousState}
                    restaurant={restaurant}
                />
            ))}

            {!endOfList && (
                <Grid
                    className='list-loader'
                    container
                    justifyContent='center'
                >
                    {loading && (<CircularProgress />)}
                </Grid>

            )}
        </Grid>
    );
}

List.defaultProps = {
    endOfList: false,
    isAdmin: false,
    loading: false,
    previousState: {}
};

List.propTypes = {
    endOfList: propTypes.bool,
    isAdmin: propTypes.bool,
    loading: propTypes.bool,
    onDelete: propTypes.func.isRequired,
    onEdit: propTypes.func.isRequired,
    previousState: propTypes.objectOf(Object),
    restaurants: propTypes.arrayOf(Object).isRequired
};
