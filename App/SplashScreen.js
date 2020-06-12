import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

function SplashScreen({navigation}) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home');
    }, 1000);
  });

  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'https://cikarangdryport.com/new/images/icon-cdp.jpeg'}}
        style={styles.imgStyle}
      />
      <Text style={styles.copyRightStyle}>{'\u00A9'} Cikarang Dry Port</Text>
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  imgStyle: {
    width: 100,
    height: 100,
  },
  copyRightStyle: {
    position: 'absolute',
    bottom: 30,
  },
});
