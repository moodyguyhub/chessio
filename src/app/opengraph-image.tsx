import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Chessio - Learn Chess the Fun Way';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #F9FAFB, #E0E7FF)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: 100 }}>♟️</div>
          <h1 style={{ fontSize: 80, fontWeight: 'bold', color: '#1F2937' }}>Chessio</h1>
        </div>
        <p style={{ fontSize: 40, color: '#4B5563', marginTop: 20 }}>
          Learn chess, one move at a time.
        </p>
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            padding: '12px 32px',
            background: '#059669',
            borderRadius: 50,
            color: 'white',
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          Start Learning — It&apos;s Free
        </div>
      </div>
    ),
    { ...size }
  );
}
