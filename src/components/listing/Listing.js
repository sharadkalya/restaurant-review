import React from "react";
import _ from 'lodash';
import propTypes from 'prop-types';
import { withRouter } from "react-router";
import { Grid, Snackbar, Typography } from '@material-ui/core';
import { AddCircleOutline } from "@material-ui/icons";
import Alert from '@material-ui/lab/Alert';
import { addRestaurant, deleteRestaurant, getRestaurants, updateRestaurant } from "../../firebase/api";
import { ButtonWithIcon, FullScreenLoader } from "../common";
import List from './List';
import { ADMIN, OWNER, PAGE_LIMIT } from "../../constants";
import Sort from "./Sort";
import { mergeRestArr } from "../../helper";
import { withHeader } from "../common/withHeader";
import { RestaurantForm } from "./RestaurantForm";
import Filter from "./Filter";

class Listing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addSuccess: false,
            adding: false,
            endOfList: false,
            errorMsg: '',
            filterBy: '0',
            loading: false,
            newRestaurants: [],
            open: false,
            orderBy: 'desc',
            restaurant: null,
            restaurants: [],
            showFeedback: false
        };
    }

    fetchData = _.debounce(async () => {
        const { endOfList, filterBy, orderBy, newRestaurants, restaurants } = this.state;
        const { currentUser, dataProvider } = this.props;

        if (endOfList) {
            return;
        }

        this.setState({
            loading: true
        });

        try {
            const snapshot = await getRestaurants(dataProvider.last, orderBy, currentUser, filterBy);
            const restArr = snapshot.docs.map(doc => {
                const items = doc.data();
                return { ...items, id: doc.id };
            });
            const last = snapshot.docs[snapshot.docs.length - 1];
            dataProvider.setLast(last);
            this.setState({
                endOfList: restArr.length < PAGE_LIMIT,
                restaurants: mergeRestArr(restaurants, restArr, newRestaurants)
            });
        } catch (e) {
            this.setState({
                errorMsg: 'Error In loading data...'
            });
        } finally {
            this.setState({
                loading: false
            });
        }
    }, 100);

    add = async (data) => {
        const { restaurant, restaurants, newRestaurants } = this.state;
        if (restaurant) {
            this.updateRestaurant(data);
            return;
        }

        const { currentUser } = this.props;
        this.setState({
            adding: true
        });

        try {
            const newRest = {
                ...data,
                averageRating: 0,
                owner: currentUser.uid
            };
            const res = await addRestaurant(newRest);

            newRest.id = res.id;
            this.setState({
                addSuccess: true,
                newRestaurants: [
                    ...newRestaurants,
                    newRest
                ],
                restaurants: [
                    newRest,
                    ...restaurants
                ],
                showFeedback: true
            });
        } catch {
            this.setState({
                addSuccess: false,
                showFeedback: true
            });
        } finally {
            this.setState({
                adding: false,
                showFeedback: true
            });
        }
    };

    updateRestaurant = async (data) => {
        const { restaurant, restaurants } = this.state;
        this.setState({
            adding: true
        });

        try {
            await updateRestaurant(restaurant.id, data);

            this.setState({
                addSuccess: true,
                restaurants: restaurants.map((item) => {
                    if ((item.id).toString() === (restaurant.id).toString()) {
                        return {
                            ...item,
                            ...data
                        };
                    }
                    return item;
                }),
                showFeedback: true
            });
        } catch {
            this.setState({
                addSuccess: false,
                showFeedback: true
            });
        } finally {
            this.setState({
                adding: false,
                restaurant: null,
                showFeedback: true
            });
        }
    };

    onDelete = async (restToBeDeleted) => {
        const { restaurants } = this.state;

        this.setState({
            adding: true
        });

        try {
            await deleteRestaurant(restToBeDeleted.id);

            this.setState({
                addSuccess: true,
                restaurants: restaurants.filter((item) => {
                    return (item.id).toString() !== (restToBeDeleted.id).toString();
                }),
                showFeedback: true
            });
        } catch {
            this.setState({
                addSuccess: false,
                showFeedback: true
            });
        } finally {
            this.setState({
                adding: false,
                showFeedback: true
            });
        }
    };

    onClose = () => {
        this.setState({
            open: false,
            restaurant: null
        });
    }

    componentDidMount() {
        const { history } = this.props;
        const { location } = history;

        if (location && location.state && location.state.previousState) {
            this.setState({
                ...location.state.previousState
            });
        } else {
            const { dataProvider } = this.props;
            dataProvider.setLast(null);
            this.fetchData();
        }
        this.registerScroll();
    }

    onOrderByChange = (e) => {
        const { dataProvider } = this.props;

        dataProvider.setLast(null);
        this.setState({
            endOfList: false,
            errorMsg: '',
            loading: false,
            newRestaurants: [],
            orderBy: e.target.value,
            restaurants: []
        }, () => {
            this.fetchData();
        });
    }

    onScrollEnd = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            this.fetchData();
        }
    }

    registerScroll = () => {
        window.addEventListener('scroll', this.onScrollEnd);
    };

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollEnd);
    }

    closeFeedback = () => {
        this.setState({
            showFeedback: false
        });
    }

    onEdit = (restaurant) => {
        this.setState({
            open: true,
            restaurant
        });
    }

    onFilterChange = (e) => {
        const { dataProvider } = this.props;

        dataProvider.setLast(null);
        this.setState({
            endOfList: false,
            errorMsg: '',
            filterBy: e.target.value,
            loading: false,
            newRestaurants: [],
            restaurants: []
        }, () => {
            this.fetchData();
        });
    }

    render() {
        const {
            adding,
            addSuccess,
            endOfList,
            errorMsg,
            filterBy,
            loading,
            orderBy,
            open,
            restaurant,
            restaurants,
            showFeedback
        } = this.state;
        const { currentUser } = this.props;

        return (
            <div className='listing'>
                <FullScreenLoader
                    isVisible={adding}
                />
                <Snackbar
                    autoHideDuration={6000}
                    onClose={this.closeFeedback}
                    open={showFeedback}
                >
                    <Alert
                        onClose={this.closeFeedback}
                        severity={addSuccess ? 'success' : 'error'}
                    >
                        {
                            addSuccess ?
                                'Restaurant list updated' :
                                'Error in upading restaurant'
                        }
                    </Alert>
                </Snackbar>
                <div className='list-container'>
                    <div className='add-restaurant'>
                        {currentUser.role === OWNER && (
                            <ButtonWithIcon
                                icon={<AddCircleOutline />}
                                label='Add Restaurant'
                                onClick={() => {
                                    this.setState({
                                        open: true
                                    });
                                }}
                            />
                        )}
                    </div >
                    <RestaurantForm
                        add={this.add}
                        onClose={this.onClose}
                        open={open}
                        restaurant={restaurant}
                    />
                    {restaurants.length > 0 ? (
                        <Grid
                            className='rest-filter-container'
                            container
                        >
                            <Grid item>
                                <Sort
                                    onChange={this.onOrderByChange}
                                    orderBy={orderBy}
                                />
                            </Grid>
                            <Grid item >
                                <Filter
                                    filterBy={filterBy}
                                    onChange={this.onFilterChange}
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <>
                            {!loading && (
                                <Typography
                                    variant='body1'
                                >
                                    No restaurants to show at the moment
                                </Typography>
                            )}
                        </>
                    )}
                    <Grid container>
                        <List
                            endOfList={endOfList}
                            isAdmin={currentUser.role === ADMIN}
                            loading={loading}
                            onDelete={this.onDelete}
                            onEdit={this.onEdit}
                            previousState={{
                                addSuccess,
                                endOfList,
                                filterBy,
                                orderBy,
                                restaurants
                            }}
                            restaurants={restaurants}
                        />
                    </Grid>
                    <p className='error-msg'>{errorMsg}</p>
                </div>
            </div>
        );
    }
};

Listing.propTypes = {
    currentUser: propTypes.objectOf(Object).isRequired,
    dataProvider: propTypes.objectOf(Object).isRequired,
    history: propTypes.objectOf(Object).isRequired
};

export default withRouter(withHeader(Listing));
