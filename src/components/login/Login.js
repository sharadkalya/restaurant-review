import { Button, TextField } from '@material-ui/core';
import { useContext, useState } from 'react';
import propTypes from 'prop-types';
import { getUser } from '../../firebase/api';
import { FullScreenLoader } from '../common';
import { validateEmail } from '../../helper';
import { AuthContext } from '../../Auth';

export default function Login(props) {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const authContext = useContext(AuthContext);

    const submit = async () => {
        setErrorMessage('');
        setLoading(true);
        let isError = false;

        if (!username || !validateEmail(username)) {
            isError = true;
            setUsernameError('Please enter valid email');
        } else {
            setUsernameError('');
        }

        if (!password) {
            isError = true;
            setPasswordError('Please enter password');
        } else {
            setPasswordError('');
        }

        if (!isError) {
            try {
                const loggedInUser = await getUser(username, password);
                setLoading(false);
                authContext.setCurrentUser(loggedInUser);
                return;
            } catch {
                setErrorMessage('Invalid credentials');
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <FullScreenLoader
                isVisible={loading}
            />
            <div className='input-container'>
                <TextField
                    error={Boolean(usernameError.length)}
                    fullWidth
                    helperText={usernameError}
                    label='Email'
                    onChange={(e) => setUsername(e.target.value)}
                    type='email'
                    value={username}
                />
            </div>
            <div className='input-container'>
                <TextField
                    error={Boolean(passwordError.length)}
                    fullWidth
                    helperText={passwordError}
                    label='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    value={password}
                />
            </div>
            <div className='login-button-connector'>
                <Button
                    color="primary"
                    onClick={submit}
                    variant="contained"
                >
                    Login
                </Button>
                <Button
                    color='primary'
                    onClick={() => props.toggleLogin(!props.isLogin)}
                    type='submit'
                >
                    Click here to SignUp
                </Button>
            </div>
            <p className='error-msg'>{errorMessage}</p>
        </div>
    );
};

Login.propTypes = {
    isLogin: propTypes.bool.isRequired,
    toggleLogin: propTypes.func.isRequired
};
