import { IncomingHttpHeaders, IncomingMessage } from "http";

export class ForeignError extends Error {}
export class YoureTooFastError extends Error {}
export class NoIpError extends Error {}
export const AuthoriseErrors = {
  ForeignError,
  YoureTooFastError,
  NoIpError
} as const;
export type AuthoriseError = typeof AuthoriseErrors[keyof typeof AuthoriseErrors];

const lastPosts = new Map<string, number>();
const notAllowWindow = 1000 * 30 * 1; // 30s

function isAllowByWindow(userId: string): boolean {
  const lastPost = lastPosts.get(userId);
  const now = Date.now();

  if (!lastPost) {
    lastPosts.set(userId, now);
    return true;
  }

  return now - lastPost > notAllowWindow;
}

function isAllowByHeaders(headers: IncomingHttpHeaders): boolean {
  return headers.origin === 'https://nperrin.io';
}

export async function authoriseComment(req: IncomingMessage)  {
  if (typeof req.headers['x-real-ip'] !== 'string') {
    throw new NoIpError();
  }
  if (!isAllowByHeaders(req.headers)) {
    throw new ForeignError();
  }
  if (!isAllowByWindow(req.headers['x-real-ip'])) {
    throw new YoureTooFastError();
  }
}
