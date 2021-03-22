
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
// import { auth } from '../../helpers/Firebase';
import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    REGISTER_USER,
    LOGOUT_USER,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
} from '../actions';

import {
    loginUserSuccess,
    loginUserPreSuccess,
    loginUserError,
    registerUserSuccess,
    registerUserError,
    forgotPasswordSuccess,
    forgotPasswordError,
    resetPasswordSuccess,
    resetPasswordError
} from './actions';


import { INIT_STATE as authUser } from './reducer';
import { fetch } from '../../helpers/Utils';


export function* watchLoginUserSuccess() {
    yield takeEvery(LOGIN_USER_SUCCESS, successfulLogin);
}


function* successfulLogin({ payload }) {
    const { response } = payload;
    const { user, accessToken } = response;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    yield window.location.reload();
}


export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const loginWithEmailPasswordAsync = async (email, password) => {
    const { authenticationServer, clientID, clientSecret } = authUser;
    return await fetch(`${authenticationServer}/oauth/token`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            username: email,
            password,
            grant_type: "password",
            client_id: `${clientID}`,
            client_secret: clientSecret
        })
    })
    .then( response => response.json() )
    .then( response => response )
    .catch( error => error );
    
    // return await auth.signInWithEmailAndPassword(email, password)
    //     .then(authUser => authUser)
    //     .catch(error => error);
}



function* loginWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    // const { history } = payload;
    try {
        const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        if (!loginUser.message) {

            if(loginUser.tfaEnabled) {
                yield put(loginUserPreSuccess(loginUser));
            } else {
                yield put(loginUserSuccess(loginUser, payload.history))
            }



            // yield put(loginUserSuccess(loginUser));
            // history.push('/');
            // window.location = "/";
        } else {
            yield put(loginUserError(loginUser.message));
        }
    } catch (error) {
        yield put(loginUserError(error));
    }
}


export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

const registerWithEmailPasswordAsync = async (email, password) => await null
    // await auth.createUserWithEmailAndPassword(email, password)
    //     .then(authUser => authUser)
    //     .catch(error => error);

function* registerWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload
    try {
        const registerUser = yield call(registerWithEmailPasswordAsync, email, password);
        if (!registerUser.message) {
            localStorage.setItem('user_id', registerUser.user.uid);
            yield put(registerUserSuccess(registerUser));
            history.push('/')
        } else {
            yield put(registerUserError(registerUser.message));

        }
    } catch (error) {
        yield put(registerUserError(error));
    }
}



export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if(!history) {
        return window.location = "/";
    }
    return await history.push('/');
    
    // await auth.signOut().then(authUser => authUser).catch(error => error);
    // const { baseURL, token: accessToken } = authUser;
    // return await fetch(`${baseURL}/api/logout`, {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //         Authorization: `Bearer ${accessToken}`
    //     }
    // })
    // .then( async (response) => {
    //     if(!response.ok) {
    //         throw new Error((await response.json()).message);
    //     }
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('token');
    //     return await history.push('/');
    // })
    // .catch( error => console.error(error) );
}

function* logout({ payload }) {
    const { history } = payload;
    try {
        yield call(logoutAsync, history);
    } catch (error) {
        console.log("logout - ", error);
    }
}

export function* watchForgotPassword() {
    yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {

  
    const { baseURL, clientID, clientSecret } = authUser;
    let status = 400;
    const request = await fetch(`${baseURL}/forgot-password`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: email,
            client_id: clientID,
            client_secret: clientSecret
        })
    })
    .then( response => {
        status = response.status;
        return response.json();
    })
    .then( response => response )
    .catch( error => error );


    return {
        request,
        status
    };


    // return await auth.sendPasswordResetEmail(email)
    //     .then(user => user)
    //     .catch(error => error);
}

function* forgotPassword({ payload }) {
    const { email } = payload.forgotUserMail;
    try {
        const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
        if (forgotPasswordStatus.status === 200) {
            yield put(forgotPasswordSuccess(forgotPasswordStatus.request.message));
        } else {
            yield put(forgotPasswordError(forgotPasswordStatus.request.message));
        }
    } catch (error) {
        yield put(forgotPasswordError(error));

    }
}

export function* watchResetPassword() {
    yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
    const { baseURL } = authUser;
    let status = 400;
    const request = await fetch(`${baseURL}/reset-password`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            resetPasswordCode,
            newPassword
        })
    })
    .then( response => {
        status = response.status;
        return response.json();
    })
    .then( response => response )
    .catch( error => error );


    return {
        request,
        status
    };

    // return await auth.confirmPasswordReset(resetPasswordCode, newPassword)
    //     .then(user => user)
    //     .catch(error => error);
}

function* resetPassword({ payload }) {
    const { newPassword, resetPasswordCode } = payload;
    try {
        const resetPasswordStatus = yield call(resetPasswordAsync, resetPasswordCode, newPassword);
        if (resetPasswordStatus.status === 200) {
            yield put(resetPasswordSuccess(resetPasswordStatus.request.message));
        } else {
            yield put(resetPasswordError(resetPasswordStatus.request.message));
        }
    } catch (error) {
        yield put(resetPasswordError(error));

    }
}

export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLoginUserSuccess),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgotPassword),
        fork(watchResetPassword),
    ]);
}