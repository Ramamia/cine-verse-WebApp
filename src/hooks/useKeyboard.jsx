import { useEffect, useState } from 'react';

export const useKeyboard = () => {
  const [actions, setActions] = useState({
    forward: false, backward: false, left: false, right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === 'arrowup'    || key === 'w') setActions((a) => ({ ...a, forward:  true }));
      if (key === 'arrowdown'  || key === 's') setActions((a) => ({ ...a, backward: true }));
      if (key === 'arrowleft'  || key === 'a') setActions((a) => ({ ...a, left:     true }));
      if (key === 'arrowright' || key === 'd') setActions((a) => ({ ...a, right:    true }));
    };

    const handleKeyUp = (e) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === 'arrowup'    || key === 'w') setActions((a) => ({ ...a, forward:  false }));
      if (key === 'arrowdown'  || key === 's') setActions((a) => ({ ...a, backward: false }));
      if (key === 'arrowleft'  || key === 'a') setActions((a) => ({ ...a, left:     false }));
      if (key === 'arrowright' || key === 'd') setActions((a) => ({ ...a, right:    false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup',   handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup',   handleKeyUp);
    };
  }, []);

  return actions;
};
