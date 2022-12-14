import dayjs from 'dayjs';
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
  /**endTime is saved when saving activities from the app and is used if available when loading the activities back
   *
   * This is needed only(but no required) for the last activity to determine its endTime
   *
   * If the last activity endTime doesn't exist refer mapBaseActivities function in SaveLoad.tsx for the default behaviour
   */
  endTime?: string;
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
    this.durationStr = this.duration > 0 ? du.secondsToHoursAndMins(this.duration) : '0';
  }

  setSelected(selected: boolean) {
    this.selected = selected;
  }

  getTotalWorkHumanized() {
    return this.totalWork === 0 ? '' : du.secondsToHoursAndMins(this.totalWork);
  }
  getTotalRestHumanized() {
    return this.totalRest === 0 ? '' : du.secondsToHoursAndMins(this.totalRest);
  }
  resetTotalDurations() {
    this.totalRest = 0;
    this.totalWork = 0;
  }

  addBreach(subBreach: SubBreach) {
    this.breaches.push(subBreach);
  }
  removeBreach(subBreach: SubBreach) {
    this.breaches = this.breaches.filter((sBreach) => sBreach.id !== subBreach.id);
  }

  getBreaches() {
    return this.breaches;
  }

  hasBreaches() {
    return this.breaches.length > 0;
  }
  /**moves the activity(startTime and endTime) forward (duration>0) or backward(duration<0) by the given duration
   *
   * keeping its original duration the same.
   *
   */
  moveActivityTimeBy(duration: number) {
    this.startTime = du.toDateString(du.addSecondsToDate(this.startTime, duration));
    this.startTimeS = du.dateToEpoch(this.startTime);

    this.endTime = du.toDateString(du.addSecondsToDate(this.endTime, duration));
    this.endTimeS = du.dateToEpoch(this.endTime);
  }
  /**
   * @param duration duration in seconds(=epoch)
   * @param modifyStartTime if true modifies the endTime to match the new duration else startTime is modified
   */
  setDuration(duration: number, modifyStartTime: boolean) {
    if (modifyStartTime) {
      this.startTime = du.toDateString(du.addSecondsToDate(this.endTime, -duration));
      this.startTimeS = du.dateToEpoch(this.startTime);
    } else {
      this.endTime = du.toDateString(du.addSecondsToDate(this.startTime, duration));
      this.endTimeS = du.dateToEpoch(this.endTime);
    }
    this.duration = duration;
    this.durationStr = this.duration > 0 ? du.secondsToHoursAndMins(this.duration) : '0';
  }

  static withDuration(id: number, startTime: string, type: ActivityType, duration: Duration = { days: 0, hours: 0, minutes: 0 }): Activity {
    const endTime = du.toDateString(du.addDurationToDate(startTime, duration));
    const durationMs = du.timeDiff(startTime, endTime);
    return new Activity({ id: id, startTime: startTime, type: type, duration: durationMs, endTime: endTime });
  }
  static withEndTime(id: number, startTime: string, type: ActivityType, endTime: string): Activity {
    const durationMs = du.timeDiff(startTime, endTime);
    return new Activity({ id: id, startTime: startTime, type: type, duration: durationMs, endTime: endTime });
  }
  /**last activity will have current time as end time */
  static asLastActivity(id: number, startTime: string, type: ActivityType): Activity {
    return new Activity({ id: id, startTime: startTime, type: type }, true);
  }
}
