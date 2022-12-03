import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import { Duration } from './Activity';
const timeZone = 'Australia/Melbourne'; //GMT+11
const timeFormat = 'YYYY-MM-DDTHH:mm:ssZ';
//const timeZone = 'Asia/Colombo'

dayjs.extend(duration);
dayjs.extend(timezone);
dayjs.tz.setDefault(timeZone);

export function nowTime() {
  return dayjs();
}

export function toDateString(time: Dayjs) {
  return time.format(timeFormat);
}

export function addDurationToDate(date: string, duration: Duration): Dayjs {
  return dayjs(date).add(duration.days, 'day').add(duration.hours, 'hour').add(duration.minutes, 'minute');
}

export function addMilliSecondsToDate(date: string, milliSeconds: number): Dayjs {
  return dayjs(date).add(milliSeconds, 'millisecond');
}

/**@returns time difference in milliseconds */
export function timeDiff(startTime: string, endTime: string): number {
  return dayjs(startTime).diff(endTime);
}

export function msToReadable(durationMs: number) {
  //   return dayjs.duration(durationMs, 'millisecond').humanize();
  return '0';
}

export function dateToMs(date: string) {
  return dayjs(date).unix();
}

export function dateToLocalDate(date: string) {
  return dayjs(date).toDate();
}

export function getDurationFromMs(durationMs: number): Duration {
  const durationObj = dayjs.duration(durationMs, 'millisecond');
  const days = durationObj.asDays();
  const hours = durationObj.subtract(days, 'day').asHours();
  const minutes = durationObj.subtract(days, 'day').subtract(hours, 'hour').asMinutes();

  return {
    days: days,
    hours: hours,
    minutes: minutes,
  };
}
