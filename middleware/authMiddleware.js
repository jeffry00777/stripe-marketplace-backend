// middleware/authMiddleware.js
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const issuer = process.env.OKTA_ISSUER;
const audience = process.env.OKTA_AUDIENCE;

module.exports = jwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: `${issuer}/v1/keys`,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
  }),
  issuer,
  audience,
  algorithms: ["RS256"],
  requestProperty: "auth", // decoded token will be on req.auth
});
