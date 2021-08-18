import { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {
    AccountCircle
} from '@material-ui/icons';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Typography } from '@material-ui/core';
import { firebaseApp } from '../../firebase';
import { AuthContext } from '../../Auth';
import { ButtonWithIcon } from './ButtonWithIcon';
import { ADMIN } from '../../constants';
import { DataProvider } from '../../DataProvider';

export const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const authContext = useContext(AuthContext);
    const dataProvider = useContext(DataProvider);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const signOut = () => {
        firebaseApp.auth().signOut();
        localStorage.clear();
        authContext.setCurrentUser(null);
        dataProvider.setLast(null);
    };

    const history = useHistory();

    return (
        <div>
            <AppBar color='primary' position="fixed">
                <Toolbar>
                    <div className='header-content'>
                        <ButtonWithIcon
                            icon={<AccountCircle />}
                            label={`${authContext.currentUser.first} ${authContext.currentUser.last}`}
                            onClick={handleMenu}
                        />
                        {authContext.currentUser.role === ADMIN && (
                            <Typography
                                className='button-with-icon-label'
                                onClick={() => history.push('/manage-users')}
                                variant='body1'
                            >
                                Manage Users
                            </Typography>
                        )}
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                horizontal: 'right',
                                vertical: 'top'
                            }}
                            id="menu-appbar"
                            keepMounted
                            onClose={handleClose}
                            open={open}
                            transformOrigin={{
                                horizontal: 'right',
                                vertical: 'top'
                            }}
                        >
                            <MenuItem onClick={signOut}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};
