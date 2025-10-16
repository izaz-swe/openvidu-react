'use client';

import React, { useEffect } from 'react';
import { Track } from 'livekit-client';
import { useTrackToggle } from '@livekit/components-react';

export function KeyboardShortcuts() {
  const { toggle: toggleMic } = useTrackToggle({ source: Track.Source.Microphone });
  const { toggle: toggleCamera } = useTrackToggle({ source: Track.Source.Camera });

  useEffect(() => {
    function handleShortcut(event) {
      // Toggle microphone: Ctrl/Cmd + Shift + A
      if (toggleMic && event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
        event.preventDefault();
        toggleMic();
      }

      // Toggle camera: Ctrl/Cmd + Shift + V
      if (toggleCamera && event.key.toLowerCase() === 'v' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
        event.preventDefault();
        toggleCamera();
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, [toggleMic, toggleCamera]);

  return null;
}
