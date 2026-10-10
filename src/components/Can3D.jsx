import { useEffect, useRef, useState } from 'react';
import { CanStage } from '../three/canStage';
import backs from '../lib/backs.json';

// Interactive 3D can built from the flat photo. Shows the photo until the model is ready,
// and stays on the photo if WebGL isn't available.
export default function Can3D({ src, alt, glow, hint = false }) {
  const host = useRef(null);
  const stage = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      stage.current = new CanStage(host.current, { onReady: () => setReady(true), onError: () => setFailed(true) });
    } catch {
      setFailed(true);
    }
    return () => {
      stage.current?.dispose();
      stage.current = null;
    };
  }, []);

  useEffect(() => {
    stage.current?.setCan(src, glow, backs[src]);
  }, [src, glow]);

  const live = ready && !failed;

  return (
    <div className={`can3d ${live ? 'is-live' : ''}`} ref={host} role="img" aria-label={alt}>
      {!live && <img key={src} className="can3d__photo" src={src} alt="" />}
      {live && hint && <span className="can3d__hint" aria-hidden="true">Trascina per ruotare</span>}
    </div>
  );
}
