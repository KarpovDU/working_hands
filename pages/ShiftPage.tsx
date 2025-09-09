import { useNavigation, type RouteProp } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../utils/types';
import { useShift } from '../utils/context';
import { Loading } from '../components';
import { Colors } from '../utils/constants';
import { useLayoutEffect } from 'react';

type ShiftPageRouteProp = RouteProp<RootStackParamList, 'ShiftPage'>;

export const ShiftPage = ({ route }: { route: ShiftPageRouteProp }) => {
  const navigation = useNavigation();
  const { getShift } = useShift();
  const shift = getShift(route.params.id);

  useLayoutEffect(() => {
    if (shift) {
      navigation.setOptions({ title: shift.companyName });
    }
  }, [shift]);

  if (!shift) return <Loading />;

  const isHiring = shift.currentWorkers < shift.planWorkers;

  return (
    <ScrollView contentContainerStyle={styles.Container}>
      <View style={styles.Header}>
        <Image source={{ uri: shift.logo }} style={styles.Logo} />
        <Text style={styles.Company}>{shift.companyName}</Text>
      </View>

      <Text style={styles.SectionTitle}>Адрес: </Text>
      <Text style={styles.Address}>{shift.address}</Text>

      <Text style={isHiring ? styles.Hiring : styles.Closed}>
        {isHiring ? 'Набор открыт' : 'Набор закрыт'}
      </Text>

      <Text style={styles.SectionTitle}>Дата и время смены:</Text>
      <Text>{shift.dateStartByCity}г.</Text>
      <Text>
        с {shift.timeStartByCity} до {shift.timeEndByCity}
      </Text>

      <Text style={styles.SectionTitle}>Типы работ:</Text>
      {shift.workTypes.map(type => (
        <Text key={type.id}>• {type.name}</Text>
      ))}

      <Text style={styles.SectionTitle}>Оплата:</Text>
      <Text>{shift.priceWorker} ₽</Text>
      {shift.bonusPriceWorker > 0 && (
        <Text>+ {shift.bonusPriceWorker} ₽ бонус</Text>
      )}

      <Text style={styles.SectionTitle}>Отзывы:</Text>
      <Text>Количество: {shift.customerFeedbacksCount}</Text>
      {shift.customerRating > 0 && <Text>Рейтинг: {shift.customerRating}</Text>}
      {shift.isPromotionEnabled && (
        <Text style={styles.Promotion}>Акция активна!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Container: {
    padding: 16,
  },
  Header: {
    width: '100%',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  Logo: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  Company: {
    flex: 0,
    flexShrink: 1,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    color: Colors.accent,
  },
  Address: {
    fontSize: 14,
    marginBottom: 12,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  Hiring: {
    color: Colors.positive,
    marginBottom: 12,
    fontWeight: '600',
  },
  Closed: {
    color: Colors.negative,
    marginBottom: 12,
    fontWeight: '600',
  },
  SectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  Promotion: {
    marginTop: 12,
    fontWeight: '600',
    color: Colors.positive,
  },
});
