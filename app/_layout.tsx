import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Index from '../app/index'; // Ensure correct import paths
import NoteScreen from '../app/note'; // Ensure correct import paths
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootLayout() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="index" component={Index} options={{ headerShown: false }} />
        <Stack.Screen name="note" component={NoteScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}
