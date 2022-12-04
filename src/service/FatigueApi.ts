import { Activity } from '../Activity';

const BASE_URL = 'http://localhost:3300/';
const get_breaches = BASE_URL + 'get-breaches';
/**extrac work causes breaches */
export type Breach = {
  name: string;
  severity: number;
  key: string;
  from: number;
  to: number;
  valid: boolean;
};

export type Breached = {
  name: string;
  severity: number;
  key: string;
  from: number;
  to: number;
  readable: string;
  type: string;
  ruleset: string;
  activityTime: number;
  startPoint: number;
  endPoint: number;
  period: string;
};

export type BreakRule = {};

export type StartingPoint = {
  endTime: number;
  breaches: Breach[];
  breaks: Break[];
};

/**lesser rests make breaks*/
export type Break = {
  endTime: number;
  breaches: Breach[];
  breakRule: any;
  restType: string;
};

export type WorkBreach = {
  /**rule counter start epoch */
  startPoint: number;
  endTime: number;
  breaches: Breach[];
};

export type RestBreach = {
  /**rule counter start epoch */
  startPoint: number;
  endTime: number;
  breaches: Breach[];
  breaks: Break[];
  startingPoints: StartingPoint[];
  startingPoint: number;
};

type Duration = {
  minutes: number;
  humanized: string;
  iso: string;
  maximumWork: number;
  requiredRest: number;
};

export type RuleBreach = {
  id: number;
  endTime: number;
  /**all breaches for the rule */
  breaches: Breach[];
  /**only the work breaches for the rule */
  workRemaining: WorkBreach;
  /**only the rest breaches for the rule*/
  restToBeTaken: RestBreach;
  duration: Duration;
};

export type BreachResult = {
  /**contains all breach points by rule index*/
  resultSet: RuleBreach[];
  /**all work breach posibilities */
  work: {
    endTime: number;
    breaches: Breach[];
  };
  /**all rest breach posibilities */
  rest: {
    endTime: number;
    breaches: Breach[];
  };
  breached: Breached[];
};

/**return input samples from backend */
export function getInputs() {}

export function getRuleSet() {}

export async function getBFMBreaches(activities: Activity[]): Promise<BreachResult> {
  const response = await fetch(get_breaches, {
    method: 'POST',
    body: JSON.stringify({ tada: 'tada' }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (response.ok) {
    return Promise.resolve(data as BreachResult);
  } else {
    throw Error('Fatigue API getBFMBreaches Request failed');
  }
}
