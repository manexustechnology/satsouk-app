import { SignJWT } from "jose";
import { JWTConfig } from "@/config/jwt";

export const generateToken = async (address: string | null, twitterId?: string | null) => {
  const timestamp = Date.now();

  const secret = new TextEncoder().encode(JWTConfig.secret);

  const hashSignature = btoa(
    `${JWTConfig.key}:${JWTConfig.signature}|i|${timestamp}`
  );
  const hashAddress = btoa(
    `${JWTConfig.key}:${address || ''}|i|${timestamp}`
  );

  let hashTwitter = null;
  if (twitterId) {
    hashTwitter = btoa(
      `${JWTConfig.key}:${twitterId || ''}|i|${timestamp}`
    )
  }

  const alg = "HS256";

  const token = await new SignJWT({ address })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  let finalToken = `${token}|i|${hashSignature}|i|${hashAddress}`;

  if (hashTwitter) {
    finalToken += `|i|${hashTwitter}`;
  }

  return finalToken;
};