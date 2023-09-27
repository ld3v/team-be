import * as bcrypt from 'bcrypt';

export const generateAPIKey = async (
  input: string,
): Promise<{ publicKey: string; secretKey: string }> => {
  const salt = await bcrypt.genSalt(10);

  const secretKey = await bcrypt.hash(input, salt);

  return { publicKey: salt, secretKey };
};

export const validateAppKeys = async (appId: string, apiKey: string) =>
  await bcrypt.compare(appId, apiKey);
