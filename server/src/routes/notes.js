const router = require("express").Router();
const Note = require("../models/Note");
const requireAuth = require("../middleware/auth");

router.use(requireAuth);

const pick = ({ title, content, pinned }) => {
  const out = { title, content, pinned };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};

router.get("/", async (req, res) => {
  const filter = { user: req.userId };
  if (req.query.q) filter.$text = { $search: String(req.query.q) };
  const notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
  res.json(notes);
});

router.post("/", async (req, res) => {
  const note = await Note.create({ ...pick(req.body), user: req.userId });
  res.status(201).json(note);
});

router.put("/:id", async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    pick(req.body),
    { new: true, runValidators: true },
  );
  if (!note) return res.status(404).json({ error: "Nota no encontrada" });
  res.json(note);
});

router.delete("/:id", async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!note) return res.status(404).json({ error: "Nota no encontrada" });
  res.sendStatus(204);
});

module.exports = router;
