import { useContext, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Auth';
import Login from './Login';
import Register from './Register';

export default function LoginRegister() {
    const [isLogin, toggleLogin] = useState(true);
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();
    const pathname = location.state && location.state.pathname ? location.state.pathname : '/';

    if (currentUser) {
        return <Redirect to={pathname} />;
    }

    return (
        <div className='login'>
            <div className='container'>
                {isLogin ? (
                    <Login
                        isLogin={isLogin}
                        toggleLogin={toggleLogin}
                    />
                ) : (
                    <Register
                        isLogin={isLogin}
                        toggleLogin={toggleLogin}
                    />
                )}
            </div>
        </div>
    );
};
