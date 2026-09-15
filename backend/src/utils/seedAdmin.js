import AdminUser from "../models/AdminUser.js";

export async function ensureInitialAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !passwordHash) {
    console.warn("ADMIN_EMAIL and ADMIN_PASSWORD_HASH are required to create the initial administrator.");
    return;
  }

  const existing = await AdminUser.findOne({ email }).select("+passwordHash");
  if (existing) return;

  await AdminUser.create({
    email,
    passwordHash,
    role: "admin"
  });
  console.log(`Initial administrator created for ${email}.`);
}
