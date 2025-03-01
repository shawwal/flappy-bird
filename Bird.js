import React from "react";
import { Animated } from "react-native";
import Images from './assets/Images';

const Bird = (props) => {
    const animatedValue = new Animated.Value(props.body.velocity.y);
    const width = props.body.bounds.max.x - props.body.bounds.min.x;
    const height = props.body.bounds.max.y - props.body.bounds.min.y;
    const x = props.body.position.x - width / 2;
    const y = props.body.position.y - height / 2;
    let rotation = animatedValue.interpolate({
        inputRange: [-10, 0, 10, 20],
        outputRange: ['-20deg', '0deg', '15deg', '45deg'],
        extrapolate: 'clamp'
    })
    let image = Images['bird' + props.pose];
    return (
        <Animated.Image
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: width,
                height: height,
                transform: [{ rotate: rotation }]
            }}
            resizeMode="stretch"
            source={image} />
    );
}

export default Bird;