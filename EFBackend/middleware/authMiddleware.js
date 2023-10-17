const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware function to authenticate user
exports.authenticateUser = async (req, res, next) => {
  try {
    // Get the token from the request headers or cookies, as per your implementation
    const token = req.headers.authorization?.replace("Bearer ", ""); // Example with Bearer token

    if (!token) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Verify the token and decode the payload
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the decoded token
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the user object to the request for further processing
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Middleware function to check for a valid JWT token
exports.authenticateToken = (req, res, next) => {
  // Extract the token from the request headers
  const token = req.header("Authorization");

  // Check if a token is present in the headers
  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    // Verify the token with your secret key
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    // Attach the user information to the request object
    req.user = decoded;

    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
