import { Canvas, Path, Skia, SkRect, PaintStyle } from "@shopify/react-native-skia";
import React from 'react';
import { View, useWindowDimensions } from 'react-native';

export type Circle = {
    x: number;
    y: number;
    r: number;
}

export default function WaterDrop() {

    const mMaxCircleRadius = 16.14;
    const mMinCircleRadius = mMaxCircleRadius / 5;

    const topCircle: Circle = { x: 30, y: 100, r: mMaxCircleRadius }
    const bottomCircle: Circle = { x: 30, y: 268, r: mMinCircleRadius }

    const path = Skia.Path.Make();
    const paint = Skia.Paint()
    paint.setAntiAlias(true);
    paint.setStyle(PaintStyle.Fill);

    const topRect: SkRect = { x: 30 - mMaxCircleRadius, y: 100 - mMaxCircleRadius, width: mMaxCircleRadius * 2, height: mMaxCircleRadius * 2 }
    const bottomRect: SkRect = { x: 30 - mMinCircleRadius, y: 268 - mMinCircleRadius, width: mMinCircleRadius * 2, height: mMinCircleRadius * 2 }

    path.addArc(topRect, 0, -180)
    // path.addCircle(topCircle.x, topCircle.y, topCircle.r)
    // path.addCircle(bottomCircle.x, bottomCircle.y, bottomCircle.r)

    const angle = Math.asin((topCircle.r - bottomCircle.r) / (bottomCircle.y - topCircle.y));
    // 上方圆左切点
    const top_x1 = (topCircle.x - topCircle.r * Math.cos(angle));
    const top_y1 = (topCircle.y + topCircle.r * Math.sin(angle));

    // 上方圆右切点
    const top_x2 = (topCircle.x + topCircle.r * Math.cos(angle));
    const top_y2 = top_y1;

    // 下方圆左切点
    const bottom_x1 = (bottomCircle.x - bottomCircle.r * Math.cos(angle));
    const bottom_y1 = (bottomCircle.y + bottomCircle.r * Math.sin(angle));

    // 下方圆右切点
    const bottom_x2 = (bottomCircle.x + bottomCircle.r * Math.cos(angle));
    const bottom_y2 = bottom_y1;

    // path.lineTo(top_x1, top_y1);
    // path.lineTo(bottom_x1, bottom_y1);
    path.addArc(bottomRect, 180, -180)
    // path.lineTo(bottom_x2, bottom_y2);
    // path.lineTo(top_x2, top_y2);

    // path.moveTo(topCircle.x, topCircle.y);

    path.moveTo(top_x1, top_y1);

    path.quadTo((bottomCircle.x - bottomCircle.r), (bottomCircle.y + topCircle.y) / 2, bottom_x1, bottom_y1);
    path.lineTo(bottom_x2, bottom_y2);

    path.quadTo((bottomCircle.x + bottomCircle.r), (bottomCircle.y + top_y2) / 2, top_x2, top_y2);
    // path.addArc(bottomRect, 180, -180)

    path.close();

    return (
        <Canvas style={{ flex: 1, backgroundColor: 'white' }}>
            <Path
                path={path}
                paint={paint}
                color="black"
                strokeWidth={1}
                start={0}
                end={1}
                opacity={1}
            />
        </Canvas>
    );
};