import React, { useCallback, useEffect, useMemo } from 'react';
import {
  LayoutAnimation,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TextLayoutLine,
  TextProps,
  TextStyle,
  UIManager,
  View,
  ViewStyle
} from 'react-native';
import { usePrevious, useToggle } from '../hooks';
import ClippedShrunkText from './ClippedShrunkText';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type MoreOrLessProps = {
  children: string;
  containerStyle?: ViewStyle;
  numberOfLines: number;
  onMorePress?: () => void;
  moreText?: string;
  lessText?: string;
  moreComponent?: | React.ComponentType<any>;
  lessComponent?: | React.ComponentType<any>;
  textButtonStyle?: TextStyle;
  textStyle?: TextStyle;
  animated?: boolean;
  showLess?: boolean;
} & Pick<TextProps, 'ellipsizeMode'>;

const MoreOrLess = ({
  animated = false,
  showLess = false,
  children,
  containerStyle,
  numberOfLines,
  onMorePress: customOnMorePress,
  moreText = 'more',
  lessText = 'less',
  textButtonStyle,
  moreComponent: MoreComponent,
  lessComponent: LessComponent,
  textStyle,
}: MoreOrLessProps) => {
  const { value: isExpanded, setTrue: expandText, setFalse: shrinkText } = useToggle(false);
  const [lines, setLines] = React.useState<TextLayoutLine[] | null>(null);
  const [hasMore, setHasMore] = React.useState(false);
  const previousNumberOfLines = usePrevious(numberOfLines);
  const previousLines = usePrevious(lines);
  const buttonStyleArray = [textStyle, styles.bold, textButtonStyle];

  useEffect(() => {
    if (lines !== null && numberOfLines !== previousNumberOfLines) setLines(null);
  }, [lines, numberOfLines, previousNumberOfLines]);

  useEffect(() => {
    if (animated)
      LayoutAnimation.configureNext({
        duration: 600,
        create: { type: 'linear', property: 'opacity' },
        update: { type: 'spring', springDamping: 2 },
        delete: { type: 'linear', property: 'opacity' },
      });
  }, [animated, isExpanded]);

  const onTextLayoutGetLines = useCallback((event: NativeSyntheticEvent<TextLayoutEventData>) => {
    const _lines: TextLayoutLine[] = [...event.nativeEvent.lines];

    if (_lines.length > numberOfLines) {
      // Determine if showMore is shown or not and
      if (_lines[numberOfLines].text) setHasMore(true);
      // restore the array to be its original numberOfLines.
      while (_lines.length > numberOfLines) {
        const extraLine = _lines.pop()?.text ?? '';
        _lines[numberOfLines - 1].text += extraLine;
      }
    }

    setLines(_lines);
  },
    [numberOfLines]
  );

  const onMorePress = useMemo(() => (hasMore ? customOnMorePress ?? expandText : null),
    [customOnMorePress, expandText, hasMore]
  );

  if (!children) return null;

  if (lines === null)
    return (
      <View style={containerStyle}>
        <View>
          <Text
            style={[textStyle, styles.hiddenTextAbsolute]}
            // "+ 1" because we want to see if
            // the lines include another one
            // or just fit all in 3 lines.
            numberOfLines={numberOfLines + 1}
            onTextLayout={onTextLayoutGetLines}
          >
            {children}
          </Text>
        </View>
      </View>
    );

  const linesToRender = lines ?? previousLines;

  if (linesToRender)
    return (
      <View style={containerStyle}>
        {isExpanded ? (
          <View style={textStyle}>
            <Text style={textStyle}>{children}</Text>
            { showLess ? (LessComponent ? (<Pressable onPress={shrinkText} >
              <LessComponent />
            </Pressable>) : (<Text style={buttonStyleArray} onPress={shrinkText}>
              {lessText}
            </Text>)) : (null) }
          </View>
        ) : (
          <View>
            <ClippedShrunkText
              linesToRender={linesToRender}
              numberOfLines={numberOfLines}
              textStyle={textStyle}
            >
              {children}
            </ClippedShrunkText>
            <View style={styles.lastLine}>
              <View style={styles.ellipsedText}>
                <Text style={textStyle} numberOfLines={1}>
                  {linesToRender[linesToRender.length - 1].text}
                </Text>
              </View>
              {onMorePress && (
                MoreComponent ? (
                  <Pressable onPress={onMorePress} >
                    <MoreComponent />
                  </Pressable>
                ) : (<Text style={buttonStyleArray} onPress={onMorePress}>
                  {moreText}
                </Text>)
              )}
            </View>
          </View>
        )}
      </View>
    );

  return null;
};

type MoreOrLessStyles = {
  ellipsedText: TextStyle;
  hiddenTextAbsolute: TextStyle;
  lastLine: TextStyle;
  bold: TextStyle;
};

const styles = StyleSheet.create<MoreOrLessStyles>({
  bold: {
    fontWeight: 'bold',
  },
  ellipsedText: {
    flex: 1,
  },
  hiddenTextAbsolute: {
    left: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  lastLine: {
    flexDirection: 'row',
  },
});

export default MoreOrLess;
