import { Audio } from 'expo-av';

const HitSound = async () => {
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(require('./../assets/sounds/sfx_hit.mp3'));
    await soundObject.playAsync();
    // Your sound is playing!
  } catch (error) {
    // An error occurred!
  }

}

export default HitSound;