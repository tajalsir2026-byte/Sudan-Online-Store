import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QrCodeDisplayProps {
  /** The data to encode (e.g. ZATCA TLV Base64 string) */
  data: string;
  /** SVG width/height in pixels */
  size?: number;
  /** Optional className for the wrapper */
  className?: string;
  /** Error correction level */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Real, scannable QR code React component.
 * Uses the `qrcode` library to generate actual QR codes that can be
 * scanned by any standard QR reader (including ZATCA compliance apps).
 */
export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  data,
  size = 120,
  className = '',
  errorCorrectionLevel = 'M',
}) => {
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!data) return;

    let cancelled = false;

    QRCode.toString(data, {
      type: 'svg',
      errorCorrectionLevel,
      margin: 1,
      width: size,
    })
      .then((svg) => {
        if (!cancelled) {
          // Inject crispEdges for sharp thermal printing
          setSvgHtml(svg.replace('<svg', `<svg shape-rendering="crispEdges"`));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[QrCodeDisplay] QR generation failed:', err);
          setError('QR Error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [data, size, errorCorrectionLevel]);

  if (error) {
    return (
      <div
        className={className}
        style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <span style={{ fontSize: 10, color: '#999' }}>{error}</span>
      </div>
    );
  }

  if (!svgHtml) {
    // Loading placeholder
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          background: '#f1f5f9',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 9, color: '#94a3b8' }}>…</span>
      </div>
    );
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: svgHtml }} />;
};
