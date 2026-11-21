import React, { useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { useFetchReservations } from '../hooks/useReservation';
import { InputWrapper } from '../styles/reservationStyled';

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
  // 예약 목록은 TanStack Query 캐시(['reservations'])를 공유 — 예약 생성 후 invalidateQueries 시 비활성화 시간도 즉시 갱신
  const { data: reservations } = useFetchReservations();

  const reservedTimes = useMemo(() => {
    const formatDateString = (dateString: string) => {
      const regex = /^(\d{4})년 (\d{2})월 (\d{2})일 (\d{2}):(\d{2}):(\d{2})$/;
      const match = dateString.match(regex);
      if (!match) return '';
      const [, year, month, day, hour, minute, second] = match;
      return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    };

    if (!Array.isArray(reservations)) return [];

    return reservations
      .map((res: { startTime: string; endTime: string }) => {
        const formattedStart = formatDateString(res.startTime);
        const formattedEnd = formatDateString(res.endTime);
        if (!formattedStart || !formattedEnd) return null;
        return { start: new Date(formattedStart), end: new Date(formattedEnd) };
      })
      .filter((v): v is { start: Date; end: Date } => v !== null);
  }, [reservations]);

  // 선택한 날짜에 해당하는 예약 구간만 반환
  const getReservationsForSelectedDate = useCallback(() => {
    if (!selectedStartDate) return [];
    return reservedTimes.filter(({ start }) => start.toDateString() === selectedStartDate.toDateString());
  }, [reservedTimes, selectedStartDate]);

  // 인원 선택 옵션
  const membersOptions = Array.from({ length: 5 }, (_, i) => ({ value: i + 1, label: `${i + 1}명` }));

  // 운영 시간(09:00~21:00) 외의 시간은 목록에서 숨김
  const OPENING_HOUR = 9;
  const CLOSING_HOUR = 21;
  const isWithinBusinessHours = (hour: number) => hour >= OPENING_HOUR && hour <= CLOSING_HOUR;

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  // 오늘 날짜 기준으로 이미 지난 시각(시 단위)인지 확인 — 현재 시각과 같은 시간대는 예약 가능
  const isPastStartHour = (hour: number) => {
    if (!selectedStartDate) return false;
    const now = new Date();
    if (!isSameDay(selectedStartDate, now)) return false;
    return hour < now.getHours();
  };

  const getStartMinTime = (): Date => {
    const min = new Date();
    min.setHours(OPENING_HOUR, 0, 0, 0);
    if (selectedStartDate && isSameDay(selectedStartDate, new Date())) {
      const currentHour = Math.max(OPENING_HOUR, new Date().getHours());
      min.setHours(currentHour, 0, 0, 0);
    }
    return min;
  };

  // 시작 시간 필터: 지난 시각·예약 구간 내부(start <= 시각 < end)는 시작 불가
  const filterStartTimes = (time: Date) => {
    const hour = time.getHours();
    if (!isWithinBusinessHours(hour)) return false;
    if (isPastStartHour(hour)) return false;
    return !getReservationsForSelectedDate().some(({ start, end }) => hour >= start.getHours() && hour < end.getHours());
  };

  // 종료 시간 필터: [시작 시간, 종료 시간] 구간이 예약 구간과 겹치면 불가
  const filterEndTimes = (time: Date) => {
    if (!selectedStartDate) return true;
    const endHour = time.getHours();
    if (!isWithinBusinessHours(endHour)) return false;
    const startHour = selectedStartDate.getHours();
    return !getReservationsForSelectedDate().some(
      ({ start, end }) => startHour < end.getHours() && endHour > start.getHours(),
    );
  };

  // 종료 시간 선택 시 시작 날짜와 같은 날짜로 맞춰줌 (날짜가 오늘로 잡히는 문제 방지)
  const handleEndTimeChange = (time: Date | null) => {
    if (time && selectedStartDate) {
      const merged = new Date(selectedStartDate);
      merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
      onEndDateChange(merged);
    } else {
      onEndDateChange(time);
    }
  };

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
          placeholderText="날짜 선택"
        />
      </InputWrapper>

      <InputWrapper>
        <label>시작 시간</label>
        <DatePicker
          selected={selectedStartDate}
          onChange={onStartDateChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60} // 1시간 간격으로 시간 설정
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          minTime={getStartMinTime()}
          maxTime={new Date(new Date().setHours(21, 0, 0, 0))}
          filterTime={filterStartTimes}
          placeholderText="시작 시간 선택"
          disabled={!selectedStartDate}
          className="date-picker"
        />
      </InputWrapper>

      <InputWrapper>
        <label>종료 시간</label>
        <DatePicker
          selected={selectedEndDate}
          onChange={handleEndTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60} // 1시간 간격으로 시간 설정
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          minTime={selectedStartDate ? new Date(selectedStartDate.getTime() + 60 * 60 * 1000) : undefined} // 시작 시간보다 1시간 이후
          maxTime={selectedStartDate ? new Date(selectedStartDate.getTime() + 3 * 60 * 60 * 1000) : undefined} // 시작 시간보다 3시간 이후
          filterTime={filterEndTimes} // 선택 불가능한 시간 필터링
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
          placeholder="인원 선택"
          className="react-select"
        />
      </InputWrapper>
    </div>
  );
};

export default DateTimePicker;
