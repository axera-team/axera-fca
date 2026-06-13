/**
 * @fileoverview Core modules for the Axera FCA project.
 * @author Axera Team <axera-team@protonmail.com>
 * @version 1.0.0
 */
import fs from 'node:fs';
import { fbLink } from '../utils/index.js';
import ApiClient from '../http/apiClient.js';

import type { FB_ACCOUNT_DTSG } from '../types';

/**
 * Refresh Facebook DTSG Token
 * @param options - The options object.
 * @param options.userID - The userID of the Facebook account.
 * @param options.loginOptions - The login options object.
 * @param options.apiClient - The API client object.
 * @description The FB DTSG Token is used when making requests to their web pages.
 */
export async function refreshDTSG({ userID, loginOptions, apiClient }: { userID: string, loginOptions: Record<string, any>, apiClient: ApiClient.Client }): Promise<{ fb_dtsg: string, jazoest: string }> {
  if (!userID) throw new Error('No userID provided, cannot refresh account DTSG.');
  if (!loginOptions) throw new Error('No loginOptions provided.')
  if (Object.keys(loginOptions).length === 0) throw new Error('Got empty loginOptions when refreshing DTSG. Please provide a loginOptions object.');
  
  const res = await apiClient.get({
    url: fbLink("ajax/dtsg/?__a=true"),
    query: null
  });
  
  const cleaned = res?.body?.replace('for (;;);', "");
  if (!cleaned) throw new Error("Got empty body when cleaning DTSG payload. Check the response object.");
  
  const parsed = JSON.parse(cleaned);
  if (Object.keys(parsed).length === 0) throw new Error("Got empty payload when refreshing DTSG.");
  
  const dtsg: string = parsed.payload?.token;
  if (!dtsg || typeof dtsg !== "string") throw new Error(`DTSG token missing from payload. Got type ${typeof dtsg} instead.`);

  let jazoest: `2${string}` | undefined = "2";
  for (const ch of dtsg) { jazoest += ch.charCodeAt(0); }

  const result = { fb_dtsg: dtsg, jazoest };
  
  // Save to current directory
  const filePath = "fb_dtsg_data.json";
  
  const existing: FB_ACCOUNT_DTSG = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : {};
  existing[userID] = result;
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 4), "utf8");
  
  return result;
};

export * from './bus.js';
export * from './events.js';
export * from './operation.js';
export * from './session.js';
export * from './api.js';

export * from './api-manager.js';
export * from './api-registry.js';

export * from './legacy-api-manager.js';
export * from './legacy-api-registry.js';