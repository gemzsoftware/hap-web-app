import crypto from 'node:crypto';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

import { env } from '../config/env.js';

const BACKEND_ROOT = fileURLToPath(
  new URL('../..', import.meta.url)
);

const UPLOAD_ROOT = path.resolve(
  BACKEND_ROOT,
  env.uploadDir
);

const DOCUMENTS_ROOT = path.resolve(
  UPLOAD_ROOT,
  'documents'
);

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png'
]);

const EXTENSIONS_BY_MIME_TYPE = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png'
};

function sanitizePathSegment(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 100);
}

function getSafeExtension(mimetype) {
  return EXTENSIONS_BY_MIME_TYPE[mimetype] || '';
}

function createStorageFilename(mimetype) {
  const extension = getSafeExtension(mimetype);

  return `${Date.now()}-${crypto.randomUUID()}${extension}`;
}

export function isAllowedDocumentMimeType(mimetype) {
  return ALLOWED_MIME_TYPES.has(mimetype);
}

export function getDocumentStorageRoot() {
  return DOCUMENTS_ROOT;
}

export async function ensureDocumentStorage() {
  await fsPromises.mkdir(DOCUMENTS_ROOT, {
    recursive: true
  });
}

export async function saveDocumentFile({
  stream,
  userId,
  mimetype
}) {
  if (!isAllowedDocumentMimeType(mimetype)) {
    throw new Error(
      'Unsupported document file type. Only PDF, JPEG and PNG files are allowed.'
    );
  }

  const safeUserId = sanitizePathSegment(userId);

  if (!safeUserId) {
    throw new Error('Invalid document owner');
  }

  const userDirectory = path.resolve(
    DOCUMENTS_ROOT,
    safeUserId
  );

  await fsPromises.mkdir(userDirectory, {
    recursive: true
  });

  const filename = createStorageFilename(mimetype);

  const absolutePath = path.resolve(
    userDirectory,
    filename
  );

  /*
   * Extra safety check to ensure the generated path can never escape the
   * documents storage directory.
   */
  if (!absolutePath.startsWith(`${userDirectory}${path.sep}`)) {
    throw new Error('Invalid document storage path');
  }

  await pipeline(
    stream,
    fs.createWriteStream(absolutePath, {
      flags: 'wx'
    })
  );

  const storageKey = path
    .relative(UPLOAD_ROOT, absolutePath)
    .split(path.sep)
    .join('/');

  return {
    storageKey,
    absolutePath,
    filename
  };
}

export async function deleteStoredDocument(storageKey) {
  if (!storageKey) {
    return;
  }

  const normalizedKey = String(storageKey)
    .replaceAll('\\', '/')
    .replace(/^\/+/, '');

  const absolutePath = path.resolve(
    UPLOAD_ROOT,
    normalizedKey
  );

  /*
   * Prevent a malicious storageKey from escaping the configured upload
   * directory.
   */
  if (
    absolutePath !== UPLOAD_ROOT &&
    !absolutePath.startsWith(`${UPLOAD_ROOT}${path.sep}`)
  ) {
    throw new Error('Invalid document storage path');
  }

  try {
    await fsPromises.unlink(absolutePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

export function resolveStoredDocumentPath(storageKey) {
  if (!storageKey) {
    return null;
  }

  const normalizedKey = String(storageKey)
    .replaceAll('\\', '/')
    .replace(/^\/+/, '');

  const absolutePath = path.resolve(
    UPLOAD_ROOT,
    normalizedKey
  );

  if (
    absolutePath !== UPLOAD_ROOT &&
    !absolutePath.startsWith(`${UPLOAD_ROOT}${path.sep}`)
  ) {
    throw new Error('Invalid document storage path');
  }

  return absolutePath;
}