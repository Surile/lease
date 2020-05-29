/** @format */

import * as jwt from 'jsonwebtoken'

export default (req: any, res: any, next: any) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        req.isAuth = false
        return next()
    }
    const token = authHeader.replace('Bearer ', '')
    if (!token || token === '') {
        req.isAuth = false
        return next()
    }
    let decodedToken: any
    try {
        decodedToken = jwt.verify(token, 'mySecretKey')
    } catch (err) {
        req.isAuth = false
        return next()
    }
    if (!decodedToken) {
        req.isAuth = false
        return next()
    }
    req.isAuth = true
    req.user = decodedToken.user
    return next()
}
