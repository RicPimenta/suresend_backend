const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing token in headers" });
    }

    // Strip "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach decoded user data to request object
    req.user = decoded;
    console.log(req.user);

    next(); // Proceed to next middleware or route handler
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = { verifyToken };
