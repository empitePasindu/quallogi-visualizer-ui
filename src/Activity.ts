import * as du from './dateUtils';

export enum ActivityType {
  rest = 'rest',
  work = 'work',
}

export interface Duration {
  days: number;
  hours: number;
  minutes: number;
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
    else this.endTime = activity.duration ? du.toDateString(du.addMilliSecondsToDate(activity.startTime, activity.duration)) : this.startTime;

    this.startTimeMs = du.dateToMs(this.startTime);
    this.endTimeMs = du.dateToMs(this.endTime);
    this.durationStr = du.msToReadable(this.duration);
  }

  public static fromOffestDuration(id: number, startTime: string, type: ActivityType, duration: Duration = { days: 0, hours: 0, minutes: 0 }): Activity {
    const endTime = du.toDateString(du.addDurationToDate(startTime, duration));
    const durationMs = du.timeDiff(startTime, endTime);
    return new Activity({ id: id, startTime: startTime, type: type, duration: durationMs, endTime: endTime });
  }
}
