import React, {useCallback, useEffect, useState} from 'react';
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
  ToastAndroid,
} from 'react-native';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {CalendarDaysIcon, MapPinIcon} from 'react-native-heroicons/solid';
import {debounce} from 'lodash';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';
import {weatherImages} from '../constants';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleLocation = loc => {
    console.log(loc);
    setIsSearching(false);
    setLoading(true);
    setLocations([]);
    setShowSearch(false);
    fetchWeatherForecast({cityName: loc.name, days: 7}).then(data => {
      console.log('forecast for ', loc.name, ' : ', data);
      if (data === null) {
        ToastAndroid.show('Error fetching data', ToastAndroid.SHORT);
      } else {
        storeData('city', loc.name);
        setWeather(data);
        console.log(data?.forecast?.forecastday)
      }
      setLoading(false);
    });
  };

  const handleSearch = value => {
    console.log(value);
    setIsSearching(true);
    if (value.length > 2) {
      fetchLocations({cityName: value}).then(data => {
        console.log(data);
        setIsSearching(false);
        setLocations(data);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = myCity ? myCity : 'Pune';

    setLoading(true);
    fetchWeatherForecast({cityName, days: '7'}).then(data => {
      console.log('forecast', data);
      if (data === null) {
        ToastAndroid.show('Error fetching data', ToastAndroid.SHORT);
      } else {
        console.log(data?.forecast?.forecastday)
        setWeather(data);
      }
      setLoading(false);
    });
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const {current, location} = weather;

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  }

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View className="flex-1 relative">
      <StatusBar barStyle="light-content" hidden />
      <ImageBackground
        resizeMode="cover"
        source={require('../../assets/images/bg4.jpg')}
        className="absolute h-full w-full"
        blurRadius={70}
      />
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail
            color={['blue', 'red', 'green']}
            size={100}
            thickness={5}
          />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          <View style={{height: '7%'}} className="mx-4 mt- relative z-50">
            <View
              className={`flex-row justify-end items-center rounded-full ${
                showSearch ? ' bg-slate-600' : ''
              }`}>
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search City"
                  placeholderTextColor={'lightgray'}
                  className="pl-6 h-10 flex-1 text-base text-white"
                />
              ) : null}
              {isSearching ? (
                <Progress.CircleSnail
                  color='#0095b6'
                  size={40}
                  thickness={2}
                  className="p-3"
                />
              ) : (
                <TouchableOpacity
                  className="rounded-full p-3 m-1 bg-slate-400"
                  onPress={() => setShowSearch(!showSearch)}>
                  <MagnifyingGlassIcon
                    size={'25'}
                    color="white"></MagnifyingGlassIcon>
                </TouchableOpacity>
              )}
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
                        {loc?.name}, {loc?.country}
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
              {location?.name},
              <Text className="text-base font-semibold text-slate-300">
                {' ' + location?.country}
              </Text>
            </Text>

            {/* weather image.... */}
            <View className="flex-row justify-center">
              <Image
                source={weatherImages[current?.condition?.text]}
                // source={require('../../assets/images/partlycloudy.png')}
                className="h-52 w-52"
              />
            </View>

            {/* temperature... */}
            <View className="space-y-2">
              <Text className="text-white text-center text-5xl ml-4">
                {current?.temp_c}
                <Text
                  className="text-4xl"
                  style={{fontSize: 40, lineHeight: 50}}>
                  °
                </Text>
              </Text>
              <Text className="text-white text-center text-base font-semibold tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>

            {/* weather details... */}
            <View className="flex-row justify-between mx-4">
              <View className="flex-row items-center space-x-2">
                <Image
                  source={require('../../assets/icons/wind.png')}
                  className="h-6 w-6"
                />
                <Text className="text-white text-base font-semibold">
                  {current?.wind_kph}km/h
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Image
                  source={require('../../assets/icons/drop.png')}
                  className="h-6 w-6"
                />
                <Text className="text-white text-base font-semibold">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Image
                  source={require('../../assets/icons/sun.png')}
                  className="h-6 w-6"
                />
                <Text className="text-white text-base font-semibold">
                  {weather?.forecast?.forecastday?.[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>

          {/* daily forecast... */}
          <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size={'22'} color={'white'} />
              <Text className="text-white text-base">Daily forecast</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 15}}>
              {weather?.forecast?.forecastday?.map((item, idx) => {
                let date = new Date(item.date);
                let options = {weekday: 'long'};
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0];
                console.log(item?.day?.condition?.text)
                return (
                  <View
                    key={idx}
                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4 bg-slate-400 bg-opacity-80">
                    <Image
                      source={weatherImages[item?.day?.condition?.text]? weatherImages[item?.day?.condition?.text] : weatherImages['Clear']}
                      className="h-12 w-12"
                    />
                    <Text className="text-white ">{dayName}</Text>
                    <Text className="text-white text-xl">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default HomeScreen;
