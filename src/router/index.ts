/** @format */

import express from 'express';

export default () => {
    const router = express.Router();

    router.get('/', (req: any, res: any) => {
        const text = `
        <p>API服务运行中...</p>
        <p>文档额外补充信息</p>
        <ul>
          <li>如何设置管理员，在数据库中设置用户role属性等于100</li>
          <li>
            GraphQL API，headers可以包含两个参数AccessToken、Role
            <ul>
              <li>[选填] AccessToken 登录用户的访问令牌，通过文档中 signIn 可以获取到</li>
              <li>[选填] Role 用户角色，Role=admin 表示使用API中管理员的权限，注意附带的AccessToken用户，role需要等于100</li>
            </ul>
          </li>
        </ul>
      `;
        res.send(text);
    });

    return router;
};
