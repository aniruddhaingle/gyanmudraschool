import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_token;
  if (!token) {
    return res.status(401).json({ message: "Admin login required." });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    if (req.admin.role !== "admin") {
      return res.status(403).json({ message: "Administrator access is required." });
    }
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired admin session." });
  }
}
