import jwt from "jsonwebtoken";

export const signJwt = (payload: object, expiresIn: number) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn });
};
export const decodeJwt = (token: string) => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    throw new Error("Invalid JWT token");
  }
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    throw new Error("Invalid JWT token");
  }
};
