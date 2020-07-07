/** @format */

import {AuthenticationError} from 'apollo-server-express';

export const isAuth = (context: any) => {
    if (!context.isAuth) throw new AuthenticationError('invalid token');
};
