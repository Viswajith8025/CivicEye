import jwt from "jsonwebtoken";
import user from "../model/UserSchema.js";
import "dotenv/config";

const auth = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY, { algorithms: ["HS256"] });
    const userRecord = await user
      .findById(decoded.userid)
      .select("role deletestate email");

    if (!userRecord || userRecord.deletestate) {
      return res.status(401).json({ message: "Account inactive or not found" });
    }

    req.user = {
      userid: decoded.userid,
      email: userRecord.email || decoded.email,
      role: userRecord.role,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
