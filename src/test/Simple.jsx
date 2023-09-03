import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    FlatList,
    ScrollView,
    SectionList,
    StyleSheet,
    Text,
    View
} from 'react-native';

const size = 20;

function Cell({ index }) {
  return (
    <View
      style={[
        index % 2 === 0 ? styles.redBox : styles.greenBox,
        { zIndex: size - index },
      ]}
    />
  );
}

function ScrollApp() {
  return (
    <ScrollView>
      {new Array(size).fill(0).map((v, index) => (
        <>
          <Cell index={index} />
          <View style={styles.separator} />
        </>
      ))}
    </ScrollView>
  );
}

function FlatListApp() {
  const renderer = useCallback((props) => {
    return <Cell {...props} />;
  }, []);
  return (
    <FlatList
      data={new Array(size).fill(0)}
      renderItem={(props) => <Cell {...props} />}
      CellRendererComponent={renderer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

function SectionListApp() {
  const renderer = useCallback((props) => <Cell {...props} />, []);
  return (
    <SectionList
      sections={[{ data: new Array(size).fill(0) }]}
      renderItem={(props) => <Cell {...props} />}
      CellRendererComponent={renderer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

export default function App() {
  const [flatList, setFlatList] = useState(false);
  const [modal, setModal] = useState(true);
  const [t, setT] = useState(60);
  useEffect(() => {
    const r = setInterval(() => {
      if (t === 0) {
        setModal(false);
        clearInterval(r);
      } else {
        setT(t - 1);
      }
    }, 1000);
    return () => clearInterval(r);
  }, [t]);
  return (
    <>
      {flatList ? <FlatListApp /> : <ScrollApp />}
      {!modal && (
        <Button
          title={flatList ? 'switch to ScrollView' : 'switch to FlatList'}
          onPress={() => setFlatList(!flatList)}
        />
      )}
      {modal && (
        <View style={styles.modal}>
          <Text style={[styles.text, styles.title]}>
            zIndex bug in FlatList
          </Text>
          <Text style={styles.text}>
            The green box should render above the red box using 'zIndex'
            property
          </Text>
          <Text style={styles.text}>
            It works as expected in ScrollView BUT not in FlatList
          </Text>
          <Text style={[styles.text, styles.subtitle]}>
            Switch between ScrollView to FlatList by pressing the button
          </Text>
          <Button title={`dismiss ${t}`} onPress={() => setModal(false)} />
        </View>
      )}
    </>
  );
}

let styles = StyleSheet.create({
  greenBox: {
    backgroundColor: 'green',
    width: 300,
    height: 100,
    transform: [{ translateY: 200 }],
  },
  redBox: {
    height: 300,
    width: 200,
    backgroundColor: 'red',
  },
  separator: {
    flex: 1,
    height: 20,
  },
  modal: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: { textAlign: 'center' },
  title: { fontWeight: 'bold', fontSize: 24 },
  subtitle: { fontWeight: 'bold' },
});
