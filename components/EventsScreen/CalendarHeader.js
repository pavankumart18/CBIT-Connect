import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

// Helper function to generate the date range
const generateDateRange = () => {
  const startDate = new Date();
  const endDate = new Date();

  startDate.setDate(startDate.getDate() - 180);
  endDate.setDate(endDate.getDate() + 180);

  let dates = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const CalendarHeader = ({ selectedDate, onDateSelect }) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const dates = generateDateRange();

  // Get the current week on app load
  useEffect(() => {
    const today = new Date();
    const index = dates.findIndex(date => 
      date.toDateString() === today.toDateString()
    );
    setCurrentWeekIndex(Math.floor(index / 7));
  }, []);

  const getCurrentWeek = () => {
    return dates.slice(currentWeekIndex * 7, (currentWeekIndex + 1) * 7);
  };

  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  const handleNextWeek = () => {
    if ((currentWeekIndex + 1) * 7 < dates.length) {
      setCurrentWeekIndex(currentWeekIndex + 1);
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  const getCurrentMonth = () => {
    const currentWeek = getCurrentWeek();
    const month = currentWeek[0]?.toLocaleString('en-US', { month: 'long' });
    return month;
  };

  return (
    <View style={{ backgroundColor: '#000', paddingVertical: 10 }}>
      
      {/* Month and Arrow Navigation */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 10 
      }}>
        <TouchableOpacity onPress={handlePrevWeek}>
          <Text style={{ color: '#fff', fontSize: 24 }}>◀</Text>
        </TouchableOpacity>
        
        <Text style={{ color: '#fff', fontSize: 30, fontWeight: 'bold' }}>
          {getCurrentMonth()}
        </Text>

        <TouchableOpacity onPress={handleNextWeek}>
          <Text style={{ color: '#fff', fontSize: 24 }}>▶</Text>
        </TouchableOpacity>
      </View>
      
      {/* Week Dates */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        style={{ marginTop: 10, paddingHorizontal: 10 }}
      >
        {getCurrentWeek().map((date, index) => (
          <TouchableOpacity key={index} onPress={() => onDateSelect(date)}>
            <View style={{ 
              alignItems: 'center', 
              marginHorizontal: 10, 
              padding: 8,
              borderRadius: 15,
              backgroundColor: selectedDate?.toDateString() === date.toDateString() ? '#fff' : 'transparent',
            }}>
              <Text style={{ 
                color: selectedDate?.toDateString() === date.toDateString() ? '#000' : '#fff',
                fontSize: 16, 
                fontWeight: 'bold',
              }}>
                {date.toLocaleString('en-US', { weekday: 'short' })}
              </Text>
              <Text style={{
                color: selectedDate?.toDateString() === date.toDateString() ? '#000' : '#fff',
                fontSize: 18,
                fontWeight: 'bold',
                marginTop: 4,
              }}>
                {date.getDate()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CalendarHeader;
