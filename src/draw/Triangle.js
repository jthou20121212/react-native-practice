import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React from 'react';
import { useWindowDimensions } from 'react-native';

export default PathDemo = () => {

  const window = useWindowDimensions();

  const path = Skia.Path.Make();
  path.moveTo(window.width / 2, 50);
  path.lineTo(50, 300);
  path.lineTo(window.width - 50, 300);
  path.close();

  return (
    <Canvas style={{ flex: 1 }}>
        <Path
          style="stroke"
          path={path}
          color="black"
          strokeWidth={5}
          start={0}
          end={0.75}
          opacity={0.25}
        />
    </Canvas>
  );
};