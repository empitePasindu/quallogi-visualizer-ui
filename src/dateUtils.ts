import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import { Duration } from './Activity';
const timeZone = 'Australia/Melbourne'; //GMT+11
const timeFormat = 'YYYY-MM-DDTHH:mm:ssZ[Z]';
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
  return dayjs(date).valueOf();
}
