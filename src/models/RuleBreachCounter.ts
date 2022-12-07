import { ActivityType } from './Activity';
import * as du from '../utils/dateUtils';
import { Breached, RuleBreach } from '../services/FatigueApi';
import { number } from 'yup';

//TODO add remaining rule types
export enum RuleType {
  Day14 = '14 day',
  Day7 = '7 day',
  Day = '24H',
  Min15 = '15MIN',
}

export enum Severity {
  zero = 0,
  minor,
  substantial,
  severe,
  critical,
}

export namespace Severity {
  export function getKeyByValue(value: number) {
    return Object.values(Severity)[value];
  }
}

/**Represents the breach counter for a given rule  */
export interface IRuleBreachCounter {
  /**index of the residing array */
  id: number;
  /**start point for the counter in dateTime */
  startTime: string;
  /**end point for the counter ,
   * after this time the serverity based breaches will be applied in dateTime */
  endTime: string;
  /**7 day ,14 day .... */
  mainRule: RuleType;
  /** nested condtion of the mainRule */
  subRule: string;
  type: ActivityType;
  severity: Severity;
}

function getRuleTypeFromDuration(duration: number): RuleType {
  const durations = du.getDurationFromSeconds(duration);
  if (durations.days >= 14) return RuleType.Day14;
  else if (durations.days >= 7) return RuleType.Day7;
  else if (durations.hours >= 24) return RuleType.Day;
  //TODO add remaining rule types
  else return RuleType.Min15;
}
/**@param period PT336H,PT24H ... */
function getRuleTypeFromPeriod(period: string): RuleType {
  if (period.includes('336')) return RuleType.Day14;
  else if (period.includes('168')) return RuleType.Day7;
  else if (period.includes('24')) return RuleType.Day;
  //TODO add remaining rule types
  else return RuleType.Min15;
}

export class RuleBreachCounter implements IRuleBreachCounter {
  id: number;
  startTime: string;
  endTime: string;
  mainRule: RuleType;
  subRule: string;
  type: ActivityType;
  /**startTime in epoch */
  startTimeS: number;
  /**endTime in epoch */
  endTimeS: number;
  severity: Severity;

  selected = false;
  /**@param ruleDurationS 'duration of the rule in seconds'*/
  constructor(id: number, startPoint: number, endPoint: number, mainRule: RuleType, subRule: string, type: ActivityType, severity: number) {
    this.id = id;
    this.startTime = du.epochToDateStr(startPoint);
    this.endTime = du.epochToDateStr(endPoint);
    this.mainRule = mainRule;
    this.subRule = subRule;
    this.type = type;
    this.startTimeS = startPoint;
    this.endTimeS = endPoint;
    this.severity = severity;
  }

  public setSelected(selected: boolean) {
    this.selected = selected;
  }

  public getSeverityKey() {
    return Severity.getKeyByValue(this.severity) as string;
  }
  public static fromRuleBreach(id: number, ruleBreach: RuleBreach) {
    // const ruleType = getRuleTypeFromDuration(ruleBreach.duration.minutes*1000)
    // return new RuleBreachCounter(id,ruleBreach.workRemaining.startPoint,ruleType,)
  }
  public static fromBreached(id: number, breached: Breached) {
    const ruleType = getRuleTypeFromPeriod(breached.period);
    return new RuleBreachCounter(id, breached.startPoint, breached.endPoint, ruleType, breached.ruleset, breached.type as ActivityType, breached.severity);
  }
}
