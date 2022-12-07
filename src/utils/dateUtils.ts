import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Duration } from '../models/Activity';
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
  console.log('subtracting', date, seconds / 60 / 60);
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
  return dayjs.duration(Math.floor(durationSeconds / 60), 'minute').toISOString();
}

export function dateToEpoch(date: string) {
  return dayjs(date).unix();
}

export function epochToDateStr(epoch: number) {
  return toDateString(dayjs.unix(epoch));
}

export function epochToDateObj(epoch: number) {
  return dayjs.unix(epoch).toDate();
}

export function dateToLocalDate(date: string) {
  return dayjs(date).toDate();
}

export function localDateToString(date: Date) {
  return dayjs(date).format(timeFormat);
}

export function getSecondsFromDuration(duration: Duration): number {
  return dayjs.duration(duration.minutes, 'minute').add(duration.days, 'day').add(duration.hours, 'hour').asSeconds();
}

export function getDurationFromSeconds(durationSec: number): Duration {
  const days = dayjs.duration(durationSec, 'second').asDays();
  const hours = dayjs.duration(days - Math.floor(days), 'day').asHours();
  const minutes = dayjs.duration(hours - Math.floor(hours), 'hour').asMinutes();
  return {
    days: Math.floor(days), //Math.floor(durationSec / (60 * 60 * 24)),
    hours: Math.floor(hours), // Math.floor(durationSec / (60 * 60)),
    minutes: Math.floor(minutes), //Math.floor(durationSec / 60),
  };
}
