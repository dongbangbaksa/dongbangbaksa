import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../util/axiosConfig'; // axios 인스턴스 import

interface DateTimePickerProps {
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedStartDate,
  selectedEndDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const [reservedTimes, setReservedTimes] = useState<{ start: Date; end: Date }[]>([]);

  // 예약 데이터 불러오기
  const fetchReservations = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/reservation/all');

      const formatDateString = (dateString: string) => {
        const regex = /^(\d{4})년 (\d{2})월 (\d{2})일 (\d{2}):(\d{2}):(\d{2})$/;
        const match = dateString.match(regex);

        if (!match) return '';

        const [_, year, month, day, hour, minute, second] = match;
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
      };

      const formattedReservations = response.data
        .map((res: { startTime: string; endTime: string }) => {
          const formattedStart = formatDateString(res.startTime);
          const formattedEnd = formatDateString(res.endTime);

          if (!formattedStart || !formattedEnd) return null;

          return {
            start: new Date(formattedStart),
            end: new Date(formattedEnd),
          };
        })
        .filter(Boolean);

      setReservedTimes(formattedReservations);
    } catch (error) {
      console.error('예약 데이터를 불러오는 중 오류 발생:', error);
    }
  }, []);

  // 특정 날짜의 예약된 시간 리스트 반환
  const getDisabledTimes = useCallback(
    (selectedDate: Date | null) => {
      if (!selectedDate) return [];

      const disabledTimes: Date[] = [];

      reservedTimes
        .filter(({ start, end }) => selectedDate.toDateString() === start.toDateString()) // 같은 날짜의 예약된 시간만 필터링
        .forEach(({ start, end }) => {
          // 예약 시작 시간부터 종료 시간까지 1시간 간격으로 비활성화 시간 추가
          let current = new Date(start); // start 시간부터 시작
          // start 시간에 맞춰 정확히 1시간 단위로 비활성화
          while (current <= end) {
            // 종료 시간도 포함하도록 수정
            // 현재 시간을 disabledTimes에 추가 (초 단위 제외)
            disabledTimes.push(new Date(current.setMinutes(0, 0, 0))); // 정확히 시각만 맞춰서 00분 00초로 설정
            current.setHours(current.getHours() + 1); // 1시간 간격으로 설정
          }
        });

      return disabledTimes;
    },
    [reservedTimes],
  );

  useEffect(() => {
    fetchReservations(); // 예약 데이터를 불러옴
  }, [fetchReservations]);

  return (
    <div>
      <div>
        <label>예약 시작 시간</label>
        <DatePicker
          selected={selectedStartDate}
          onChange={onStartDateChange}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          timeFormat="HH:mm"
          timeIntervals={60}
          minDate={new Date()}
          timeCaption="시간"
          showPopperArrow={false}
          excludeTimes={getDisabledTimes(selectedStartDate)}
        />
      </div>
      <div>
        <label>예약 종료 시간</label>
        <DatePicker
          selected={selectedEndDate}
          onChange={onEndDateChange}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          timeFormat="HH:mm"
          timeIntervals={60}
          minDate={selectedStartDate || new Date()}
          timeCaption="시간"
          showPopperArrow={false}
          excludeTimes={getDisabledTimes(selectedEndDate)}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
