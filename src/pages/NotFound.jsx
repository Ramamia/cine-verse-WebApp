import React from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Cinematic 404 — Broken Movie Ticket ──────────────────────────────────────
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      {/* scanline overlay for that retro projector feel */}
      <div style={scanlineOverlay} />

      {/* floating film reel perforations on the left */}
      <div style={filmStripLeft}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={`l-${i}`} style={perforation} />
        ))}
      </div>

      {/* floating film reel perforations on the right */}
      <div style={filmStripRight}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={`r-${i}`} style={perforation} />
        ))}
      </div>

      {/* the ticket itself */}
      <div style={ticketContainer}>
        {/* top half of the torn ticket */}
        <div style={ticketTop}>
          <div style={ticketHeader}>
            <span style={theaterName}>★ CINEVERSE ★</span>
            <span style={ticketSubLabel}>ADMIT ONE</span>
          </div>

          <div style={errorCodeContainer}>
            <span style={errorCode}>4</span>
            <span style={errorCodeMiddle}>0</span>
            <span style={errorCode}>4</span>
          </div>

          <p style={errorTagline}>SCENE NOT FOUND</p>
        </div>

        {/* the torn edge between the two halves */}
        <div style={tornEdge}>
          <svg width="100%" height="20" viewBox="0 0 400 20" preserveAspectRatio="none">
            <path
              d="M0,10 Q10,0 20,10 Q30,20 40,10 Q50,0 60,10 Q70,20 80,10 Q90,0 100,10 Q110,20 120,10 Q130,0 140,10 Q150,20 160,10 Q170,0 180,10 Q190,20 200,10 Q210,0 220,10 Q230,20 240,10 Q250,0 260,10 Q270,20 280,10 Q290,0 300,10 Q310,20 320,10 Q330,0 340,10 Q350,20 360,10 Q370,0 380,10 Q390,20 400,10"
              stroke="#760707"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4,3"
              opacity="0.6"
            />
          </svg>
          {/* the little cut-out circles on the ticket sides */}
          <div style={{ ...ticketNotch, left: '-12px' }} />
          <div style={{ ...ticketNotch, right: '-12px' }} />
        </div>

        {/* bottom stub of the torn ticket */}
        <div style={ticketBottom}>
          <p style={stubText}>
            The reel you're looking for has been<br />
            <span style={{ color: '#ff4b4b', fontWeight: 'bold' }}>lost in the projector room.</span>
          </p>

          <div style={stubDetails}>
            <span style={stubDetailItem}>SCREEN: <b>N/A</b></span>
            <span style={stubDetailItem}>SEAT: <b>---</b></span>
            <span style={stubDetailItem}>DATE: <b>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</b></span>
          </div>

          <div style={barcodeContainer}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={`bar-${i}`}
                style={{
                  width: Math.random() > 0.5 ? '3px' : '1.5px',
                  height: '22px',
                  background: `rgba(118, 7, 7, ${0.3 + Math.random() * 0.5})`,
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => navigate('/hub')}
            style={returnBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#760707';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(118, 7, 7, 0.6), inset 0 0 30px rgba(118, 7, 7, 0.2)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(118, 7, 7, 0.25)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(118, 7, 7, 0.3)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ◄ RETURN TO LOBBY
          </button>
        </div>
      </div>

      {/* glitch animation + scanline keyframes */}
      <style>{`
        @keyframes flicker404 {
          0%, 100% { opacity: 1; }
          5% { opacity: 0.8; }
          10% { opacity: 1; }
          15% { opacity: 0.6; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          85% { opacity: 0.7; text-shadow: 0 0 40px #ff4b4b, 2px 0 #ff0000, -2px 0 #760707; }
          90% { opacity: 1; }
        }

        @keyframes glitchShift {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 2px); }
        }

        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        @keyframes floatFilm {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(118, 7, 7, 0.3); }
          50% { box-shadow: 0 0 40px rgba(118, 7, 7, 0.6), 0 0 80px rgba(118, 7, 7, 0.15); }
        }
      `}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const pageStyle = {
  position: 'fixed',
  inset: 0,
  background: 'radial-gradient(ellipse at center, #1a0808 0%, #0a0404 50%, #000000 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  fontFamily: "'Courier New', monospace",
  zIndex: 99999,
};

const scanlineOverlay = {
  position: 'absolute',
  inset: 0,
  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
  pointerEvents: 'none',
  animation: 'scanlines 0.3s linear infinite',
  zIndex: 2,
};

const filmStripLeft = {
  position: 'absolute',
  left: '30px',
  top: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '18px',
  animation: 'floatFilm 4s ease-in-out infinite',
  opacity: 0.25,
};

const filmStripRight = {
  position: 'absolute',
  right: '30px',
  top: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '18px',
  animation: 'floatFilm 4s ease-in-out infinite 1s',
  opacity: 0.25,
};

const perforation = {
  width: '14px',
  height: '10px',
  borderRadius: '2px',
  border: '1px solid #760707',
  background: 'rgba(118, 7, 7, 0.1)',
};

const ticketContainer = {
  position: 'relative',
  width: '380px',
  zIndex: 3,
  animation: 'pulseGlow 3s ease-in-out infinite',
};

const ticketTop = {
  background: 'linear-gradient(135deg, rgba(20, 5, 5, 0.95) 0%, rgba(30, 8, 8, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(118, 7, 7, 0.5)',
  borderBottom: 'none',
  borderRadius: '12px 12px 0 0',
  padding: '35px 30px 25px',
  textAlign: 'center',
};

const ticketHeader = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '5px',
  marginBottom: '25px',
};

const theaterName = {
  color: '#760707',
  fontSize: '0.85rem',
  fontWeight: 'bold',
  letterSpacing: '6px',
  textTransform: 'uppercase',
};

const ticketSubLabel = {
  color: '#553333',
  fontSize: '0.55rem',
  letterSpacing: '8px',
  textTransform: 'uppercase',
};

const errorCodeContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '15px',
};

const errorCode = {
  fontSize: '5rem',
  fontWeight: '900',
  color: '#fff',
  textShadow: '0 0 30px rgba(118, 7, 7, 0.8), 0 0 60px rgba(118, 7, 7, 0.3)',
  lineHeight: 1,
  animation: 'flicker404 4s ease-in-out infinite',
};

const errorCodeMiddle = {
  fontSize: '5rem',
  fontWeight: '900',
  color: '#760707',
  textShadow: '0 0 40px rgba(118, 7, 7, 1), 0 0 80px rgba(255, 75, 75, 0.4)',
  lineHeight: 1,
  animation: 'glitchShift 2s ease-in-out infinite',
};

const errorTagline = {
  color: '#ff4b4b',
  fontSize: '0.8rem',
  letterSpacing: '6px',
  margin: 0,
  textTransform: 'uppercase',
  textShadow: '0 0 10px rgba(255, 75, 75, 0.5)',
};

const tornEdge = {
  position: 'relative',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(90deg, rgba(20, 5, 5, 0.95), rgba(30, 8, 8, 0.95))',
  borderLeft: '1px solid rgba(118, 7, 7, 0.5)',
  borderRight: '1px solid rgba(118, 7, 7, 0.5)',
};

const ticketNotch = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: '#000',
  border: '1px solid rgba(118, 7, 7, 0.4)',
};

const ticketBottom = {
  background: 'linear-gradient(135deg, rgba(20, 5, 5, 0.95) 0%, rgba(30, 8, 8, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(118, 7, 7, 0.5)',
  borderTop: 'none',
  borderRadius: '0 0 12px 12px',
  padding: '20px 30px 30px',
  textAlign: 'center',
};

const stubText = {
  color: '#999',
  fontSize: '0.75rem',
  letterSpacing: '1.5px',
  lineHeight: '1.8',
  margin: '0 0 20px 0',
};

const stubDetails = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '20px',
  padding: '10px 0',
  borderTop: '1px dashed rgba(118, 7, 7, 0.3)',
  borderBottom: '1px dashed rgba(118, 7, 7, 0.3)',
};

const stubDetailItem = {
  color: '#666',
  fontSize: '0.6rem',
  letterSpacing: '1px',
  textTransform: 'uppercase',
};

const barcodeContainer = {
  display: 'flex',
  justifyContent: 'center',
  gap: '2px',
  marginBottom: '25px',
  padding: '8px 0',
};

const returnBtn = {
  width: '100%',
  padding: '14px',
  background: 'rgba(118, 7, 7, 0.25)',
  border: '1px solid #760707',
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  letterSpacing: '3px',
  cursor: 'pointer',
  fontFamily: "'Courier New', monospace",
  borderRadius: '4px',
  transition: 'all 0.3s ease',
  boxShadow: '0 0 15px rgba(118, 7, 7, 0.3)',
};
