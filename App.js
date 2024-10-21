
import React from 'react';
import MainNavigation from './Src/Navigation/Root/mainnavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainNavigation />
    </GestureHandlerRootView>
  )
}



export default App;
