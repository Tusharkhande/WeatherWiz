import React, {useState} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {CalendarDaysIcon, MapPinIcon} from 'react-native-heroicons/solid';
import {debounce} from 'lodash'

const HomeScreen = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([1, 2, 3]);

  const handleLocation = loc => {
    console.log(loc);
  };

  const handleSearch = value => {

  }
  return (
    <View className="flex-1 relative">
      <StatusBar barStyle="light-content" hidden />
      <ImageBackground
        resizeMode="cover"
        source={require('../../assets/images/bg2.jpeg')}
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
                onChangeText={handleSearch}
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
                let showBorder = idx + 1 != locations.length;
                let borderClass = showBorder
                  ? ' border-b-2 border-b-slate-400'
                  : '';
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={idx}
                    className={
                      'flex-row items-center border-0 p-3 px-4 mb-1' +
                      borderClass
                    }>
                    <MapPinIcon size={'20'} color={'gray'} />
                    <Text className="text-black text-base ml-2">
                      {' '}
                      London unoted kingdom{' '}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        <View className="mx-4 flex justify-around flex-1 mb-2">
          {/* location... */}
          <Text className="text-white text-center text-xl font-bold">
            Pune,
            <Text className="text-base font-semibold text-slate-300">
              Maharashtra
            </Text>
          </Text>

          {/* weather image.... */}
          <View className="flex-row justify-center">
            <Image
              source={require('../../assets/images/partlycloudy.png')}
              className="h-52 w-52"
            />
          </View>

          {/* temperature... */}
          <View className="space-y-2">
            <Text className="text-white text-center text-5xl ml-4">
              28
              <Text className="text-4xl" style={{fontSize: 40, lineHeight: 50}}>
                °
              </Text>
            </Text>
            <Text className="text-white text-center text-base font-semibold tracking-widest">
              Partly Cloudy
            </Text>
          </View>

          {/* weather details... */}
          <View className="flex-row justify-between mx-4">
            <View className="flex-row items-center space-x-2">
              <Image
                source={require('../../assets/icons/wind.png')}
                className="h-6 w-6"
              />
              <Text className="text-white text-base font-semibold">22km</Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <Image
                source={require('../../assets/icons/drop.png')}
                className="h-6 w-6"
              />
              <Text className="text-white text-base font-semibold">23%</Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <Image
                source={require('../../assets/icons/sun.png')}
                className="h-6 w-6"
              />
              <Text className="text-white text-base font-semibold">
                6:05 AM
              </Text>
            </View>
          </View>
        </View>

        {/* daily forecast... */}
        <View className="mb-2 space-y-3">
          <View className='flex-row items-center mx-5 space-x-2'>
            <CalendarDaysIcon size={'22'} color={'white'} />
            <Text className="text-white text-base">Daily forecast</Text>
          </View>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 15}}
          >
            <View className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4 bg-slate-400 bg-opacity-80">
              <Image source={require('../../assets/images/heavyrain.png')} className="h-12 w-12" />
              <Text className='text-white '>Monday</Text>
              <Text className='text-white text-xl'>23&#176;</Text>

            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
