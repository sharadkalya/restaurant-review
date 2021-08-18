/* eslint no-console: 0 */
/* eslint no-param-reassign: 0 */

import { OWNER, PAGE_LIMIT } from '../constants';
import { firebaseApp, firebase, firestore, storage } from './index';

export const setUserInStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUsers = async () => {
    try {
        const snapshot = await firestore.collection('users').get();

        return Promise.resolve(snapshot);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteUsersApi = async (userIds, prevSnapshot) => {
    try {
        const batch = firestore.batch();

        prevSnapshot.forEach((doc) => {
            if (userIds.includes(doc.id)) {
                batch.delete(doc.ref);
            }
        });

        const delRes = await batch.commit();

        return Promise.resolve(delRes);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateUsersApi = async (updateData) => {
    try {
        const batch = firestore.batch();

        Object.keys(updateData).forEach((key) => {
            const keyRef = firestore.collection('users').doc(key);
            batch.update(keyRef, updateData[key]);
        });

        const updateRes = await batch.commit();

        return Promise.resolve(updateRes);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getRestaurants = async (last, orderBy = 'desc', currentUser, filterBy = 0) => {
    try {
        let dbref = firestore.collection('restaurants')
            .orderBy('averageRating', orderBy)
            .limit(PAGE_LIMIT);

        const avR = Number(filterBy);

        if (filterBy > 0) {
            dbref = dbref.where('averageRating', '>=', avR);
        }

        if (currentUser.role === OWNER) {
            dbref = dbref.where(OWNER, '==', currentUser.uid);
        }

        if (last) {
            dbref = dbref.startAfter(last);
        }

        const snapshot = await dbref.get();

        return Promise.resolve(snapshot);
    } catch (e) {
        console.log(e);
        return Promise.reject(e);
    }
};

export const getUser = async (email, password) => {
    try {
        const data = await firebaseApp.auth().signInWithEmailAndPassword(email, password);
        const userData = await firestore.collection('users').doc(data.user.uid).get();
        const userDetails = userData.data();
        if (userDetails.email) {
            const loggedInUser = {
                ...userDetails,
                uid: data.user.uid
            };

            setUserInStorage(loggedInUser);
            return Promise.resolve(loggedInUser);
        }
        throw Error('User not found');
    } catch (e) {
        return Promise.reject(e);
    }
};

export const updateUsers = async (user) => {
    await firestore.collection('users').doc(user.uid).set({
        ...user.userData
    });
};

export const registerUser = async (userData) => {
    try {
        const data = await firebaseApp.auth().createUserWithEmailAndPassword(userData.email, userData.password);
        await data.user.updateProfile({
            displayName: `${userData.first} + ${userData.last}`
        });

        delete userData.password;

        await updateUsers({
            uid: data.user.uid,
            userData
        });

        const registeredUser = {
            uid: data.user.uid,
            ...userData
        };

        setUserInStorage(registeredUser);

        return Promise.resolve(registeredUser);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const addRestaurant = async (data) => {
    try {
        const response = await firestore.collection('restaurants').add(data);
        return Promise.resolve(response);
    } catch (e) {
        console.log('error', e);
        return Promise.reject(e);
    }
};

export const updateRestaurant = async (docId, data) => {
    try {
        const response = await firestore.collection('restaurants').doc(docId).update(data);
        return Promise.resolve(response);
    } catch (e) {
        console.log('error', e);
        return Promise.reject(e);
    }
};

export const uploadImage = (image, setProgress, setUrl) => {
    const imgRef = `${Date.now()}${image.name}`;

    const uploadTask = storage.ref(`images/${imgRef}`).put(image);
    uploadTask.on(
        "state_changed",
        snapshot => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
        },
        error => {
            return Promise.reject(error);
        },
        () => {
            storage
                .ref("images")
                .child(imgRef)
                .getDownloadURL()
                .then(url => {
                    setUrl(url);
                });
        }
    );
};

export const addReview = async (docId, review) => {
    try {
        const restRef = firestore.collection('restaurants').doc(docId);
        const updateResponse = await restRef.update({
            reviews: firebase.firestore.FieldValue.arrayUnion(review)
        });
        return Promise.resolve(updateResponse);
    } catch (error) {
        return Promise.reject(error);
    }
};

/** Add reply to a comment */
export const updateReview = async (docId, review, reviewsArr, isDeleteOp) => {
    try {
        if (!isDeleteOp) {
            const index = reviewsArr.findIndex((item) => item.reviewDate === review.reviewDate);
            reviewsArr[index] = review;
        }
        const response = await firestore.collection('restaurants').doc(docId).update({
            'reviews': reviewsArr
        });
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    }
};

/** Update average rating */
export const updateAverageRating = async (docId, averageRating) => {
    try {
        const response = await firestore.collection('restaurants').doc(docId).update({
            'averageRating': averageRating
        });
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getRestaurant = async (docId) => {
    try {
        const response = await firestore.collection('restaurants').doc(docId).get();

        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteRestaurant = async (docId) => {
    try {
        const response = await firestore.collection('restaurants').doc(docId).delete();

        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    }
};
