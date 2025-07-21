import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(plainPassword, salt);
  } catch (error) {
    throw new Error(`Error hashing password: ${error}`);
  }
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error(`Error verifying password: ${error}`);
  }
};
