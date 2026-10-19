/**
 * Electronic Receipt QR generator complying with standard Tag-Length-Value (TLV) structure:
 * Tag 1: Seller's Name
 * Tag 2: VAT Registration Number / Commercial Number
 * Tag 3: Time stamp (ISO8601)
 * Tag 4: Invoice total amount (with VAT/inclusive)
 * Tag 5: VAT total
 *
 * Uses the real `qrcode` library for scannable QR codes.
 */

import QRCode from 'qrcode';

function toTLV(tag: number, value: string): Uint8Array {
  const encoder = new TextEncoder();
  const valueBytes = encoder.encode(value);
  const length = valueBytes.length;
  const tlv = new Uint8Array(2 + length);
  tlv[0] = tag;
  tlv[1] = length;
  tlv.set(valueBytes, 2);
  return tlv;
}

/**
 * Generate the ZATCA-compliant TLV Base64 payload from receipt data.
 */
export function generateZatcaTlvBase64(params: {
  sellerName: string;
  taxNumber: string;
  timestamp: string;
  totalWithVat: string;
  vatTotal: string;
}): string {
  const t1 = toTLV(1, params.sellerName);
  const t2 = toTLV(2, params.taxNumber);
  const t3 = toTLV(3, params.timestamp);
  const t4 = toTLV(4, params.totalWithVat);
  const t5 = toTLV(5, params.vatTotal);

  const totalLength = t1.length + t2.length + t3.length + t4.length + t5.length;
  const combined = new Uint8Array(totalLength);

  let offset = 0;
  combined.set(t1, offset);
  offset += t1.length;
  combined.set(t2, offset);
  offset += t2.length;
  combined.set(t3, offset);
  offset += t3.length;
  combined.set(t4, offset);
  offset += t4.length;
  combined.set(t5, offset);

  // Convert binary to base64
  let binary = '';
  for (let i = 0; i < combined.byteLength; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return btoa(binary);
}

/**
 * Generates a REAL, SCANNABLE SVG QR code using the `qrcode` library.
 * The returned SVG can be embedded in receipts, printed on thermal printers,
 * and scanned by any standard QR reader (including ZATCA compliance apps).
 *
 * @param data - The string/data to encode (usually a ZATCA TLV Base64 payload)
 * @param size - The SVG width/height in pixels (default 120)
 * @returns A promise resolving to a valid SVG string
 */
export async function generateQrSvg(data: string, size = 120): Promise<string> {
  try {
    const svgString = await QRCode.toString(data, {
      type: 'svg',
      errorCorrectionLevel: 'M', // Medium — good balance for thermal prints
      margin: 1,
      width: size,
      scale: undefined,
    });
    // Ensure the SVG has crispEdges for thermal printing clarity
    return svgString.replace(
      '<svg',
      `<svg shape-rendering="crispEdges" width="${size}" height="${size}"`
    );
  } catch (err) {
    console.error('[QR] Failed to generate real QR code:', err);
    // Fallback: return a placeholder SVG indicating failure
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="#fff"/>
      <text x="${size / 2}" y="${size / 2}" text-anchor="middle" font-size="10" fill="#999">QR Error</text>
    </svg>`;
  }
}

/**
 * Generates a real QR code as a Data URL (base64 PNG) — useful for canvas/printing.
 */
export async function generateQrDataUrl(data: string, size = 200): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: size,
    });
  } catch (err) {
    console.error('[QR] Failed to generate QR data URL:', err);
    return '';
  }
}
