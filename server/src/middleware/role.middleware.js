module.exports = (requiredRole) => {
  return (req, res, next) => {
    // If user not attached by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check role
    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Forbidden: You don't have permission" });
    }

    next();
  };
};
