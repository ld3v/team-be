import fs from 'fs/promises';
import * as path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

const TOKEN_PATH = path.join(process.cwd(), 'credentials', 'google-token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials', 'google.json');

const loadSavedCredentialsIfExist = async () => {
  try {
    const content = await fs.readFile(TOKEN_PATH, { encoding: 'utf-8' });
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
};

const saveCredentials = async (client: OAuth2Client) => {
  const content = await fs.readFile(CREDENTIALS_PATH, { encoding: 'utf-8' });
  const credentials = JSON.parse(content).installed; // Using Desktop App (installed), or Web App (web).
  const payload = JSON.stringify({
    type: 'authorized_user',
    ...credentials,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload, { encoding: 'utf-8' });
};

const authorize = async () => {
  // const client = await loadSavedCredentialsIfExist();
  // if (client) {
  //   return client;
  // }
  const authenticatedInfo = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  console.log(authenticatedInfo);
  if (authenticatedInfo.credentials) {
    await saveCredentials(authenticatedInfo);
  }
  return authenticatedInfo;
};

export default authorize;
