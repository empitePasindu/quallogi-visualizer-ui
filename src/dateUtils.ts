import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Duration } from './Activity';
const timeZone = 'Australia/Melbourne'; //GMT+11
const timeFormat = 'YYYY-MM-DDTHH:mm:ssZ';
const timeFormatSimple = 'DD/MM HH:mm';

//const timeZone = 'Asia/Colombo'
dayjs.extend(timezone);
dayjs.tz.setDefault(timeZone);
dayjs.extend(duration);
dayjs.extend(relativeTime);

export function nowTime() {
  return dayjs();
}

export function toDateString(time: Dayjs) {
  return time.format(timeFormat);
}

export function toSimpleDateString(time: string) {
  return dayjs(time).format(timeFormatSimple);
}

export function addDurationToDate(date: string, duration: Duration): Dayjs {
  return dayjs(date).add(duration.days, 'day').add(duration.hours, 'hour').add(duration.minutes, 'minute');
}
/**add if seconds >  0 ,subtract if seconds < 0 */
export function addSecondsToDate(date: string, seconds: number): Dayjs {
  return seconds > 0 ? dayjs(date).add(seconds, 'second') : dayjs(date).subtract(Math.abs(seconds), 'second');
}

export function subtractSecondsFromDate(date: string, seconds: number): Dayjs {
  return dayjs(date).subtract(seconds, 'second');
}

/**@returns time difference in milliseconds */
export function timeDiff(startTime: string, endTime: string): number {
  return dayjs(endTime).diff(startTime, 'second');
}

export function secondsToReadable(durationSeconds: number) {
  return dayjs.duration(durationSeconds, 'second').humanize();
}
/** @returns 1D2H3M,2D3H,.. with up to a minute resolution */
export function secondsToISO(durationSeconds: number) {
  return dayjs.duration(Math.ceil(durationSeconds / 60), 'minute').toISOString();
}

export function dateToEpoch(date: string) {
  return dayjs(date).unix();
}

export function epochToDateStr(epoch: number) {
  return toDateString(dayjs.unix(epoch));
}

export function dateToLocalDate(date: string) {
  return dayjs(date).toDate();
}

export function localDateToString(date: Date) {
  return dayjs(date).format(timeFormat);
}

export function getDurationFromSeconds(durationSec: number): Duration {
  const durationObj = dayjs.duration(durationSec, 'second');
  const days = durationObj.asDays();
  const hours = durationObj.subtract(days, 'day').asHours();
  const minutes = durationObj.subtract(days, 'day').subtract(hours, 'hour').asMinutes();

  return {
    days: days,
    hours: hours,
    minutes: minutes,
  };
}
