import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const CurrentGeolocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          setErrorMsg('Получение геоданных отклонено пользователем');
        }
      } catch (err) {
        console.warn(err);
        setErrorMsg('Ошибка при запросе разрешения');
      }
    } else {
      Geolocation.requestAuthorization();
      getLocation();
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setErrorMsg(null);
      },
      error => {
        setErrorMsg(error.message);
        setLocation(null);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const openAppSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      requestPermission();
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View style={styles.Container}>
      {location ? (
        <>
          <Text style={styles.Text}>Широта: {location.latitude}</Text>
          <Text style={styles.Text}>Долгота: {location.longitude}</Text>
        </>
      ) : (
        <View>
          {errorMsg ? (
            <>
              <Text style={styles.Text}>{errorMsg}</Text>
              <Button
                title="Включить передачу геоданных"
                onPress={openAppSettings}
              />
            </>
          ) : (
            <Text style={styles.Text}>Получение геопозиции...</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});
