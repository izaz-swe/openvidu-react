import React from 'react';
import { PageClientImpl } from './PageClientImpl';
import { useParams } from 'react-router-dom';

export default function Room() {
  // Extract values safely
  const roomName = useParams() || 'demo';

  const region =  undefined;
  const hq =  'true';
  const codec = 'vp9';
  console.log(roomName);
  
  return (
    <PageClientImpl
      roomName={roomName}
      region={region}
      hq={hq}
      codec={codec}
    />
  );
}
