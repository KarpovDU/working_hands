import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  FlatList,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Loading } from '../components/Loading';
import { ShiftListItem } from '../components/ShiftListItem';
import type { Coordinates, Shift } from '../utils/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShift } from '../utils/context/ShiftContext';
import { Colors } from '../utils/constants';

type ServerData = {
  data: Shift[];
  status: number;
};

export const ShiftsList = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { setShifts, shifts } = useShift();

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
      const url = `https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=${lat}&longitude=${lon}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      const data: ServerData = await res.json();
      setShifts(data.data);
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
    if (location && shifts) return false;
    return true;
  }, [errorMsg, location, shifts]);

  if (isLoading)
    return (
      <SafeAreaView style={styles.Container}>
        <Loading />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.Container}>
        {errorMsg ? (
          <>
            <Text style={styles.Text}>{errorMsg}</Text>
            <Button
              title="Включить передачу геоданных"
              onPress={openAppSettings}
            />
          </>
        ) : shifts?.length === 0 ? (
          <Text style={[styles.Text, styles.Empty]}>
            Работы поблизости не найдено
          </Text>
        ) : (
          <FlatList
            style={styles.Data}
            data={shifts}
            renderItem={shift => <ShiftListItem data={shift.item} />}
            keyExtractor={shift => shift.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
  },
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
    width: '100%',
  },
  Empty: {
    color: Colors.info,
  },
});
