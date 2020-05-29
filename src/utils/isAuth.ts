/** @format */

import {ApolloError} from 'apollo-server-express'

export const isAuth = (context: any) => {
    if (!context.isAuth) throw new ApolloError('用户未认证', '401')
}
