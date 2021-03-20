/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/auth';

export const AuthRoute = ({ component: Component, ...rest }) => {
    const { user } = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={props => (user ? <Component {...props} /> : <Redirect to="/" />)}
        />
    );
};

AuthRoute.propTypes = {
    component: PropTypes.node.isRequired,
};
