import * as React from 'react';
import { useRoomContext } from '@livekit/components-react';
import { setLogLevel, LogLevel, setLogExtension } from 'livekit-client';
import { tinykeys } from 'tinykeys';
import { datadogLogs } from '@datadog/browser-logs';

import styles from '../styles/Debug.module.css';

export const useDebugMode = ({ logLevel }) => {
  const room = useRoomContext();

  React.useEffect(() => {
    setLogLevel(logLevel ?? 'debug');

    if (process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN && process.env.NEXT_PUBLIC_DATADOG_SITE) {
      console.log('setting up datadog logs');
      datadogLogs.init({
        clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
        site: process.env.NEXT_PUBLIC_DATADOG_SITE,
        forwardErrorsToLogs: true,
        sessionSampleRate: 100,
      });

      setLogExtension((level, msg, context) => {
        switch (level) {
          case LogLevel.debug:
            datadogLogs.logger.debug(msg, context);
            break;
          case LogLevel.info:
            datadogLogs.logger.info(msg, context);
            break;
          case LogLevel.warn:
            datadogLogs.logger.warn(msg, context);
            break;
          case LogLevel.error:
            datadogLogs.logger.error(msg, context);
            break;
          default:
            break;
        }
      });
    }

    // expose room on window for debugging
    window.__lk_room = room;

    return () => {
      window.__lk_room = undefined;
    };
  }, [room, logLevel]);
};

export const DebugMode = ({ logLevel }) => {
  const room = useRoomContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [, setRender] = React.useState({});
  const [roomSid, setRoomSid] = React.useState('');

  React.useEffect(() => {
    room.getSid().then(setRoomSid).catch(() => setRoomSid(''));
  }, [room]);

  useDebugMode({ logLevel });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const unsubscribe = tinykeys(window, {
        'Shift+D': () => {
          console.log('setting open');
          setIsOpen((open) => !open);
        },
      });

      // timer to re-render
      const interval = setInterval(() => {
        setRender({});
      }, 1000);

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  if (typeof window === 'undefined' || !isOpen) {
    return null;
  }

  const handleSimulate = (event) => {
    const { value } = event.target;
    if (value === '') return;

    // note: room.simulateScenario is an internal/testing helper
    room.simulateScenario(value);
    event.target.value = '';
  };

  const lp = room.localParticipant;

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <section id="room-info">
        <h3>
          Room Info {room.name}: {roomSid}
        </h3>
      </section>

      <details open>
        <summary>
          <b>Local Participant: {lp.identity}</b>
        </summary>

        <details open className={styles.detailsSection}>
          <summary>
            <b>Published tracks</b>
          </summary>
          <div>
            {Array.from(lp.trackPublications.values()).map((t) => {
              const bitrateKbps = t.track ? Math.ceil((t.track.currentBitrate || 0) / 1000) : 0;
              const dims =
                t.kind === 'video'
                  ? `${t.track?.dimensions?.width ?? t.dimensions?.width ?? '-'}x${
                      t.track?.dimensions?.height ?? t.dimensions?.height ?? '-'
                    }`
                  : null;

              return (
                <React.Fragment key={t.trackSid}>
                  <div>
                    <i>
                      {t.source?.toString?.() ?? String(t.source)}
                      &nbsp;<span>{t.trackSid}</span>
                    </i>
                  </div>
                  <table>
                    <tbody>
                      <tr>
                        <td>Kind</td>
                        <td>
                          {t.kind}&nbsp;{dims ? <span>{dims}</span> : null}
                        </td>
                      </tr>
                      <tr>
                        <td>Bitrate</td>
                        <td>{bitrateKbps} kbps</td>
                      </tr>
                    </tbody>
                  </table>
                </React.Fragment>
              );
            })}
          </div>
        </details>

        <details open className={styles.detailsSection}>
          <summary>
            <b>Permissions</b>
          </summary>
          <div>
            <table>
              <tbody>
                {lp.permissions &&
                  Object.entries(lp.permissions).map(([key, val]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      {key !== 'canPublishSources' ? (
                        <td>{String(val)}</td>
                      ) : (
                        <td>{Array.isArray(val) ? val.join(', ') : String(val)}</td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </details>
      </details>

      <details>
        <summary>
          <b>Remote Participants</b>
        </summary>

        {Array.from(room.remoteParticipants.values()).map((p) => (
          <details key={p.sid} className={styles.detailsSection}>
            <summary>
              <b>{p.identity}</b>
            </summary>
            <div>
              {Array.from(p.trackPublications.values()).map((t) => {
                const bitrateKbps = t.track ? Math.ceil((t.track.currentBitrate || 0) / 1000) : 0;
                const dims =
                  t.kind === 'video'
                    ? `${t.dimensions?.width ?? '-'}x${t.dimensions?.height ?? '-'}`
                    : null;

                return (
                  <React.Fragment key={t.trackSid}>
                    <div>
                      <i>
                        {t.source?.toString?.() ?? String(t.source)}
                        &nbsp;<span>{t.trackSid}</span>
                      </i>
                    </div>
                    <table>
                      <tbody>
                        <tr>
                          <td>Kind</td>
                          <td>
                            {t.kind}&nbsp;{dims ? <span>{dims}</span> : null}
                          </td>
                        </tr>
                        <tr>
                          <td>Status</td>
                          <td>{trackStatus(t)}</td>
                        </tr>
                        {t.track && (
                          <tr>
                            <td>Bitrate</td>
                            <td>{bitrateKbps} kbps</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </React.Fragment>
                );
              })}
            </div>
          </details>
        ))}
      </details>

      {/* Controls (optional): simulate scenarios */}
      <details style={{ marginTop: 12 }}>
        <summary>
          <b>Simulate</b>
        </summary>
        <div>
          <select defaultValue="" onChange={handleSimulate}>
            <option value="">Select a scenario…</option>
            <option value="signal-reconnect">Signal reconnect</option>
            <option value="node-failure">Node failure</option>
            <option value="server-leave">Server leave</option>
            <option value="migration">Migration</option>
            {/* Add others your SDK supports */}
          </select>
        </div>
      </details>
    </div>
  );
};

function trackStatus(t) {
  if (t.isSubscribed) {
    return t.isEnabled ? 'enabled' : 'disabled';
  }
  return 'unsubscribed';
}
