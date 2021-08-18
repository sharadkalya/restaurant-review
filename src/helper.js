export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const mergeRestArr = (existingItems, upcomingItems, newlyAddedItems) => {
    if (newlyAddedItems.length === 0) {
        return [
            ...existingItems,
            ...upcomingItems
        ];
    }
    const newItemsToMerge = upcomingItems.filter((upcomingRes) => {
        return newlyAddedItems.some((newRes) => newRes.id !== upcomingRes.id);
    });

    return [
        ...existingItems,
        ...newItemsToMerge
    ];
};

export const formatDate = (d) => {
    const dt = new Date(d);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let formattedDate = months[dt.getMonth()];
    formattedDate += ` ${dt.getDate()}`;
    formattedDate += `, ${dt.getFullYear()}`;

    return formattedDate;
};

export const orderReviews = (reviews, order) => {
    const key = order === 'latest' ? 'reviewDate' : 'rating';
    const sortedReviews = reviews.sort((a, b) => {
        if (a[key] < b[key]) {
            if (order !== 'asc') {
                return 1;
            }
            return -1;
        }
        if (a[key] > b[key]) {
            if (order !== 'asc') {
                return -1;
            }
            return 1;
        }
        return 0;
    });

    return sortedReviews;
};

export const getAverageRating = (reviewsArr) => {
    return reviewsArr.reduce((acc, currVal) => acc + currVal.rating, 0) / reviewsArr.length;
};

export const showAddReview = (reviewsArr, userId) => {
    const showReview = reviewsArr.some((review) => review.userId.toString() === userId.toString());

    return !showReview;
};

export const updatePreviousStateRestaurants = (previousState, reviews, averageRating, id) => {
    if (!previousState) {
        return null;
    }

    return {
        ...previousState,
        restaurants: previousState.restaurants.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    averageRating,
                    reviews
                };
            }
            return item;
        })
    };
};
