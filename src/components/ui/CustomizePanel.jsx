import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomizePanel = ({ config, setConfig, onFinish }) => {
  const [activeTab, setActiveTab] = useState('ACCESSORIES');
  const [selectedLocal, setSelectedLocal] = useState(null);
  const themeRed = "#760707";

  const data = {
    ACCESSORIES: [
      { id: 'cowboy', name: 'Cowboy Hat', vid: '/videos/cowboy.mp4' },
      { id: 'glasses', name: 'Cinema Glasses', vid: '/videos/glasses.mp4' },
    ],
    HAIR: [
      { id: 'marilyn', name: 'Monroe Blonde', vid: '/videos/marilyn.mp4' }
    ],
   COLOR: [
      { id: 'pink', name: 'Pink', colorCode: '#cb186c' },
      { id: 'green', name: 'Green', colorCode: '#06973d' },
    ]

  };

  const isEquipped = () => {
    if (!selectedLocal) return false;
    if (activeTab === 'ACCESSORIES') return config?.acc === selectedLocal.id;
    if (activeTab === 'HAIR') return config?.hair === selectedLocal.id;
    if (activeTab === 'COLOR') return config?.skin === selectedLocal.id;
    return false;
  };

const handleEquipToggle = () => {
    if (!selectedLocal) return;
    const equipped = isEquipped();
    const val = equipped ? null : selectedLocal.id;

    if (activeTab === 'ACCESSORIES') setConfig({ ...config, acc: val });
    else if (activeTab === 'HAIR') setConfig({ ...config, hair: val });
    else if (activeTab === 'COLOR') setConfig({ ...config, skin: val });
  };
    return (
    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={panelStyle}>
      <div style={tabContainer}>
        {['ACCESSORIES', 'HAIR', 'COLOR'].map((tab) => (
          <div key={tab} onClick={() => {setActiveTab(tab); setSelectedLocal(null);}} 
            style={{...tabBtn, color: activeTab === tab ? '#fff' : '#555', borderBottom: activeTab === tab ? `2px solid ${themeRed}` : '2px solid transparent'}}>
            {tab}
          </div>
        ))}
      </div>

      <div style={contentBody}>
        <p style={label}>{activeTab} OPTIONS</p>
        <div style={optionGrid}>
          {data[activeTab].map((item) => {
            const active = (activeTab === 'ACCESSORIES' && config?.acc === item.id) || (activeTab === 'HAIR' && config?.hair === item.id) || (activeTab === 'COLOR' && config?.skin === item.id);
            return (
              <div key={item.id} onClick={() => setSelectedLocal(item)} 
                style={{...optionBox, border: (selectedLocal?.id === item.id || active) ? `2px solid ${themeRed}` : '1px solid #222'}}>
                {activeTab === 'COLOR' ? <div style={{...boxInner, background: item.id}} /> : <video src={item.vid} autoPlay loop muted playsInline style={videoStyle} />}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedLocal && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onClick={handleEquipToggle} style={{...equipBtn, background: isEquipped() ? themeRed : 'transparent', borderColor: themeRed}}>
            {isEquipped() ? `UNEQUIP ${selectedLocal.name.toUpperCase()}` : `EQUIP ${selectedLocal.name.toUpperCase()}`}
          </motion.button>
        )}
      </AnimatePresence>
      <button onClick={onFinish} style={actionBtn}>CONFIRM IDENTITY</button>
    </motion.div>
  );
};

const panelStyle = { position: 'absolute', right: '50px', top: '15%', transform: 'translateY(-50%)', width: '340px', background: 'rgba(10, 0, 0, 0.6)', backdropFilter: 'blur(15px)', padding: '40px', borderRadius: '5px', border: '1px solid rgba(81, 7, 7, 0.7)', zIndex: 100, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)' };
const tabContainer = { display: 'flex', justifyContent: 'space-between', marginBottom: '25px' };
const tabBtn = { cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', transition: '0.3s', paddingBottom: '10px', flex: 1, textAlign: 'center' };
const contentBody = { minHeight: '220px' };
const label = { color: '#888', fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '20px' };
const optionGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' };
const optionBox = { aspectRatio: '1/1', background: 'rgba(255,255,255,0.03)', border: '1px solid #222', cursor: 'pointer', overflow: 'hidden' };
const boxInner = { width: '100%', height: '100%' };
const videoStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const equipBtn = { width: '100%', padding: '12px', color: '#fff', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.7rem' };
const actionBtn = { width: '100%', padding: '15px', background: '#760707', color: '#fff', border: 'none', marginTop: '40px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px' };

export default CustomizePanel;