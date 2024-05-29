import React, {useState} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
const App = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([1, 2, 3]);

  const handleLocation = (loc) => {
    console.log(loc)
  } 
  return (
    <View className="flex-1 relative">
      <StatusBar barStyle="light-content" hidden />
      <ImageBackground
        resizeMode="cover"
        source={require('./assets/images/bg.png')}
        className="absolute h-full w-full"
        blurRadius={70}
      />
      <SafeAreaView className="flex flex-1">
        <View style={{height: '7%'}} className="mx-4 mt- relative z-50">
          <View
            className={`flex-row justify-end items-center rounded-full ${
              showSearch ? ' bg-slate-600' : ''
            }`}>
            {showSearch ? (
              <TextInput
                placeholder="Search City"
                placeholderTextColor={'lightgray'}
                className="pl-6 h-10 flex-1 text-base text-white"
              />
            ) : null}
            <TouchableOpacity
              className="rounded-full p-3 m-1 bg-slate-400"
              onPress={() => setShowSearch(!showSearch)}>
              <MagnifyingGlassIcon
                size={'25'}
                color="white"></MagnifyingGlassIcon>
            </TouchableOpacity>
          </View>

          {locations.length > 0 && showSearch ? (
            <View className="absolute w-full top-16 rounded-3xl bg-slate-300">
              {locations.map((loc, idx) => {
                let showBorder = idx+1 != locations.length;
                let borderClass = showBorder? ' border-b-2 border-b-slate-400' : '';
                return (
                  <TouchableOpacity 
                    onPress={() => handleLocation(loc)}
                    key={idx}
                    className={'flex-row items-center border-0 p-3 px-4 mb-1'+ borderClass} 
                  >
                    <MapPinIcon size={'20'} color={'gray'}/>
                    <Text className='text-black text-base ml-2'> London unoted kingdom </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default App;
