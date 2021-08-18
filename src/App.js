import { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import './App.scss';
import Login from './components/login';
import Listing from './components/listing';
import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';
import Restaurant from './components/restaurant';
import ManageUsers from './components/manage-users';
import { DataProvider } from './DataProvider';

function App() {
    const [last, setLast] = useState(null);

    return (
        <AuthProvider>
            <DataProvider.Provider
                value={{
                    last,
                    setLast
                }}
            >
                <Router>
                    <Switch>
                        <Route
                            component={Login}
                            exact
                            path='/login'
                        />
                        <PrivateRoute
                            component={Listing}
                            exact
                            path='/'
                        />
                        <PrivateRoute
                            component={Restaurant}
                            exact
                            path='/restaurant/:id'
                        />
                        <PrivateRoute
                            component={ManageUsers}
                            exact
                            path='/manage-users'
                        />
                        <PrivateRoute
                            component={Listing}
                        />
                    </Switch>
                </Router>
            </DataProvider.Provider>
        </AuthProvider>
    );
}

export default App;
