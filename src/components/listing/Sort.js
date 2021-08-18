import {
    FormControl,
    InputLabel,
    NativeSelect
} from "@material-ui/core";
import propTypes from 'prop-types';

export default function Sort({ filterFor, onChange, orderBy }) {
    return (
        <FormControl className='filter sort-by'>
            <InputLabel className='sort-by-label'>Sort By</InputLabel>
            <NativeSelect
                onChange={onChange}
                value={orderBy}
            >
                {filterFor === 'reviews' && (
                    <option value='latest'>Latest first</option>
                )}
                <option value='desc'>Highest ratings first</option>
                <option value='asc'>Lowest ratings first</option>
            </NativeSelect>
        </FormControl>
    );
};

Sort.defaultProps = {
    filterFor: 'restaurants',
    orderBy: 'desc'
};

Sort.propTypes = {
    filterFor: propTypes.string,
    onChange: propTypes.func.isRequired,
    orderBy: propTypes.string
};
