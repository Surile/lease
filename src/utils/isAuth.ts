/** @format */

import {AuthenticationError} from 'apollo-server-express';
import {isAuthTypes} from '../types';

export const isAuth = (context: isAuthTypes) => {
    if (!context.isAuth) throw new AuthenticationError('invalid token');
};
