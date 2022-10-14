import { UpstreamUser } from '../UpstreamUser';
import { sha256 } from 'js-sha256';
import { Base64 } from './Base64';

export function getHashValue(value: string): string {
  let buffer = sha256.create().update(value).arrayBuffer();
  return Base64.encodeArrayBuffer(buffer);
}

export function getUserCacheKey(user: UpstreamUser | null): string {
  // simplify, return passed userID
  let key = `userID:${String(user?.userID ?? '')}`;
  return key;
}
