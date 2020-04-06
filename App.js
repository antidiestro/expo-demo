import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const mapRef = useRef(null);
  const cameraRef = useRef(null);

  const [markers, setMarkers] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);

  const savePhoto = async () => {
    const picture = await cameraRef.current.takePictureAsync();
    const camera = await mapRef.current.getCamera();
    setMarkers([...markers, { picture, coords: camera.center }]);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map}>
        {markers.map(marker => (
          <Marker coordinate={marker.coords} key={marker.picture.uri}>
            <Image source={marker.picture} style={styles.picture} />
          </Marker>
        ))}
      </MapView>
      <View style={styles.cameraContainer}>
        <View style={styles.shutterContainer}>
          <TouchableOpacity onPress={savePhoto} style={styles.shutter}>
            <View style={styles.shutterButton} />
          </TouchableOpacity>
        </View>
        {hasPermission && <Camera ref={cameraRef} style={styles.camera} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 40,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 72,
    height: 72,
    padding: 2,
    borderWidth: 6,
    borderColor: '#fff',
    borderRadius: 100,
  },
  shutterButton: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#fff',
  },
  picture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#fff',
    borderWidth: 2,
  },
});
