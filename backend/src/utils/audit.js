import { AuditLog } from '../models/AuditLog.js';

/*
 * Central audit trail.
 *
 * The admin module already logs its own actions inline. This helper exists so
 * the money paths (payments, cancellation, refunds, document issue) and the
 * account paths can record the same shape of evidence: who did what, to which
 * record, and when.
 *
 * Logging must never break the business operation it is recording, so
 * failures are swallowed and returned to the caller as false.
 */
export async function recordAudit({
  actorId = null,
  action,
  entityType,
  entityId = null,
  metadata = {},
  app = null
} = {}) {
  if (!action || !entityType) return false;

  try {
    await AuditLog.create({
      actorId,
      action,
      entityType,
      entityId,
      metadata
    });

    return true;
  } catch (error) {
    app?.log?.error?.(error, 'Failed to write audit log entry');
    return false;
  }
}

/**
 * Reads the audit trail for one record, newest first.
 */
export async function listAuditFor(entityType, entityId, limit = 50) {
  return AuditLog.find({ entityType, entityId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

/**
 * Reads the most recent audit entries, optionally filtered by action prefix.
 */
export async function listRecentAudit({ actionPrefix, limit = 100 } = {}) {
  const filter = {};

  if (actionPrefix) {
    filter.action = new RegExp(`^${actionPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  }

  return AuditLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
}