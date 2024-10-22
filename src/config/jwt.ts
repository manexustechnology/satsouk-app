export const JWTConfig = {
  secret: String(process.env.NEXT_PUBLIC_BACKEND_SECRET) || "",
  key: process.env.NEXT_PUBLIC_BACKEND_KEY || "",
  signature: process.env.NEXT_PUBLIC_BACKEND_SIGNATURE || "",
};
