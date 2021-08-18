import { Checkbox, FormControlLabel, Grid, List } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ArrowBack } from "@material-ui/icons";
import { useHistory, useLocation, useParams } from "react-router";
import { AuthContext } from "../../Auth";
import { FullScreenLoader, ImagePlaceholder, Toast, withHeader } from "../common";
import { AddReview } from "./AddReview";
import { addReview, getRestaurant, updateAverageRating, updateReview } from "../../firebase/api";
import Sort from "../listing/Sort";
import Review from "./Review";
import { getAverageRating, orderReviews, showAddReview, updatePreviousStateRestaurants } from "../../helper";
import { EditCommentReply } from "./EditCommentReply";
import { ADMIN, OWNER, USER } from "../../constants";
import { RestDetails } from "./RestDetails";

function Restaurant() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [orderBy, setOrderBy] = useState('latest');
    const [reviews, setReviews] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [showEdit, setShowEdit] = useState(false);
    const [reviewToBeEdited, setReviewToBeEdited] = useState(null);
    const [showAddRevButton, setShowAddRevButton] = useState(false);
    const [previousState, setPreviousState] = useState(null);
    const [showPending, setShowPending] = useState(false);
    const history = useHistory();

    const authContext = useContext(AuthContext);
    const { currentUser } = authContext;

    const { id } = useParams();

    const submit = async (comment, rating) => {
        setLoading(true);
        const review = {
            comment,
            first: currentUser.first,
            last: currentUser.last,
            rating,
            reviewDate: Date.now(),
            userId: currentUser.uid
        };

        try {
            await addReview(id, review);
            setAddSuccess(true);
            const updatedReviews = [
                review,
                ...reviews
            ];
            setReviews(updatedReviews);
            const avR = getAverageRating(updatedReviews);
            setAverageRating(avR);
            updateAverageRating(id, avR);
            setShowAddRevButton(false);
            setPreviousState(updatePreviousStateRestaurants(previousState, updatedReviews, avR, id));
        } catch {
            setAddSuccess(false);
        } finally {
            setShowFeedback(true);
            setLoading(false);
        }
    };

    const fetchRestaurant = async () => {
        setLoading(true);
        try {
            const res = await getRestaurant(id);
            const response = res.data();
            if (response) {
                setRestaurant(response);
                if (response.reviews) {
                    if (currentUser.role === OWNER && currentUser.uid.toString() !== response.owner.toString()) {
                        history.replace('/');
                    }

                    setReviews(orderReviews(response.reviews, orderBy));
                    setAverageRating(getAverageRating(response.reviews));
                    setShowAddRevButton(showAddReview(response.reviews, currentUser.uid));
                } else {
                    setShowAddRevButton(true);
                }
            } else {
                history.replace('/');
            }
        } catch (error) {
            setShowFeedback(true);
            setAddSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state) {
            const { previousState: prevState, restaurant: rest } = location.state;

            setPreviousState(prevState);
            setRestaurant(rest);
            if (rest.reviews) {
                setReviews(orderReviews(rest.reviews, orderBy));
                setAverageRating(getAverageRating(rest.reviews));
                setShowAddRevButton(showAddReview(rest.reviews, currentUser.uid));
            } else {
                setShowAddRevButton(true);
            }
        } else {
            fetchRestaurant();
        }
    }, []);

    history.block((loc, action) => {
        if (action === 'POP') {
            history.replace('/', { previousState });
        }
    });

    const changeOrderBy = (e) => {
        const order = e.target.value;
        setOrderBy(order);
        setReviews(orderReviews(reviews, order));
    };

    const addReply = async (updatedReview, isDelete, reviewsArr) => {
        const reviewsList = reviewsArr || restaurant.reviews;
        setLoading(true);
        try {
            await updateReview(id, updatedReview, reviewsList, isDelete);
        } catch {
            setShowFeedback(true);
            setAddSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const onEdit = (editReview) => {
        setReviewToBeEdited(editReview);
        setShowEdit(true);
    };

    const onDelete = (deleteReview) => {
        const updatedReviews = reviews.filter((singleReview) => {
            return deleteReview.reviewDate !== singleReview.reviewDate;
        });
        addReply(deleteReview, true, updatedReviews);
        setReviews(updatedReviews);
    };

    const update = (com, rating, reply) => {
        const updatedReview = {
            ...reviewToBeEdited,
            comment: com || '',
            rating,
            reply: reply || ''
        };

        addReply(updatedReview);
    };

    return (
        <div className='restaurant-details'>
            <FullScreenLoader
                isVisible={loading}
            />
            <Toast
                errorMsg='Connection error'
                setShowFeedback={setShowFeedback}
                showFeedback={showFeedback}
                success={addSuccess}
                successMsg='Review added'
            />
            {restaurant && (
                <>
                    <div className='restaurant-image-wrapper'>
                        <Link
                            className='link-container'
                            to={{
                                pathname: '/',
                                state: { previousState }
                            }}
                        >
                            <ArrowBack />
                            <span>View All Restaurants</span>
                        </Link>
                        <ImagePlaceholder
                            alt={restaurant.name}
                            imageHeight='auto'
                            skeletonHeight={200}
                            src={restaurant.imageUrl}
                        />
                    </div>
                    <EditCommentReply
                        open={showEdit}
                        review={reviewToBeEdited}
                        setOpen={setShowEdit}
                        update={update}
                    />
                    <RestDetails
                        averageRating={averageRating}
                        restaurant={restaurant}
                    />
                    <Grid>
                        {(currentUser.role === USER && showAddRevButton) && (
                            <AddReview
                                add={submit}
                            />
                        )}
                    </Grid>
                    {reviews.length > 0 && (
                        <div className='reviews-filter-container'>
                            <Sort
                                filterFor='reviews'
                                onChange={changeOrderBy}
                                orderBy={orderBy}
                            />
                            {currentUser.role === OWNER && (
                                <div className='pending-review-wrapper'>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={showPending}
                                                color="primary"
                                                onChange={(e) => setShowPending(e.target.checked)}
                                            />
                                        }
                                        label='Pending reviews'
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <List>
                        {reviews.map((review) => (
                            <Review
                                addReply={addReply}
                                isAdmin={currentUser.role === ADMIN}
                                key={review.reviewDate}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                review={review}
                                showPending={showPending}
                                showReplyButton={currentUser.uid === restaurant.owner}
                            />
                        ))}
                    </List>
                </>
            )}
        </div >
    );
}

export default withHeader(Restaurant);
