import {
    Button,
    Checkbox,
    FormControlLabel,
    TextField
} from '@material-ui/core';
import { useContext, useState } from 'react';
import propTypes from 'prop-types';
import { registerUser } from '../../firebase/api';
import { FullScreenLoader } from '../common';
import { validateEmail } from '../../helper';
import { AuthContext } from '../../Auth';

export default function Register(props) {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [first, setFirst] = useState('');
    const [firstError, setFirstError] = useState('');

    const [last, setLast] = useState('');
    const [lastError, setLastError] = useState('');

    const [isOwner, setIsOwner] = useState(false);
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

        if (!password || password.length < 6) {
            isError = true;
            setPasswordError('Please enter password(min length 6)');
        } else {
            setPasswordError('');
        }

        if (!first) {
            isError = true;
            setFirstError('Please enter first name');
        } else {
            setFirstError('');
        }

        if (!last) {
            isError = true;
            setLastError('Please enter last name');
        } else {
            setLastError('');
        }

        if (!isError) {
            try {
                const registeredUser = await registerUser({
                    email: username,
                    first,
                    last,
                    password,
                    role: isOwner ? 'owner' : 'user'
                });
                setLoading(true);
                authContext.setCurrentUser(registeredUser);
                return;
            } catch (e) {
                setLoading(true);
                setErrorMessage(e.message);
            }
        }

        setLoading(false);
    };

    return (
        <div>
            <FullScreenLoader
                isVisible={loading}
            />
            <div className='input-container'>
                <TextField
                    error={Boolean(firstError.length)}
                    fullWidth
                    helperText={firstError}
                    label='First'
                    onChange={(e) => setFirst(e.target.value)}
                    value={first}
                />
            </div>
            <div className='input-container'>
                <TextField
                    error={Boolean(lastError.length)}
                    fullWidth
                    helperText={lastError}
                    label='Last'
                    onChange={(e) => setLast(e.target.value)}
                    value={last}
                />
            </div>
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
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isOwner}
                        color='primary'
                        onChange={() => setIsOwner(!isOwner)}
                    />
                }
                label='Sign up as owner'
            />
            <div className='login-button-connector'>
                <Button
                    color="primary"
                    onClick={submit}
                    variant="contained"
                >
                    Register
                </Button>
                <Button
                    color='primary'
                    onClick={() => props.toggleLogin(!props.isLogin)}
                >
                    Click here to Login
                </Button>
            </div>
            <p className='error-msg'>{errorMessage}</p>
        </div>
    );
};

Register.propTypes = {
    isLogin: propTypes.bool.isRequired,
    toggleLogin: propTypes.func.isRequired
};
