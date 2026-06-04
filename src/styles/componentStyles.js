// ─── AuthModal ────────────────────────────────────────────────────────────────
export const authOverlay = {
  position: 'absolute', inset: 0, zIndex: 100,
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  paddingTop: '30vh', pointerEvents: 'none',
};

export const authGlassPanel = {
  pointerEvents: 'auto', background: 'rgba(15, 0, 0, 0.6)', backdropFilter: 'blur(2px)',
  padding: '30px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
  textAlign: 'center', width: '300px', boxShadow: '0 25px 50px rgba(0,0,0,0.9)',
};

export const authToggleContainer = { display: 'flex', justifyContent: 'space-around', marginBottom: '25px' };
export const authSwitchBtn = {
  cursor: 'pointer', paddingBottom: '8px', fontSize: '0.75rem',
  fontWeight: 'bold', letterSpacing: '2px', transition: '0.3s',
};
export const authTitle    = { color: '#fff', fontSize: '1.1rem', letterSpacing: '3px', margin: '0 0 5px 0' };
export const authSubtitle = { color: '#888', fontSize: '0.75rem', fontStyle: 'italic', letterSpacing: '1px' };
export const authInput    = {
  width: '100%', padding: '12px', margin: '8px 0', background: 'rgba(0,0,0,0.7)',
  border: '1px solid #3a0404', color: '#fff', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
};
export const authActionBtn = {
  width: '100%', padding: '14px', border: 'none', color: '#fff',
  fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px', marginTop: '15px',
  fontSize: '0.8rem', borderRadius: '2px',
};

// ─── Header ───────────────────────────────────────────────────────────────────
export const headerStyle = {
  position: 'absolute', top: '30px', width: '100%',
  textAlign: 'center', zIndex: 101, pointerEvents: 'none',
};
export const logoStyle = {
  height: '120px', marginBottom: '-3px', marginTop: '-30px',
  filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.95))', transition: 'filter 0.3s ease',
};
export const headlineStyle = {
  color: '#ffffff', fontSize: '1.3rem', fontWeight: '800', letterSpacing: '8px',
  textTransform: 'uppercase', margin: '0 0 5px 0', textShadow: '0 0 20px rgba(255,255,255,0.2)',
};
export const taglineStyle = {
  color: '#9b6868', fontSize: '0.9rem', letterSpacing: '4px',
  textTransform: 'uppercase', lineHeight: '1.4', fontWeight: '420', margin: 0,
};

// ─── CustomizePanel ───────────────────────────────────────────────────────────
export const panelStyle = {
  position: 'absolute', right: '50px', top: '10%', transform: 'translateY(-50%)',
  width: '340px', background: 'rgba(10, 0, 0, 0.6)', backdropFilter: 'blur(15px)',
  padding: '30px', borderRadius: '5px', border: '1px solid rgba(81, 7, 7, 0.7)',
  zIndex: 100, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
};
export const tabContainer  = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
export const tabBtn        = { cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', transition: '0.3s', paddingBottom: '10px', flex: 1, textAlign: 'center' };
export const contentBody   = { minHeight: '220px' };
export const label         = { color: '#888', fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '20px' };
export const optionGrid    = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' };
export const optionBox     = { aspectRatio: '1/1', background: 'rgba(255,255,255,0.03)', border: '1px solid #222', cursor: 'pointer', overflow: 'hidden' };
export const boxInner      = { width: '100%', height: '100%' };
export const videoStyle    = { width: '100%', height: '100%', objectFit: 'cover' };
export const equipBtn      = { width: '100%', padding: '12px', color: '#fff', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.7rem' };
export const customizeActionBtn = { width: '100%', padding: '15px', background: '#760707', color: '#fff', border: 'none', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px' };
