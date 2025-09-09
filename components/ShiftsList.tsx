import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import { Loading } from './Loading';
import type { Coordinates, Shift } from '../utils/types';

type ServerData = {
  data: Shift[];
  status: number;
};

export const ShiftsList = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [serverData, setServerData] = useState<ServerData | null>(null);

  // Запрос доступа.
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

  // Получение геолокации.
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        setErrorMsg(null);

        fetchData(coords.latitude, coords.longitude);
      },
      error => {
        setErrorMsg(error.message);
        setLocation(null);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  // Получение данных с сервера.
  const fetchData = async (lat: number, lon: number) => {
    try {
      // Возваращется пустой ответ, временно подставляем свои координаты
      const _url = `https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=${lat}&longitude=${lon}`;
      const url = `https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=${45}&longitude=${39}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      const data = await res.json();
      setServerData(data);
    } catch {
      setErrorMsg('Не удалось получить данные с сервера');
    }
  };

  // Повторное разрешение.
  const openAppSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      requestPermission();
    }
  };

  // Запрашиваем разрешение при монтировании.
  useEffect(() => {
    requestPermission();
  }, []);

  // Отображение загрузки.
  const isLoading = useMemo(() => {
    if (errorMsg) return false;
    if (location && serverData) return false;
    return true;
  }, [errorMsg, location, serverData]);

  if (isLoading)
    return (
      <View style={styles.Container}>
        <Loading />
      </View>
    );

  return (
    <View style={styles.Container}>
      {errorMsg ? (
        <>
          <Text style={styles.Text}>{errorMsg}</Text>
          <Button
            title="Включить передачу геоданных"
            onPress={openAppSettings}
          />
        </>
      ) : (
        <ScrollView style={styles.Data}>
          <Text style={styles.Text}>{JSON.stringify(serverData, null, 2)}</Text>
        </ScrollView>
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
  Data: {
    flex: 1,
  },
});
