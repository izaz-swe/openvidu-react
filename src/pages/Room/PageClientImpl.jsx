import React from "react";

import {
  PreJoin,
  RoomContext,
  VideoConference,
} from "@livekit/components-react";
import { VideoPresets, Room, RoomEvent } from "livekit-client";
import "@livekit/components-styles";
import { useNavigate } from "react-router-dom";

const CONN_DETAILS_ENDPOINT = "/room";
const SHOW_SETTINGS_MENU = true;

export function PageClientImpl(props) {
  const [preJoinChoices, setPreJoinChoices] = React.useState(undefined);
  const preJoinDefaults = React.useMemo(() => {
    return {
      username: "",
      videoEnabled: true,
      audioEnabled: true,
    };
  }, []);
  const [connectionDetails, setConnectionDetails] = React.useState(undefined);

  const handlePreJoinSubmit = React.useCallback(
    async (values) => {
      setPreJoinChoices(values);
      console.log(props);
      const username = "client"; // same as CALL_USER on server
      const password = "123456"; // same as CALL_SECRET on server

      const token = btoa(`${username}:${password}`); // base64 encode
      const response = await fetch("https://api.bloomattires.com/call/api/rooms", {
        method: "POST",
        headers: {
          Authorization: `Basic ${token}`,

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantName: values.username,
          roomName: props.roomName.roomName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Connection details:", data);
      setConnectionDetails({
        serverUrl: "wss://meet.c3bit.com",
        participantToken: data.token,
      });
    },
    [props.roomName, props.region]
  );

  const handlePreJoinError = React.useCallback((e) => console.error(e), []);

  return (
    <main data-lk-theme="default" style={{ height: "100%" }}>
      {connectionDetails === undefined || preJoinChoices === undefined ? (
        <div style={{ display: "grid", placeItems: "center", height: "80%" }}>
          <PreJoin
            defaults={preJoinDefaults}
            onSubmit={handlePreJoinSubmit}
            onError={handlePreJoinError}
          />
        </div>
      ) : (
        <VideoConferenceComponent
          connectionDetails={connectionDetails}
          userChoices={preJoinChoices}
          options={{ codec: props.codec, hq: props.hq }}
        />
      )}
    </main>
  );
}

function VideoConferenceComponent(props) {
  const e2eeEnabled = false;
    const [e2eeSetupComplete, setE2eeSetupComplete] = React.useState(false);

  const roomOptions = React.useMemo(() => {
    let videoCodec = props.options.codec ? props.options.codec : "vp9";

    const videoCaptureDefaults = {
      deviceId: props.userChoices.videoDeviceId ?? undefined,
      resolution: props.options.hq ? VideoPresets.h2160 : VideoPresets.h720,
    };

    const publishDefaults = {
      dtx: false,
      videoSimulcastLayers: props.options.hq
        ? [VideoPresets.h1080, VideoPresets.h720]
        : [VideoPresets.h540, VideoPresets.h216],
      red: !e2eeEnabled,
      videoCodec,
    };

    return {
      videoCaptureDefaults,
      publishDefaults,
      audioCaptureDefaults: {
        deviceId: props.userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: true,
      dynacast: true,
      // e2ee: keyProvider && worker && e2eeEnabled ? { keyProvider, worker } : undefined,
    };
  }, [props.userChoices, props.options.hq, props.options.codec]);

  const room = React.useMemo(() => new Room(roomOptions), [roomOptions]);
React.useEffect(() => {
    if (e2eeEnabled) {
      setE2eeSetupComplete(true);
    } else {
      setE2eeSetupComplete(true);
    }
  }, [e2eeEnabled, room]);
  const connectOptions = React.useMemo(() => {
    return {
      autoSubscribe: true,
    };
  }, []);

  React.useEffect(() => {
    room.on(RoomEvent.Disconnected, handleOnLeave);
    room.on(RoomEvent.MediaDevicesError, handleError);

    if (e2eeSetupComplete) {
      room
        .connect(
          props.connectionDetails.serverUrl,
          props.connectionDetails.participantToken,
          connectOptions
        )
        .catch((error) => {
          handleError(error);
        });
      if (props.userChoices.videoEnabled) {
        room.localParticipant.setCameraEnabled(true).catch((error) => {
          handleError(error);
        });
      }
      if (props.userChoices.audioEnabled) {
        room.localParticipant.setMicrophoneEnabled(true).catch((error) => {
          handleError(error);
        });
      }
    }
    return () => {
      room.off(RoomEvent.Disconnected, handleOnLeave);
      room.off(RoomEvent.MediaDevicesError, handleError);
    };
  }, [e2eeSetupComplete, room, props.connectionDetails, props.userChoices]);
  const router = useNavigate();

  const handleOnLeave = React.useCallback(() => router("/"), [router]);
  const handleError = React.useCallback((error) => {
    console.error(error);
    alert(
      `Encountered an unexpected error, check the console logs for details: ${error.message}`
    );
  }, []);

  React.useEffect(() => {
    room.on(RoomEvent.Disconnected, handleOnLeave);
    room.on(RoomEvent.MediaDevicesError, handleError);

    return () => {
      room.off(RoomEvent.Disconnected, handleOnLeave);
      room.off(RoomEvent.MediaDevicesError, handleError);
    };
  }, [
    ,
    room,
    props.connectionDetails,
    props.userChoices,
    connectOptions,
    handleOnLeave,
    handleError,
  ]);

  return (
    <div className="lk-room-container">
      <h1>Here video conference</h1>
      <RoomContext.Provider value={room}>
        <VideoConference />
      </RoomContext.Provider>
    </div>
  );
}
