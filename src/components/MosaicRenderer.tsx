// src/components/MosaicRenderer.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MOSAICO_SEGMENTS, MosaicIndex } from '../utils/mosaicConfig';
import { getMosaicCoreColors } from '../utils/mosaicState';

import MosaicSvgM from './MosaicSvgM';
import MosaicSvg2 from './MosaicSvg2';
import MosaicSvg3 from './MosaicSvg3';
import MosaicSvg4 from './MosaicSvg4';
import MosaicSvg5 from './MosaicSvg5';

type Props = {
  currentMosaicIndex: MosaicIndex;
  pieces: number;
  history?: string[];
  size?: number;
  showGlow?: boolean;
};

const MosaicRenderer: React.FC<Props> = ({
  currentMosaicIndex,
  pieces,
  history,
  size = 240,
  showGlow = true,
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
    case 4:
      MosaicComponent = MosaicSvg4;
      break;
    case 5:
      MosaicComponent = MosaicSvg5;
      break;
    default:
      MosaicComponent = MosaicSvgM;
      break;
  }

 
  const wrapperSize = size * 1.3;
  const glowSize = size * 1.15;

  return (
    <View
      style={[
        styles.wrapper,
        { width: wrapperSize, height: wrapperSize },
      ]}
    >
      {showGlow && (
        <View
          style={[
            styles.glow,
            {
              width: glowSize,
              height: glowSize,
              borderRadius: glowSize / 2,
            },
          ]}
        />
      )}

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
    backgroundColor: 'rgba(235,255,150,0.18)',
    zIndex: -1,
  },
});

export default MosaicRenderer;
