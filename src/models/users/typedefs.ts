/** @format */

export const Schema = `
    type User {
        id:Int!
        name:String!
        avatar:String!
        age:Int!
        password:String!
        email:String!
    }

    type AccessToken {
        accessToken:String!
    }
`

export const Query = `
    getUser(id:Int!):User,
    fetchUsers(offset:Int,limit:Int):[User]
`

export const Mutation = `
    Register(name:String!,avatar:String!,age:Int!,password:String!,email:String!):Boolean!,
    Login(email:String!,password:String!):AccessToken
`
