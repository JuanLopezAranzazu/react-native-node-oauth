const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    provider: { type: String, enum: ["google", "github"], required: true },
    providerId: { type: String, required: true },
    name: String,
    email: String,
    avatar: String,
  },
  { timestamps: true },
);
userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

module.exports = model("User", userSchema);
