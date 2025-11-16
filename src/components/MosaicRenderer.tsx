// src/components/MosaicRenderer.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MOSAICO_SEGMENTS, MosaicIndex } from '../utils/mosaicConfig';
import { getMosaicCoreColors } from '../utils/mosaicState';

import MosaicSvgM from './MosaicSvgM';
import MosaicSvg2 from './MosaicSvg2';
import MosaicSvg3 from './MosaicSvg3';


type Props = {
  currentMosaicIndex: MosaicIndex;
  pieces: number;
  history?: string[];   // agora é string[]
  size?: number;
};

const MosaicRenderer: React.FC<Props> = ({
  currentMosaicIndex,
  pieces,
  history,
  size = 240,
}) => {
  const totalSegments = MOSAICO_SEGMENTS[currentMosaicIndex];
  const segmentColors = getMosaicCoreColors(pieces, history, totalSegments);

  let MosaicComponent: React.ComponentType<{
    size?: number;
    segmentColors?: string[];
  }>;

switch (currentMosaicIndex) {
  case 1:
    MosaicComponent = MosaicSvgM;
    break;
  case 2:
    MosaicComponent = MosaicSvg2;
    break;
  case 3:
    MosaicComponent = MosaicSvg3;
    break;
  default:
    MosaicComponent = MosaicSvgM;
    break;
}

  return (
    <View style={styles.wrapper}>
      <View style={styles.glow} />
      <MosaicComponent size={size} segmentColors={segmentColors} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(235,255,150,0.18)',
    zIndex: -1,
  },
});

export default MosaicRenderer;
