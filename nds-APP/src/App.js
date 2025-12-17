import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from './context/AppContext';
import OnboardingSurvey from './pages/OnboardingSurvey';
import MainPage from './pages/MainPage';
import AIRecommendation from './pages/AIRecommendation';
import FestivalSearch from './pages/FestivalSearch';
import PlaceEvents from './pages/PlaceEvents';
import LocationEvents from './pages/LocationEvents';
import CategoryEvents from './pages/CategoryEvents';
import EventDetail from './pages/EventDetail';
import ShortestPath from './pages/ShortestPath';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from './components/ErrorBoundary';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const preferences = await AsyncStorage.getItem('userPreferences');
      // 선호 설정이 있으면 메인 페이지로, 없으면 온보딩으로
      setInitialRoute(preferences ? 'MainPage' : 'OnboardingSurvey');
    } catch (error) {
      console.error('온보딩 상태 확인 실패:', error);
      setInitialRoute('OnboardingSurvey');
    }
  };

  const Loading = () => (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'red' }}>
      <Text>Loading...</Text>
    </View>
  );

  if (!initialRoute) {
    return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: 'red' }}>
        <Loading />
      </SafeAreaProvider>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={initialRoute}
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="OnboardingSurvey"
                component={OnboardingSurvey}
              />
              <Stack.Screen
                name="MainPage"
                component={MainPage}
              />
              <Stack.Screen
                name="AIRecommendation"
                component={AIRecommendation}
                options={{ title: 'AI 추천' }}
              />
              <Stack.Screen
                name="FestivalSearch"
                component={FestivalSearch}
                options={{ title: '축제 검색' }}
              />
              <Stack.Screen
                name="PlaceEvents"
                component={PlaceEvents}
                options={{ title: '장소 유형 추천' }}
              />
              <Stack.Screen
                name="LocationEvents"
                component={LocationEvents}
                options={{ title: '위치 기반 추천' }}
              />
              <Stack.Screen
                name="CategoryEvents"
                component={CategoryEvents}
                options={{ title: '카테고리 추천' }}
              />
              <Stack.Screen
                name="EventDetail"
                component={EventDetail}
                options={{ title: '행사 상세' }}
              />
              <Stack.Screen
                  name="ShortestPath"
                  component={ShortestPath}
                  options={{ title: '최단 경로 찾기' }}
                />
            </Stack.Navigator>
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );


}

export default App;
