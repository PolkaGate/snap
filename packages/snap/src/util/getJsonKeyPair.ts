import { getKeyPair } from '.';

export const getJsonKeyPair = async (password: string): Promise<string> => {
  const keyPair = await getKeyPair();
  return JSON.stringify(keyPair.toJson(password));
};
