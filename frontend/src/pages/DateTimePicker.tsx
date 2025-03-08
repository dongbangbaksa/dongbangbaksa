import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from 'date-fns'; // 날짜 조작을 위한 유틸리티 함수

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
  const handleStartDateChange = (date: Date | null) => {
    if (date && selectedEndDate) {
      // 시작 날짜와 시간을 선택한 후, 종료 날짜와 시간이 시작 시간 이후인지 확인
      if (date >= selectedEndDate) {
        alert('예약 시작 시간은 종료 시간보다 이전이어야 합니다.');
        return;
      }
    }
    onStartDateChange(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date && selectedStartDate) {
      // 종료 날짜와 시간을 선택한 후, 시작 날짜와 시간이 종료 시간 이전인지 확인
      if (date <= selectedStartDate) {
        alert('예약 종료 시간은 시작 시간보다 이후이어야 합니다.');
        return;
      }
    }
    onEndDateChange(date);
  };

  return (
    <div>
      <div>
        <label>예약 시작 시간</label>
        <DatePicker
          selected={selectedStartDate}
          onChange={handleStartDateChange}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          timeFormat="HH:mm"
          timeIntervals={60} // 1시간 단위로 시간 선택
          minDate={new Date()} // 오늘 날짜 이후로만 선택 가능
          timeCaption="시간"
          showPopperArrow={false}
        />
      </div>
      <div>
        <label>예약 종료 시간</label>
        <DatePicker
          selected={selectedEndDate}
          onChange={handleEndDateChange}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          timeFormat="HH:mm"
          timeIntervals={60} // 1시간 단위로 시간 선택
          minDate={selectedStartDate || new Date()} // 시작 날짜 이후로만 종료 날짜 선택 가능
          timeCaption="시간"
          showPopperArrow={false}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
