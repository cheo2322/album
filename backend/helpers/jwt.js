const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;

  return jwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/stickers\/.*/, methods: ['POST', 'GET'] },
      { url: /\/api\/v1\/users\/.*/, methods: ['POST'] },
      { url: /\/api\/v1\/albums(.*)/, methods: ['PUT', 'POST', 'GET'] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevoked(req, token) {
  if (!token.payload.isAdmin) {
    return true;
  }

  return false;
}

module.exports = authJwt;
