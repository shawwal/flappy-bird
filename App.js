import React, { useState, useEffect } from 'react';
import { AsyncStorage, StyleSheet, Text, View, StatusBar, TouchableOpacity, Image } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Bird from './Bird';
import Floor from './Floor';
import Physics, { resetPipeCount } from './Physics';
import Constants from './Constants';
import Images from './assets/Images';
import PointSound from './components/PointSound';
import HitSound from './components/HitSound';
import DieSound from './components/DieSound';

const App = () => {

    const [running, setRunning] = useState(true);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // const storeHighScrore = async (value) => {
    //     try {
    //         const jsonValue = JSON.stringify(value)
    //         await AsyncStorage.setItem('@highscore', jsonValue)
    //         console.log('check value', jsonValue)

    //     } catch (e) {
    //         // saving error
    //         console.log('error set', e)
    //     }
    // }

    // const getHighScore = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('@highscore')
    //         if (value !== null) {
    //             // value previously stored
    //             console.log('check high scrore', value);
    //             setHighScore(parseInt(value));
    //         }
    //     } catch (e) {
    //         console.log('error read', e)
    //         // error reading value
    //     }
    // }

    // useEffect(() => {
    //     getHighScore();
    // }), [];

    setupWorld = () => {
        let engine = Matter.Engine.create({ enableSleeping: false });
        let world = engine.world;
        world.gravity.y = 0.0;

        let bird = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT / 2, Constants.BIRD_WIDTH, Constants.BIRD_HEIGHT);
        //bird.restitution = 20;

        let floor1 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH / 2,
            Constants.MAX_HEIGHT - 25,
            Constants.MAX_WIDTH + 4,
            50, { isStatic: true }
        );
        let floor2 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
            Constants.MAX_HEIGHT - 25,
            Constants.MAX_WIDTH + 4,
            50, { isStatic: true }
        );

        Matter.World.add(world, [bird, floor1]);
        // Matter.World.add(world, [bird, floor2]);
        Matter.Events.on(engine, 'collisionStart', (event) => {
            var pairs = event.pairs;
            HitSound();
            gameEngine.dispatch({ type: "game-over" });
            // DieSound();
        });

        return {
            physics: { engine: engine, world: world },
            floor1: { body: floor1, renderer: Floor },
            floor2: { body: floor2, renderer: Floor },
            bird: { body: bird, pose: 1, renderer: Bird },
        }
    }

    gameEngine = null;
    entities = setupWorld();

    onEvent = (e) => {
        if (e.type === "game-over") {
            //Alert.alert("Game Over");
            setRunning(false)
        } else if (e.type === "score") {
            setScore(score + 1);
            PointSound();
        }
    }

    reset = () => {
        gameEngine.swap(setupWorld());
        resetPipeCount();
        setScore(0);
        setRunning(true);
    }

    return (
        <View style={styles.container}>
            <Image style={styles.backgroundImage} resizeMode="stretch" source={Images.background} />
            <GameEngine
                ref={(ref) => { gameEngine = ref; }}
                style={styles.gameContainer}
                systems={[Physics]}
                running={running}
                onEvent={onEvent}
                entities={entities}>
                <StatusBar hidden={true} />
            </GameEngine>
            <Text style={styles.score}>{score}</Text>
            {!running && <TouchableOpacity style={styles.fullScreenButton} onPress={reset}>
                <View style={styles.fullScreen}>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    <Text style={styles.gameOverSubText}>Score: {score}</Text>
                    {/* <Text style={styles.gameOverSubText}>Best Score: {highScore}</Text> */}
                </View>
            </TouchableOpacity>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_HEIGHT
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    gameOverText: {
        color: 'white',
        fontSize: 48,
    },
    gameOverSubText: {
        color: 'white',
        fontSize: 24,
    },
    score: {
        color: 'white',
        fontSize: 72,
        position: 'absolute',
        top: 50,
        left: Constants.MAX_WIDTH / 2 - 24,
        textShadowColor: '#222222',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullScreenButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1
    }
});

export default App;