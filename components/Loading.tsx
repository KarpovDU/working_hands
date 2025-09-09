import { ActivityIndicator } from 'react-native';
import { Colors } from '../utils/constants';

export const Loading = () => {
  return <ActivityIndicator size="large" color={Colors.accent} />;
};
