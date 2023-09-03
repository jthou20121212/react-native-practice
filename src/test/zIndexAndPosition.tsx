import React from 'react';
import { View, TextInput } from 'react-native';

function App() {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 200,
          width: 200,
          position: 'absolute',
          backgroundColor: 'red',
          zIndex: 997,
          elevation: 998
        }}
      >
        <TextInput style={{width: '100%', height: 100, backgroundColor: 'white'}} />
      </View>
      <View style={{ flex: 1, zIndex: 2, backgroundColor: 'green' }} />
    </View>
  );
}

export default App;
