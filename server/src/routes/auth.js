const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const requireAuth = require("../middleware/auth");
const User = require("../models/User");

const PROVIDERS = ["google", "github"];
const allowed = (process.env.ALLOWED_REDIRECTS || "notesapp://").split(",");
const isAllowed = (url) =>
  typeof url === "string" && allowed.some((p) => url.startsWith(p));
const withParam = (url, k, v) =>
  `${url}${url.includes("?") ? "&" : "?"}${k}=${encodeURIComponent(v)}`;

router.get("/me/profile", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("-__v");
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
});

router.get("/:provider", (req, res, next) => {
  const { provider } = req.params;
  if (!PROVIDERS.includes(provider)) return res.sendStatus(404);
  if (!isAllowed(req.query.redirect))
    return res.status(400).json({ error: "redirect no permitido" });

  const scope = provider === "google" ? ["profile", "email"] : ["user:email"];
  const state = Buffer.from(req.query.redirect).toString("base64url");
  passport.authenticate(provider, { scope, state, session: false })(
    req,
    res,
    next,
  );
});

router.get("/:provider/callback", (req, res, next) => {
  const { provider } = req.params;
  if (!PROVIDERS.includes(provider)) return res.sendStatus(404);

  const redirect = Buffer.from(
    String(req.query.state || ""),
    "base64url",
  ).toString();
  if (!isAllowed(redirect))
    return res.status(400).send("redirect no permitido");

  passport.authenticate(provider, { session: false }, (err, user) => {
    if (err || !user)
      return res.redirect(withParam(redirect, "error", "auth_failed"));
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.redirect(withParam(redirect, "token", token));
  })(req, res, next);
});

module.exports = router;
