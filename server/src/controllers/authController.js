import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { asyncHandler, HttpError, signToken } from "../utils/helpers.js";
import { validateRegister, validateLogin } from "../utils/validators.js";

export const register = asyncHandler(async (req, res) => {
  const problem = validateRegister(req.body);
  if (problem) throw new HttpError(400, problem);

  const email = req.body.email.trim().toLowerCase();
  if (await User.exists({ email })) throw new HttpError(409, "An account with that email already exists.");

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ name: req.body.name.trim(), email, passwordHash });

  res.status(201).json({ token: signToken(user._id), user: user.toPublic() });
});

export const login = asyncHandler(async (req, res) => {
  const problem = validateLogin(req.body);
  if (problem) throw new HttpError(400, problem);

  const email = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ email }).select("+passwordHash");

  // Same message for "no such user" and "wrong password" so emails cannot be probed.
  const ok = user && (await bcrypt.compare(req.body.password, user.passwordHash));
  if (!ok) throw new HttpError(401, "Invalid email or password.");

  res.json({ token: signToken(user._id), user: user.toPublic() });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublic() });
});
