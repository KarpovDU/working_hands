import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { Shift } from '../utils/types';
import { Colors } from '../utils/constants';

const ShiftListItemComponent = ({ data }: { data: Shift }) => {
  const isHiring = data.currentWorkers < data.planWorkers;

  return (
    <TouchableOpacity style={styles.Card}>
      <Image source={{ uri: data.logo }} style={styles.Logo} />
      <View style={styles.Info}>
        <Text style={styles.Company}>{data.companyName}</Text>
        <Text style={styles.Address}>{data.address}</Text>
        <View style={styles.RowContainer}>
          <Text
            style={{
              ...styles.Status,
              color: isHiring ? Colors.positive : Colors.negative,
            }}
          >
            {isHiring ? 'Набор открыт' : 'Набор закрыт'}
          </Text>
          <Text style={styles.Price}>
            {data.priceWorker} ₽ за смену
            {data.bonusPriceWorker > 0
              ? ` + ${data.bonusPriceWorker} ₽ бонус`
              : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ShiftListItem = memo(ShiftListItemComponent);

const styles = StyleSheet.create({
  Card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderColor: Colors.border,
    borderWidth: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  Logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  Info: {
    flex: 1,
  },
  Company: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  Address: {
    fontSize: 14,
    color: Colors.info,
    marginBottom: 4,
  },
  RowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Status: {
    fontSize: 14,
    marginBottom: 4,
  },
  Price: {
    fontSize: 12,
    color: Colors.info,
  },
});
