import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initErrorLogging } from './setupErrorLogging';
import { ErrorBoundary } from './components/ErrorBoundary';
import { colors } from './styles/global';

import TranslatorScreen from './screens/TranslatorScreen';
import HistoryScreen from './screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    initErrorLogging();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: colors.primary,
              tabBarInactiveTintColor: colors.textSecondary,
              headerStyle: {
                backgroundColor: colors.surface,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: colors.borderLight,
              },
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 20,
              },
              tabBarStyle: {
                backgroundColor: colors.surface,
                borderTopWidth: 1,
                borderTopColor: colors.borderLight,
                paddingBottom: 20,
                paddingTop: 12,
                height: 80,
              },
            }}
          >
            <Tab.Screen
              name="Translator"
              component={TranslatorScreen}
              options={{
                tabBarLabel: 'Translate',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="translate" size={size} color={color} />
                ),
                headerTitle: 'Real-time Interpreter',
              }}
            />
            <Tab.Screen
              name="History"
              component={HistoryScreen}
              options={{
                tabBarLabel: 'History',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="history" size={size} color={color} />
                ),
                headerTitle: 'Past Interpretations',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}