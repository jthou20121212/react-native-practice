import React from 'react';

import { Image, Platform, ScrollView, StyleSheet, View } from 'react-native';
import MoreOrLess from './MoreOrLess';

export default function App() {
  return (
    <ScrollView style={styles.appContainer}>
      <View style={styles.container} />
      <View style={[styles.container, styles.center]}>
        <View style={{ height: 16 }} />

        <MoreOrLess
          containerStyle={styles.textContainer}
          numberOfLines={5}
          textStyle={styles.text}
          showLess={true}
          textButtonStyle={styles.textButton}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem.
        </MoreOrLess>

        <View style={{ height: 16 }} />

        <MoreOrLess
          containerStyle={styles.textContainer}
          numberOfLines={5}
          textStyle={styles.text}
          moreText="展开"
          lessText="折叠"
          textButtonStyle={styles.textButton}
          showLess={true}
        >
          离职投入大模型创业后，原美团联合创始人王慧文被曝出现健康问题。 6月25日，美团公告称，王慧文因个人健康原因，已提出辞去公司非执行董事、公司董事会提名委员会成员和公司授权代表职务，自今年6月26日起生效。 王慧文离场后，光年之外该如何发展？
        </MoreOrLess>

        <View style={{ height: 16 }} />

        <MoreOrLess
          containerStyle={styles.textContainer}
          numberOfLines={5}
          textStyle={styles.text}
          moreComponent={() => <Image
            style={{
              height: 25,
              aspectRatio: 7 / 3
            }}
            source={require('../image/expand.png')}
          />}
          textButtonStyle={styles.textButton}
        >
          离职投入大模型创业后，原美团联合创始人王慧文被曝出现健康问题。 6月25日，美团公告称，王慧文因个人健康原因，已提出辞去公司非执行董事、公司董事会提名委员会成员和公司授权代表职务，自今年6月26日起生效。 王慧文离场后，光年之外该如何发展？
        </MoreOrLess>
      </View>
      <View style={styles.container} />
    </ScrollView>
  );
}

const fontFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'Menlo',
});

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    paddingHorizontal: 24
  },
  center: { flex: 10 },
  container: {
    flex: 1,
  },
  text: {
    color: 'mediumslateblue',
    fontSize: 18,
    fontFamily,
  },
  textButton: { color: 'red' },
  textContainer: {
    backgroundColor: 'azure',
    padding: 16,
    borderRadius: 16,
  },
});
