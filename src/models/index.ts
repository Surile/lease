/** @format */

import {gql} from 'apollo-server-express'
import * as user from './users'

export const typeDefs = gql`
    ${user.typedefs.Schema}

    type Query{
        ${user.typedefs.Query}
    }

    type Mutation {
        ${user.typedefs.Mutation}
    }
`

export const resolvers = {
    Query: {
        ...user.resolvers.Query,
    },
    Mutation: {
        ...user.resolvers.Mutation,
    },
}
