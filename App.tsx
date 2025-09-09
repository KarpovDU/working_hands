import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ShiftsList, ShiftPage } from './pages';
import { ShiftProvider } from './utils/context';
import type { RootStackParamList } from './utils/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <ShiftProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="ShiftsList"
              component={ShiftsList}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="ShiftPage" component={ShiftPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </ShiftProvider>
    </SafeAreaProvider>
  );
}

export default App;
