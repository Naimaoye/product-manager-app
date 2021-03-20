/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
import React, { createContext } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
	user: null,
};

if (localStorage.getItem('user')) {
	const user = JSON.parse(localStorage.getItem('user'));
	const decodedToken = jwtDecode(user.token);
	if (decodedToken.exp * 1000 < Date.now()) {
		localStorage.removeItem('user');
	} else {
		initialState.user = user;
	}
}

const AuthContext = createContext({
	// eslint-disable-next-line no-unused-vars
	login: userData => { },
	logout: () => { },
	user: null,
});

const authReducer = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'LOGIN':
			return {
				...state, user: payload,
			};

		case 'LOGOUT':
			return {
				...state, user: null,
			};

		default:
			return state;
	}
};

const AuthProvider = props => {
	const [state, dispatch] = React.useReducer(authReducer, initialState);

	const login = userData => {
		localStorage.setItem('user', JSON.stringify(userData));
		dispatch({
			payload: userData,
			type: 'LOGIN',
		});
	};

	const logout = () => {
		localStorage.removeItem('user');
		dispatch({
			type: 'LOGOUT',
		});
	};

	return (
		<AuthContext.Provider
			value={{ login, logout, user: state.user }}
			{...props}
		/>
	);
};

export { AuthContext, AuthProvider };
