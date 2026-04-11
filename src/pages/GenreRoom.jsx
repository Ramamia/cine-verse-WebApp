export default function GenreRoom({ genre, onBack }) {
  return (
    <>
      <div style={genreUI}>
        <button onClick={onBack} style={backBtn}>← BACK TO ROTUNDA</button>
        <h1 style={genreTitle}>{genre.toUpperCase()} VAULT</h1>
      </div>
      
      {/* 3D Content for each genre */}
      {genre === 'romcom' && <RomComScene />}
      {genre === 'horror' && <HorrorScene />}
      {genre === 'scifi' && <SciFiScene />}
    </>
  );
}

const genreUI = { position: 'absolute', top: '40px', left: '40px', zIndex: 100 };
const backBtn = { background: 'none', border: '1px solid #760707', color: '#fff', padding: '10px 20px', cursor: 'pointer', letterSpacing: '2px', fontSize: '0.7rem' };
const genreTitle = { color: '#fff', letterSpacing: '10px', marginTop: '20px' };