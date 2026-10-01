const { Schema, model } = require("mongoose");

const noteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, trim: true, default: "" },
    content: { type: String, default: "" },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true },
);
noteSchema.index({ title: "text", content: "text" });

module.exports = model("Note", noteSchema);
