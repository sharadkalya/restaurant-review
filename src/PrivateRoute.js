import React, { useContext } from "react";
import propTypes from 'prop-types';
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={routeProps =>
                currentUser ? (
                    <RouteComponent {...routeProps} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: routeProps.location
                        }}
                    />
                )
            }
        />
    );
};

PrivateRoute.propTypes = {
    component: propTypes.func.isRequired
};

export default PrivateRoute;
