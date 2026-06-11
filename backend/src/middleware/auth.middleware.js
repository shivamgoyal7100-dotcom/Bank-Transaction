const userModel = require("../models/user.model")
const accountModel = require("../models/account.model")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.modedl")



function stripTokenValue(value) {
  const token = value.trim()
  if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
    return token.slice(1, -1).trim()
  }
  return token
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || req.headers["x-access-token"]
  if (authHeader && typeof authHeader === "string") {
    const value = stripTokenValue(authHeader)
    const token = value.replace(/^(?:Bearer|Token)[:\s]*/i, "").trim()
    return stripTokenValue(token)
  }
  if (req.cookies?.token) {
    return stripTokenValue(req.cookies.token)
  }
  if (req.body?.token) {
    return stripTokenValue(req.body.token)
  }
  if (req.query?.token) {
    return stripTokenValue(req.query.token)
  }
  return null
}

function getTokenInfo(req) {
  const rawAuthHeader = req.headers.authorization || req.headers.Authorization || req.headers["x-access-token"]
  const token = getTokenFromRequest(req)
  const source = rawAuthHeader ? "header" : req.cookies?.token ? "cookie" : req.body?.token ? "body" : req.query?.token ? "query" : "none"
  return { token, source }
}

async function authMiddleware(req, res, next) {
  const { token } = getTokenInfo(req)
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access. No token provided.",
    })
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token })
  if (isBlacklisted) {
    return res.status(401).json({
      message: "Unauthorized access. Token has been blacklisted.",
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access. User not found.",
      })
    }

    req.user = user
    return next()
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized access. Invalid token.",
    })
  }
}
async function authSystemUserMiddleware(req, res, next) {
  const { token, source } = getTokenInfo(req)
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access. No token provided.",
      tokenSource: source,
      tokenLength: 0
    })
  }

   const isBlacklisted = await tokenBlacklistModel.findOne({ token })
   if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized access. Token has been blacklisted.",
        
      })
   }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.userId).select("+systemUser")
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access. User not found.",
        tokenSource: source,
        tokenLength: token.length
      })
    }

    let isSystemUser = Boolean(user.systemUser)
    if (!isSystemUser) {
      const systemAccount = await accountModel.findOne({ userId: user._id, systemUser: true })
      if (systemAccount) {
        isSystemUser = true
        user.systemUser = true
      }
    }

    if (!isSystemUser) {
      return res.status(403).json({
        message: "Forbidden access, not a system user.",
        tokenSource: source,
        tokenLength: token.length
      })
    }

    req.user = user
    return next()
  }
  catch (err) {
    const message = process.env.NODE_ENV === "production"
      ? "Unauthorized access. Invalid or expired token."
      : `Unauthorized access. ${err.name}: ${err.message}`
    return res.status(401).json({
      message,
      tokenSource: source,
      tokenLength: token.length
    })
  }
}

module.exports = {
  authMiddleware,
  authSystemUserMiddleware
}