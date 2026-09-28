import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECEIPT_DIRECTORY = path.join(
  __dirname,
  '../../../storage/receipts'
);

// ─────────────────────────────────────────────
// BRAND COLORS
// ─────────────────────────────────────────────

const BLUE = '#155FD1';
const NAVY = '#14294D';
const GOLD = '#E3B23C';
const GREEN = '#159447';
const DARK = '#1F2937';
const MUTED = '#6B7280';
const LIGHT = '#F6F8FB';
const BORDER = '#DDE3EC';
const WHITE = '#FFFFFF';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function money(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
    .format(date)
    .toUpperCase();
}

function formatPaymentType(type) {
  switch (type) {
    case 'full_payment':
      return 'Full Payment';

    case 'installment':
      return 'Installment Payment';

    case 'deposit':
      return 'Initial Deposit';

    default:
      return type
        ? String(type)
            .replaceAll('_', ' ')
            .replace(/\b\w/g, (letter) =>
              letter.toUpperCase()
            )
        : 'Payment';
  }
}

function amountInWords(amount) {
  const value = Math.round(Number(amount || 0));

  if (value === 0) {
    return 'Zero Naira Only';
  }

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen'
  ];

  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety'
  ];

  function convertLessThanThousand(number) {
    let result = '';

    if (number >= 100) {
      result += `${ones[Math.floor(number / 100)]} Hundred`;
      number %= 100;

      if (number > 0) {
        result += ' ';
      }
    }

    if (number >= 20) {
      result += tens[Math.floor(number / 10)];
      number %= 10;

      if (number > 0) {
        result += `-${ones[number]}`;
      }
    } else if (number > 0) {
      result += ones[number];
    }

    return result;
  }

  const parts = [];

  const billions = Math.floor(value / 1_000_000_000);
  const millions =
    Math.floor(
      (value % 1_000_000_000) /
        1_000_000
    );

  const thousands =
    Math.floor(
      (value % 1_000_000) /
        1_000
    );

  const remainder = value % 1_000;

  if (billions > 0) {
    parts.push(
      `${convertLessThanThousand(billions)} Billion`
    );
  }

  if (millions > 0) {
    parts.push(
      `${convertLessThanThousand(millions)} Million`
    );
  }

  if (thousands > 0) {
    parts.push(
      `${convertLessThanThousand(thousands)} Thousand`
    );
  }

  if (remainder > 0) {
    parts.push(
      convertLessThanThousand(remainder)
    );
  }

  return `${parts.join(' ')} Naira Only`;
}

// ─────────────────────────────────────────────
// HTML
// ─────────────────────────────────────────────

function buildHtml({
  receipt,
  logoData
}) {
  const customer =
    receipt.customer || {};

  const property =
    receipt.property || {};

  const payment =
    receipt.payment || {};

  const purchase =
    receipt.purchase || {};

  const amount =
    Number(payment.amount || 0);

  const agreedPrice =
    Number(purchase.agreedPrice || 0);

  const amountPaid =
    Number(purchase.amountPaid || 0);

  const outstandingBalance =
    Number(
      purchase.outstandingBalance ||
      Math.max(
        agreedPrice - amountPaid,
        0
      )
    );

  const paidPercentage =
    agreedPrice > 0
      ? Math.min(
          Math.round(
            (amountPaid / agreedPrice) *
              100
          ),
          100
        )
      : 0;

  const location = [
    property.location,
    property.city,
    property.state
  ]
    .filter(Boolean)
    .join(', ');

  const paymentMethod =
    payment.method || 'Payment';

  const reference =
    payment.reference || '-';

  const logo = logoData
    ? `<img src="data:image/png;base64,${logoData}" class="logo" alt="Heaven Ark Properties" />`
    : `<div class="logo-fallback"><div class="logo-mark">HA</div></div>`;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  * {
    box-sizing: border-box;
  }

  @page {
    size: 960px 540px;
    margin: 0;
  }

  html,
  body {
    width: 960px;
    height: 540px;
    margin: 0;
    padding: 0;
    background: ${WHITE};
    font-family:
      Arial,
      Helvetica,
      sans-serif;
    color: ${DARK};
  }

  body {
    overflow: hidden;
  }

  /* ─────────────────────────────
     RECEIPT
  ───────────────────────────── */

  .receipt {
    position: relative;
    width: 960px;
    height: 540px;
    overflow: hidden;
    background: ${WHITE};
    border: 1px solid ${BORDER};
  }

  .top-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${BLUE};
  }

  .gold-bar {
    position: absolute;
    top: 5px;
    left: 0;
    width: 33%;
    height: 3px;
    background: ${GOLD};
  }

  .content {
    position: absolute;
    top: 8px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 22px 38px 20px;
  }

  /* ─────────────────────────────
     HEADER
  ───────────────────────────── */

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding-bottom: 14px;
    border-bottom: 1px solid ${BORDER};
  }

  .logo-col {
    width: 150px;
    flex-shrink: 0;
  }

  .logo {
    width: 128px;
    height: 101px;
    object-fit: contain;
    object-position: left center;
  }

  .logo-fallback {
    width: 84px;
    height: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid ${GOLD};
    background: ${LIGHT};
  }

  .logo-mark {
    color: ${NAVY};
    font-size: 26px;
    font-weight: 900;
  }

  .title-col {
    flex: 1;
    text-align: center;
    padding-top: 26px;
  }

  .receipt-title {
    color: ${NAVY};
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 2.6px;
  }

  .info-col {
    width: 260px;
    flex-shrink: 0;
    text-align: right;
  }

  .company-name {
    color: ${NAVY};
    font-size: 15.5px;
    font-weight: 900;
    letter-spacing: 0.4px;
  }

  .tagline {
    margin-top: 4px;
    color: ${MUTED};
    font-size: 7.5px;
  }

  .company-contact {
    margin-top: 2px;
    color: ${MUTED};
    font-size: 7.5px;
  }

  .official-tag {
    margin-top: 2px;
    color: ${MUTED};
    font-size: 7px;
    letter-spacing: 0.5px;
  }

  /* ─────────────────────────────
     RECEIPT META
  ───────────────────────────── */

  .meta-row {
    display: flex;
    justify-content: space-between;
    margin-top: 14px;
  }

  .meta-item {
    text-align: left;
  }

  .meta-label {
    color: ${MUTED};
    font-size: 7px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .meta-value {
    margin-top: 4px;
    color: ${NAVY};
    font-size: 11px;
    font-weight: 800;
  }

  .status-value {
    color: ${GREEN};
  }

  /* ─────────────────────────────
     INFORMATION PANELS
  ───────────────────────────── */

  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 14px;
  }

  .panel {
    background: ${LIGHT};
    border: 1px solid ${BORDER};
    border-radius: 6px;
    padding: 14px 17px;
    height: 152px;
  }

  .panel-title {
    color: ${NAVY};
    font-size: 8.5px;
    font-weight: 900;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding-bottom: 8px;
    border-bottom: 1px solid ${BORDER};
    margin-bottom: 14px;
  }

  .field-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 12px;
  }

  .field-label {
    width: 62px;
    flex-shrink: 0;
    color: ${MUTED};
    font-size: 6.8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .field-value {
    color: ${DARK};
    font-size: 9px;
    font-weight: 700;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ─────────────────────────────
     FINANCIAL CARD
  ───────────────────────────── */

  .financial-card {
    display: grid;
    grid-template-columns: 1.35fr 1fr;
    gap: 20px;
    margin-top: 14px;
    padding: 18px 24px;
    background: ${LIGHT};
    border: 1px solid ${BORDER};
    border-radius: 8px;
  }

  .amount-label {
    color: ${MUTED};
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .amount {
    margin-top: 6px;
    color: ${BLUE};
    font-size: 29px;
    font-weight: 900;
    letter-spacing: -0.5px;
  }

  .amount-words {
    margin-top: 4px;
    color: ${MUTED};
    font-size: 8px;
  }

  .summary-title {
    color: ${NAVY};
    font-size: 8px;
    font-weight: 900;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-bottom: 9px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
    font-size: 8.5px;
  }

  .summary-row span:first-child {
    color: ${MUTED};
  }

  .summary-row strong {
    color: ${NAVY};
    font-weight: 800;
  }

  .summary-row.final span:first-child,
  .summary-row.final strong {
    color: ${GREEN};
  }

  /* ─────────────────────────────
     FOOTER
  ───────────────────────────── */

  .footer {
    position: absolute;
    left: 38px;
    right: 38px;
    bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .confirmation {
    color: ${MUTED};
    font-size: 7px;
    max-width: 640px;
  }

  .footer-brand {
    color: ${NAVY};
    font-size: 8px;
    font-weight: 900;
    letter-spacing: 0.4px;
  }
</style>
</head>
<body>
<div class="receipt">

  <div class="top-bar"></div>
  <div class="gold-bar"></div>

  <div class="content">

    <!-- HEADER -->

    <div class="header">

      <div class="logo-col">
        ${logo}
      </div>

      <div class="title-col">
        <div class="receipt-title">
          PAYMENT RECEIPT
        </div>
      </div>

      <div class="info-col">
        <div class="company-name">
          HEAVEN ARK PROPERTIES
        </div>

        <div class="tagline">
          Trusted Property. Secure Investment.
        </div>

        <div class="company-contact">
          Lagos, Nigeria &nbsp;&bull;&nbsp; +234 (0) 805 867 8439
        </div>

        <div class="official-tag">
          OFFICIAL PAYMENT RECEIPT
        </div>
      </div>

    </div>


    <!-- RECEIPT META -->

    <div class="meta-row">

      <div class="meta-item">
        <div class="meta-label">
          Receipt No.
        </div>
        <div class="meta-value">
          ${escapeHtml(
            receipt.receiptNumber
          )}
        </div>
      </div>

      <div class="meta-item">
        <div class="meta-label">
          Issue Date
        </div>
        <div class="meta-value">
          ${escapeHtml(
            formatDate(
              receipt.issuedAt
            )
          )}
        </div>
      </div>

      <div class="meta-item">
        <div class="meta-label">
          Status
        </div>
        <div class="meta-value status-value">
          &check; PAYMENT SUCCESSFUL
        </div>
      </div>

    </div>


    <!-- CUSTOMER + PROPERTY -->

    <div class="panels">

      <div class="panel">
        <div class="panel-title">
          Customer Information
        </div>

        <div class="field-row">
          <div class="field-label">Name</div>
          <div class="field-value">
            ${escapeHtml(
              customer.fullName ||
              'Customer'
            )}
          </div>
        </div>

        <div class="field-row">
          <div class="field-label">Email</div>
          <div class="field-value">
            ${escapeHtml(
              customer.email ||
              '-'
            )}
          </div>
        </div>

        <div class="field-row">
          <div class="field-label">Contact</div>
          <div class="field-value">
            ${escapeHtml(
              customer.phone ||
              '-'
            )}
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">
          Property &amp; Payment
        </div>

        <div class="field-row">
          <div class="field-label">Property</div>
          <div class="field-value">
            ${escapeHtml(
              property.title ||
              'Property'
            )}
          </div>
        </div>

        <div class="field-row">
          <div class="field-label">Location</div>
          <div class="field-value">
            ${escapeHtml(
              location ||
              '-'
            )}
          </div>
        </div>

        <div class="field-row">
          <div class="field-label">Method</div>
          <div class="field-value">
            ${escapeHtml(
              paymentMethod
            )}
          </div>
        </div>

        <div class="field-row">
          <div class="field-label">Reference</div>
          <div class="field-value">
            ${escapeHtml(
              reference
            )}
          </div>
        </div>
      </div>

    </div>


    <!-- FINANCIAL -->

    <div class="financial-card">

      <div>
        <div class="amount-label">
          Amount Paid
        </div>

        <div class="amount">
          &#8358;${money(amount)}
        </div>

        <div class="amount-words">
          ${escapeHtml(
            amountInWords(amount)
          )}
        </div>
      </div>

      <div>
        <div class="summary-title">
          Purchase Summary
        </div>

        <div class="summary-row">
          <span>Property Price</span>
          <strong>&#8358;${money(agreedPrice)}</strong>
        </div>

        <div class="summary-row">
          <span>Outstanding</span>
          <strong>&#8358;${money(outstandingBalance)}</strong>
        </div>

        <div class="summary-row final">
          <span>Paid: ${paidPercentage}%</span>
          <strong>&check; Approved</strong>
        </div>
      </div>

    </div>

  </div>


  <!-- FOOTER -->

  <div class="footer">
    <div class="confirmation">
      This receipt confirms the successful receipt and approval of the payment stated above. Please retain this document for your records.
    </div>
    <div class="footer-brand">
      HEAVEN ARK PROPERTIES
    </div>
  </div>

</div>
</body>
</html>
`;
}

// ─────────────────────────────────────────────
// PDF GENERATION
// ─────────────────────────────────────────────

export async function generateReceiptPdf({
  receipt
}) {
  if (!receipt) {
    throw new Error(
      'Receipt is required to generate a PDF'
    );
  }

  await fs.promises.mkdir(
    RECEIPT_DIRECTORY,
    {
      recursive: true
    }
  );

  /*
   * Official Heaven Ark Properties logo.
   *
   * Expected location:
   *
   * backend/src/modules/receipts/logo.png
   *
   * If the file is missing, a plain "HA" badge is rendered instead so
   * receipt generation never fails just because the logo asset wasn't
   * deployed.
   */

  const logoPath = path.join(
    __dirname,
    'logo.png'
  );

  let logoData = null;

  if (fs.existsSync(logoPath)) {
    logoData =
      await fs.promises.readFile(
        logoPath,
        {
          encoding: 'base64'
        }
      );
  }

  const html = buildHtml({
    receipt,
    logoData
  });

  const browser =
    await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

  try {
    const page =
      await browser.newPage();

    /*
     * IMPORTANT: do not set deviceScaleFactor here. It only affects
     * screenshot rasterization, not page.pdf() output, and combining it
     * with preferCSSPageSize has caused layout inconsistencies across
     * Chrome versions. Print resolution is controlled by the renderer,
     * not by the viewport's device pixel ratio.
     */
    await page.setViewport({
      width: 960,
      height: 540
    });

    await page.setContent(
      html,
      {
        waitUntil: 'networkidle0'
      }
    );

    const fileName =
      `${receipt.receiptNumber}.pdf`;

    const filePath =
      path.join(
        RECEIPT_DIRECTORY,
        fileName
      );

    /*
     * The PDF uses the exact CSS page size defined in @page: 960 × 540,
     * a true 16:9 landscape receipt matching the on-screen preview
     * (ReceiptTemplate.jsx) exactly.
     */
    await page.pdf({
      path: filePath,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      }
    });

    return filePath;
  } finally {
    await browser.close();
  }
}