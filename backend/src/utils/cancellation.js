// ============================================
// FILE: backend/src/utils/cancellation.js
// ============================================
// Cancellation / refund business rules (Phase 10).
//
// The deduction rate is resolved from company settings first and falls back to
// the environment default (DEFAULT_CANCELLATION_DEDUCTION_PERCENT, 20%).
// ============================================

import { CompanySetting } from '../models/CompanySetting.js';
import { env } from '../config/env.js';

export const CANCELLATION_REVIEW_STATUSES = [
  'not_requested',
  'pending',
  'approved',
  'rejected'
];

export function roundCurrency(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return 0;

  return Math.round((number + Number.EPSILON) * 100) / 100;
}

export function normalizeDeductionPercent(value) {
  const percent = Number(value);

  if (!Number.isFinite(percent)) {
    return normalizeDeductionPercent(env.defaultCancellationDeductionPercent);
  }

  return Math.min(Math.max(percent, 0), 100);
}

/*
 * Company settings are stored as { key, value } documents.
 *
 * Two shapes are accepted so an administrator can either add a dedicated
 * setting or nest the rate inside the general "company" record:
 *
 *   1. { key: 'company', value: { cancellationDeductionPercent: 20 } }
 *   2. { key: 'cancellationDeductionPercent', value: 20 }
 */
export async function resolveCancellationDeductionPercent() {
  const fallback = normalizeDeductionPercent(
    env.defaultCancellationDeductionPercent
  );

  try {
    const [companySetting, dedicatedSetting] = await Promise.all([
      CompanySetting.findOne({ key: 'company' }).lean(),
      CompanySetting.findOne({
        key: 'cancellationDeductionPercent'
      }).lean()
    ]);

    const nested = companySetting?.value?.cancellationDeductionPercent;

    if (nested !== undefined && nested !== null && nested !== '') {
      return normalizeDeductionPercent(nested);
    }

    if (
      dedicatedSetting?.value !== undefined &&
      dedicatedSetting?.value !== null &&
      dedicatedSetting?.value !== ''
    ) {
      return normalizeDeductionPercent(dedicatedSetting.value);
    }
  } catch (error) {
    return fallback;
  }

  return fallback;
}

/*
 * Pure calculation so the same numbers are produced for the investor preview
 * and for the administrative decision.
 */
export function calculateCancellationAmounts({
  amountPaid,
  deductionPercent
}) {
  const paid = roundCurrency(Math.max(Number(amountPaid) || 0, 0));
  const percent = normalizeDeductionPercent(deductionPercent);
  const deductionAmount = roundCurrency((paid * percent) / 100);
  const refundableAmount = roundCurrency(
    Math.max(paid - deductionAmount, 0)
  );

  return {
    amountPaidAtCancellation: paid,
    deductionPercent: percent,
    deductionAmount,
    refundableAmount
  };
}

export function resolveCancellationRefundStatus({
  amountPaidAtCancellation,
  refundableAmount
}) {
  if (Number(amountPaidAtCancellation) <= 0) return 'not_applicable';

  return Number(refundableAmount) > 0 ? 'pending' : 'forfeited';
}


// ============================================
// END OF FILE: cancellation.js
// ============================================
