import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useAuth();

    return (
        <Route
            {...rest}
            render={props =>
                loading ? (
                    <div>Loading...</div> // Or a proper loading spinner
                ) : isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;