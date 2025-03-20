import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import axiosInstance from '../util/axiosConfig';
import { InputWrapper } from './reservationStyled';

interface DateTimePickerProps {
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  selectedMembers: { value: number; label: string } | null;
  onMembersChange: (selectedOption: any) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedStartDate,
  selectedEndDate,
  onStartDateChange,
  onEndDateChange,
  selectedMembers,
  onMembersChange,
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
          let current = new Date(start); // start 시간부터 시작
          while (current <= end) {
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

  // 인원 선택 옵션
  const membersOptions = Array.from({ length: 5 }, (_, i) => ({ value: i + 1, label: `${i + 1}명` }));

  return (
    <div>
      <InputWrapper>
        <label>날짜 선택</label>
        <DatePicker
          selected={selectedStartDate}
          onChange={onStartDateChange}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          className="date-picker"
          placeholderText="날짜를 선택하세요"
        />
      </InputWrapper>

      <InputWrapper>
        <label>시작 시간</label>
        <DatePicker
          selected={selectedStartDate}
          onChange={onStartDateChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          minTime={new Date().setHours(9, 0, 0)}
          maxTime={new Date().setHours(21, 0, 0)}
          excludeTimes={getDisabledTimes(selectedStartDate)}
          placeholderText="시작 시간 선택"
          disabled={!selectedStartDate}
          className="date-picker"
        />
      </InputWrapper>

      <InputWrapper>
        <label>종료 시간</label>
        <DatePicker
          selected={selectedEndDate}
          onChange={onEndDateChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          minTime={selectedStartDate ? new Date(selectedStartDate.getTime() + 60 * 60 * 1000) : undefined}
          maxTime={selectedStartDate ? new Date(selectedStartDate.getTime() + 3 * 60 * 60 * 1000) : undefined}
          excludeTimes={getDisabledTimes(selectedStartDate)}
          placeholderText="종료 시간 선택"
          disabled={!selectedStartDate}
          className="date-picker"
        />
      </InputWrapper>

      <InputWrapper>
        <label>인원 선택</label>
        <Select
          classNamePrefix="react-select"
          options={membersOptions}
          value={selectedMembers}
          onChange={onMembersChange}
          className="react-select"
        />
      </InputWrapper>
    </div>
  );
};

export default DateTimePicker;
