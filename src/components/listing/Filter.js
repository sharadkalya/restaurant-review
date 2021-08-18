import {
    FormControl,
    InputLabel,
    NativeSelect
} from "@material-ui/core";
import propTypes from 'prop-types';

export default function Filter({ onChange, filterBy }) {
    return (
        <FormControl className='filter rest-filters'>
            <InputLabel className='sort-by-label'>Filter</InputLabel>
            <NativeSelect
                onChange={onChange}
                value={filterBy}
            >
                <option value={0}>Show All Restaurants</option>
                <option value={4}>Rated 4 and above</option>
                <option value={3}>Rated 3 and above</option>
                <option value={2}>Rated 2 and above</option>
                <option value={1}>Rated 1 and above</option>
            </NativeSelect>
        </FormControl>
    );
};

Filter.defaultProps = {
    filterBy: '0'
};

Filter.propTypes = {
    filterBy: propTypes.string,
    onChange: propTypes.func.isRequired
};
