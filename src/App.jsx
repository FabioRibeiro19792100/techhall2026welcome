import { useEffect, useRef } from 'react';
import sourceHtml from '../tec-hall-s2.html?raw';

export default function App() {
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame) {
      return undefined;
    }

    let resizeTimer;

    const resizeFrame = () => {
      try {
        const doc = frame.contentDocument;

        if (!doc) {
          return;
        }

        const body = doc.body;
        const html = doc.documentElement;
        const height = Math.max(
          body?.scrollHeight ?? 0,
          body?.offsetHeight ?? 0,
          html?.clientHeight ?? 0,
          html?.scrollHeight ?? 0,
          html?.offsetHeight ?? 0,
        );

        frame.style.height = `${height}px`;
      } catch {
        frame.style.height = '100vh';
      }
    };

    const onLoad = () => {
      resizeFrame();

      try {
        frame.contentWindow?.addEventListener('resize', resizeFrame);
        frame.contentDocument?.fonts?.ready?.then(resizeFrame);
      } catch {
        // Ignore iframe access errors and keep a sensible fallback height.
      }

      resizeTimer = window.setTimeout(resizeFrame, 300);
    };

    frame.addEventListener('load', onLoad);

    return () => {
      frame.removeEventListener('load', onLoad);
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }
      try {
        frame.contentWindow?.removeEventListener('resize', resizeFrame);
      } catch {
        // No-op cleanup fallback.
      }
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      title="Tech Hall"
      srcDoc={sourceHtml}
      style={{
        width: '100%',
        minHeight: '100vh',
        border: 0,
        display: 'block',
        background: '#f5f3ee',
      }}
    />
  );
}
