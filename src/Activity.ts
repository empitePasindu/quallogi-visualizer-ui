import * as du from './dateUtils';

export enum ActivityType {
  rest = 0,
  work = 1,
}

export interface IActivity {
  id: number;
  startTime: string;
  type: ActivityType;
  duration?: number;
  endTime?: string;
}

export class Activity implements IActivity {
  id: number = 0;
  startTime: string = '';
  type: ActivityType = ActivityType.rest;

  /**duration from startTime to endTime in ms */
  duration: number;
  durationStr: string;
  endTime: string;

  startTimeMs: number = 0;
  endTimeMs: number = 0;

  constructor(activity: IActivity) {
    this.id = activity.id;
    this.startTime = activity.startTime;
    this.type = activity.type;
    this.duration = activity.duration ? activity.duration : 0;
    if (activity.endTime) this.endTime = activity.endTime;
    else this.endTime = du.toDateString(activity.duration ? du.addMilliSecondsToDate(activity.startTime, activity.duration) : du.nowTime());

    this.startTimeMs = du.dateToMs(this.startTime);
    this.endTimeMs = du.dateToMs(this.endTime);
    this.durationStr = du.msToReadable(this.duration);
  }

  public static fromOffestDuration(id: number, startTime: string, type: ActivityType, days = 0, hours = 0, minutes = 0): Activity {
    const newStartTime = du.toDateString(du.addDurationToDate(startTime, days, hours, minutes));
    return new Activity({ id: id, startTime: newStartTime, type: type });
  }
}
