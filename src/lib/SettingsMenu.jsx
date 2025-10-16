import * as React from 'react';
import {
  useMaybeLayoutContext,
  MediaDeviceMenu,
  useRoomContext,
  useIsRecording,
} from '@livekit/components-react';
import styles from '../styles/SettingsMenu.module.css';
import { CameraSettings } from './CameraSettings';
import { MicrophoneSettings } from './MicrophoneSettings';

export function SettingsMenu(props) {
  const layoutContext = useMaybeLayoutContext();
  const room = useRoomContext();
  const recordingEndpoint = process.env.NEXT_PUBLIC_LK_RECORD_ENDPOINT;

  const settings = React.useMemo(() => {
    return {
      media: { camera: true, microphone: true, label: 'Media Devices', speaker: true },
      // only show "Recording" tab when endpoint is configured
      recording: recordingEndpoint ? { label: 'Recording' } : undefined,
    };
  }, [recordingEndpoint]);

  const tabs = React.useMemo(() => {
    return Object.keys(settings).filter((t) => settings[t] !== undefined);
  }, [settings]);

  const [activeTab, setActiveTab] = React.useState(tabs[0]);

  const isRecording = useIsRecording();
  const [initialRecStatus, setInitialRecStatus] = React.useState(isRecording);
  const [processingRecRequest, setProcessingRecRequest] = React.useState(false);

  React.useEffect(() => {
    if (initialRecStatus !== isRecording) {
      setProcessingRecRequest(false);
    }
  }, [isRecording, initialRecStatus]);

  const toggleRoomRecording = async () => {
    if (!recordingEndpoint) {
      throw new TypeError('No recording endpoint specified');
    }
    if (room.isE2EEEnabled) {
      throw new Error('Recording of encrypted meetings is currently not supported');
    }
    setProcessingRecRequest(true);
    setInitialRecStatus(isRecording);

    const url =
      recordingEndpoint + (isRecording ? `/stop?roomName=${room.name}` : `/start?roomName=${room.name}`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          'Error handling recording request, check server logs:',
          response.status,
          response.statusText,
        );
        setProcessingRecRequest(false);
      }
    } catch (err) {
      console.error('Recording toggle error:', err);
      setProcessingRecRequest(false);
    }
  };

  return (
    <div className="settings-menu" style={{ width: '100%', position: 'relative' }} {...props}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            className={`${styles.tab} lk-button`}
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-pressed={tab === activeTab}
          >
            {settings[tab]?.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'media' && (
          <>
            {settings.media?.camera && (
              <>
                <h3>Camera</h3>
                <section>
                  <CameraSettings />
                </section>
              </>
            )}

            {settings.media?.microphone && (
              <>
                <h3>Microphone</h3>
                <section>
                  <MicrophoneSettings />
                </section>
              </>
            )}

            {settings.media?.speaker && (
              <>
                <h3>Speaker &amp; Headphones</h3>
                <section className="lk-button-group">
                  <span className="lk-button">Audio Output</span>
                  <div className="lk-button-group-menu">
                    <MediaDeviceMenu kind="audiooutput" />
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {activeTab === 'recording' && settings.recording && (
          <>
            <h3>Record Meeting</h3>
            <section>
              <p>
                {isRecording
                  ? 'Meeting is currently being recorded'
                  : 'No active recordings for this meeting'}
              </p>
              <button disabled={processingRecRequest} onClick={toggleRoomRecording}>
                {isRecording ? 'Stop' : 'Start'} Recording
              </button>
            </section>
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <button
          className="lk-button"
          onClick={() => layoutContext?.widget?.dispatch?.({ msg: 'toggle_settings' })}
        >
          Close
        </button>
      </div>
    </div>
  );
}
