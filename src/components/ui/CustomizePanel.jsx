import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  panelStyle, tabContainer, tabBtn, contentBody, label,
  optionGrid, optionBox, boxInner, videoStyle,
  equipBtn, customizeActionBtn,
} from '../../styles/componentStyles';
import { colors } from '../../styles/theme';
import NicknameInput from './NicknameInput';
import { api } from '../../services/api';

const TABS = ['COLOR', 'ACCESSORIES', 'HAIR'];

// default catalog structure — video URLs get populated from the API
const DEFAULT_CATALOG = {
  ACCESSORIES: [
    { id: 'cowboy',  name: 'Cowboy Hat',      vid: null },
    { id: 'glasses', name: 'Cinema Glasses',  vid: null },
  ],
  HAIR: [
    { id: 'marilyn', name: 'Monroe Blonde', vid: null },
  ],
  COLOR: [
    { id: 'pink',  name: 'Pink',  colorCode: '#cb186c' },
    { id: 'green', name: 'Green', colorCode: '#06973d' },
  ],
};

const CustomizePanel = ({ config, setConfig, user, setUser, onFinish }) => {
  const [activeTab,    setActiveTab]    = useState('COLOR');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [CATALOG, setCATALOG] = useState(DEFAULT_CATALOG);

  // fetch video URLs from the assets API so we don't rely on local files
  useEffect(() => {
    api.getAssets('videos')
      .then(res => {
        const assets = res.assets || [];
        // build a map: "cowboy" → "https://res.cloudinary.com/..."
        const videoMap = {};
        assets.forEach(a => {
          // asset names look like "videos_cowboy.mp4"
          const key = a.name.replace(/^videos_/, '').replace(/\.\w+$/, '').toLowerCase();
          videoMap[key] = a.url;
        });

        setCATALOG(prev => ({
          ...prev,
          ACCESSORIES: prev.ACCESSORIES.map(item => ({
            ...item,
            vid: videoMap[item.id] || item.vid,
          })),
          HAIR: prev.HAIR.map(item => ({
            ...item,
            vid: videoMap[item.id] || item.vid,
          })),
        }));
      })
      .catch(err => console.error('Failed to load video assets:', err));
  }, []);

  const hasChosenColor = config?.skin === 'pink' || config?.skin === 'green';

  const isEquipped = () => {
    if (!selectedItem) return false;
    if (activeTab === 'ACCESSORIES') return config?.acc  === selectedItem.id;
    if (activeTab === 'HAIR')        return config?.hair === selectedItem.id;
    if (activeTab === 'COLOR')       return config?.skin === selectedItem.id;
    return false;
  };

  const handleEquipToggle = () => {
    if (!selectedItem) return;
    const newVal = isEquipped() ? null : selectedItem.id;
    if (activeTab === 'ACCESSORIES') {
      setConfig({ ...config, acc: newVal, hair: null });
    } else if (activeTab === 'HAIR') {
      setConfig({ ...config, hair: newVal, acc: null });
    } else if (activeTab === 'COLOR') {
      if (newVal === null) {
        // Reset to default skin and clear accessories/hair
        setConfig({ skin: '#ffdbac', acc: null, hair: null });
      } else {
        setConfig({ ...config, skin: newVal });
      }
    }
  };

  const isActive = (item) =>
    (activeTab === 'ACCESSORIES' && config?.acc  === item.id) ||
    (activeTab === 'HAIR'        && config?.hair === item.id) ||
    (activeTab === 'COLOR'       && config?.skin === item.id);

  const handleConfirm = async () => {
    if (!user || !user.nickname || !user.nickname.trim()) {
      window.dispatchEvent(new CustomEvent('show-alert', { detail: 'PLEASE CHOOSE A NICKNAME BEFORE CONFIRMING YOUR IDENTITY.' }));
      return;
    }
    
    setIsSaving(true);
    try {
      await api.updateProfile({
        avatar_skin: config.skin,
        avatar_acc: config.acc
      });
      onFinish();
    } catch (err) {
      window.dispatchEvent(new CustomEvent('show-alert', { detail: 'FAILED TO UPDATE PROFILE: ' + err.message.toUpperCase() }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={panelStyle}>

      {/* Tabs */}
      <div style={tabContainer}>
        {TABS.map((tab) => {
          const isDisabled = (tab === 'ACCESSORIES' || tab === 'HAIR') && !hasChosenColor;
          return (
            <div
              key={tab}
              onClick={() => {
                if (isDisabled) return;
                setActiveTab(tab);
                setSelectedItem(null);
              }}
              style={{
                ...tabBtn,
                color:        isDisabled ? '#444' : (activeTab === tab ? '#fff' : '#888'),
                cursor:       isDisabled ? 'not-allowed' : 'pointer',
                borderBottom: activeTab === tab ? `2px solid ${colors.themeRed}` : '2px solid transparent',
                opacity:      isDisabled ? 0.4 : 1,
              }}
            >
              {tab} {isDisabled && ' (LOCKED)'}
            </div>
          );
        })}
      </div>

      {/* Options grid */}
      <div style={contentBody}>
        <p style={label}>{activeTab} OPTIONS</p>

        {!hasChosenColor && (
          <div style={{
            background: 'rgba(203, 24, 108, 0.1)',
            border: '1px solid rgba(203, 24, 108, 0.3)',
            borderRadius: '6px',
            padding: '12px',
            margin: '0 0 15px 0',
            color: '#cb186c',
            fontSize: '0.8rem',
            textAlign: 'center',
            letterSpacing: '1px',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            ATTENTION: CHOOSE A SKIN COLOR FIRST TO UNLOCK ACCESSORIES
          </div>
        )}

        <div style={optionGrid}>
          {CATALOG[activeTab].map((item) => {
            const isComingSoon = item.id === 'glasses' || item.id === 'marilyn';
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isComingSoon) return;
                  setSelectedItem(item);
                }}
                style={{
                  ...optionBox,
                  position: 'relative',
                  cursor: isComingSoon ? 'not-allowed' : 'pointer',
                  border: (selectedItem?.id === item.id || isActive(item))
                    ? `2px solid ${colors.themeRed}`
                    : '1px solid #222',
                  opacity: isComingSoon ? 0.65 : 1,
                }}
              >
                {activeTab === 'COLOR'
                  ? <div style={{ ...boxInner, background: item.colorCode }} />
                  : <video src={item.vid} autoPlay loop muted playsInline style={videoStyle} />}
                
                {isComingSoon && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(3px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ff4b4b',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 75, 75, 0.3)',
                    padding: '4px'
                  }}>
                    COMING SOON
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Equip / Unequip */}
      <AnimatePresence>
        {selectedItem && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleEquipToggle}
            style={{
              ...equipBtn,
              background:   isEquipped() ? colors.themeRed : 'transparent',
              borderColor:  colors.themeRed,
            }}
          >
            {isEquipped()
              ? `UNEQUIP ${selectedItem.name.toUpperCase()}`
              : `EQUIP ${selectedItem.name.toUpperCase()}`}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Nickname input */}
      <NicknameInput 
        nickname={user?.nickname || ''} 
        setNickname={(name) => setUser(prev => ({ ...prev, nickname: name }))} 
      />

      <button onClick={handleConfirm} disabled={isSaving} style={{...customizeActionBtn, opacity: isSaving ? 0.7 : 1}}>
        {isSaving ? 'SAVING...' : 'CONFIRM IDENTITY'}
      </button>
    </motion.div>
  );
};

export default CustomizePanel;
