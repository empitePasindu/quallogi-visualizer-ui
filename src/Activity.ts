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
  /**should be always equal to the index of the activity list */
  id: number = 0;
  startTime: string = '';
  type: ActivityType = ActivityType.rest;

  /**duration from startTime to endTime in seconds */
  duration: number;
  durationStr: string;

  endTime: string;
  /**start time in unix epoch (seconds) */
  startTimeS: number = 0;
  /**end time in unix epoch (seconds) */
  endTimeS: number = 0;

  /**duration=0 and endTime='' for lastActivity */
  isLastActivity = false;

  //-----UI-----
  /**used to set as selected element */
  selected = false;

  constructor(activity: IActivity) {
    this.id = activity.id;
    this.startTime = activity.startTime;
    this.type = activity.type;
    this.duration = activity.duration ? activity.duration : 0;

    this.isLastActivity = this.duration === 0;

    if (!this.isLastActivity && activity.endTime) this.endTime = activity.endTime;
    else this.endTime = activity.duration ? du.toDateString(du.addSecondsToDate(activity.startTime, activity.duration)) : '';

    this.startTimeS = du.dateToEpoch(this.startTime);
    this.endTimeS = this.isLastActivity ? du.dateToEpoch(this.endTime) : 0;
    this.durationStr = this.duration > 0 ? du.secondsToReadable(this.duration) : '0';
  }

  public setSelected(selected: boolean) {
    this.selected = selected;
  }

  /**moves the activity(startTime and endTime) forward (duration>0) or backward(duration<0) by the given duration
   *
   * keeping its original duration the same.
   *
   */
  public moveActivityTimeBy(duration: number) {
    this.startTime = du.toDateString(du.addSecondsToDate(this.startTime, duration));
    this.startTimeS = du.dateToEpoch(this.startTime);

    this.endTime = du.toDateString(du.addSecondsToDate(this.endTime, duration));
    this.endTimeS = du.dateToEpoch(this.endTime);
  }

  public static withDuration(id: number, startTime: string, type: ActivityType, duration: Duration = { days: 0, hours: 0, minutes: 0 }): Activity {
    const endTime = du.toDateString(du.addDurationToDate(startTime, duration));
    const durationMs = du.timeDiff(startTime, endTime);
    return new Activity({ id: id, startTime: startTime, type: type, duration: durationMs, endTime: endTime });
  }
  /**ad */
  public static asLastActivity(id: number, startTime: string, type: ActivityType): Activity {
    return new Activity({ id: id, startTime: startTime, type: type });
  }
}
