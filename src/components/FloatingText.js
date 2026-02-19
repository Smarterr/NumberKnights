import { Text } from 'react-native';

const FloatingText = (props) => {
  if (!props.position) return null;

  // 'life' starts at 100 and drops to 0. We convert this to an opacity from 1.0 to 0.0
  const opacity = Math.max(0, props.life / 100);

  return (
    <Text style={{
      position: 'absolute',
      left: props.position.x,
      top: props.position.y,
      color: props.color || 'white',
      fontSize: 28, // Nice and chunky
      fontWeight: '900',
      opacity: opacity,
      textShadowColor: 'black',
      textShadowRadius: 3,
      zIndex: 999, // Make sure it sits on top of everything
    }}>
      {props.text}
    </Text>
  );
};

export default FloatingText;