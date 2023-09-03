import React, { ComponentType, PropsWithChildren, useMemo } from 'react';
import { Platform, Text, TextLayoutLine, TextProps, TextStyle } from 'react-native';

type ClippedShrunkTextProps = PropsWithChildren<{
  linesToRender: TextLayoutLine[];
  numberOfLines: number;
  textStyle?: TextStyle;
}>;

const ClippedShrunkText = ({
  children,
  linesToRender,
  numberOfLines,
  textStyle,
}: ClippedShrunkTextProps) => {
  const text = useMemo(() =>
    Platform.select({
      ios: linesToRender.slice(0, linesToRender.length - 1).map((line) => line.text),
      android: children,
      default: children,
    }),
    [children, linesToRender]
  );

  const numberOfLinesToClip = useMemo(() => Math.min(numberOfLines, linesToRender.length) - 1,
    [linesToRender.length, numberOfLines]
  );

  if (linesToRender.length < 2) return null;

  return (
    <Text style={textStyle} numberOfLines={numberOfLinesToClip} ellipsizeMode="clip">
      {text}
    </Text>
  );
};

export default ClippedShrunkText;
