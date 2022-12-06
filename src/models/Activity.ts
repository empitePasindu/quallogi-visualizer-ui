import * as du from '../utils/dateUtils';
import { ISubBreach, SubBreach } from './BreachMapper';

export enum ActivityType {
  rest = 'rest',
  work = 'work',
}

export interface Duration {
  days: number;
  hours: number;
  minutes: number;
}

export interface IBaseActivity {
  startTime: string;
  type: ActivityType;
  breaches?: ISubBreach[];
}

export interface IActivity extends IBaseActivity {
  id: number;
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

  /**endTime= currentTime for lastActivity
   *
   * This is the way js logic works
   */
  isLastActivity = false;

  breaches: SubBreach[] = [];

  //-------UI--------
  /**used to set as selected element */
  selected = false;
  /**holds sum of workDurations from prev startActivity in seconds */
  totalWork = 0;
  /**holds sum of restDurations from prev startActivity in seconds*/
  totalRest = 0;
  /**for isLastActivity === true duration and endTime input is not considered */
  constructor(activity: IActivity, isLastActivity = false) {
    this.id = activity.id;
    this.startTime = activity.startTime;
    this.type = activity.type;
    this.duration = activity.duration ? activity.duration : 0;

    if (isLastActivity) {
      this.isLastActivity = true;
      this.endTime = du.toDateString(du.nowTime());
      this.duration = du.timeDiff(this.startTime, this.endTime);
    } else {
      if (activity.endTime) this.endTime = activity.endTime;
      else this.endTime = activity.duration ? du.toDateString(du.addSecondsToDate(activity.startTime, activity.duration)) : '';
    }

    this.startTimeS = du.dateToEpoch(this.startTime);
    this.endTimeS = du.dateToEpoch(this.endTime);
    this.durationStr = this.duration > 0 ? du.secondsToReadable(this.duration) : '0';
  }

  public setSelected(selected: boolean) {
    this.selected = selected;
  }

  public getTotalWorkHumanized() {
    return this.totalWork === 0 ? '' : du.secondsToISO(this.totalWork).replace('P', '').replace('T', '');
  }
  public getTotalRestHumanized() {
    return this.totalRest === 0 ? '' : du.secondsToISO(this.totalRest).replace('P', '').replace('T', '');
  }
  public resetTotalDurations() {
    this.totalRest = 0;
    this.totalWork = 0;
  }

  public addBreach(subBreach: SubBreach) {
    this.breaches.push(subBreach);
  }
  public removeBreach(subBreach: SubBreach) {
    this.breaches = this.breaches.filter((sBreach) => sBreach.id !== subBreach.id);
  }

  public getBreaches() {
    return this.breaches;
  }

  public hasBreaches() {
    return this.breaches.length > 0;
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
  public static withEndTime(id: number, startTime: string, type: ActivityType, endTime: string): Activity {
    const durationMs = du.timeDiff(startTime, endTime);
    return new Activity({ id: id, startTime: startTime, type: type, duration: durationMs, endTime: endTime });
  }
  /**last activity will have current time as end time */
  public static asLastActivity(id: number, startTime: string, type: ActivityType): Activity {
    return new Activity({ id: id, startTime: startTime, type: type }, true);
  }
}
