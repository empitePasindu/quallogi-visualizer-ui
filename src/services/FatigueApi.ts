import { ActivitiesSaveFormat } from '../components/SaveLoad';
import { Activity, IActivity, IBaseActivity } from '../models/Activity';

const BASE_URL = 'http://localhost:3300/';
const GET_BREACHES_API = BASE_URL + 'get-breaches';
const ACTIVITY_FILE_NAMES_API = BASE_URL + 'get-activity-file-names';
const SAVE_ACTIVITY_API = BASE_URL + 'save-activity';
const GET_ACTIVITY_LIST_API = BASE_URL + 'get-activity-list';
const GET_ACTIVITY_LIST_META_DATA_API = BASE_URL + 'get-meta-data-by-file-name';

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

/**Load all filenames of the saved activityLists */
export async function getActivityFileNames(): Promise<string[]> {
  const response = await fetch(ACTIVITY_FILE_NAMES_API, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (response.ok) {
    return Promise.resolve(data.fileNames);
  } else {
    throw Error('Fatigue API getActivityFileNames Request failed');
  }
}
/**saves activities as json file with the given fileName */
export async function saveActivitiesList(activities: ActivitiesSaveFormat, fileName: string) {
  const response = await fetch(SAVE_ACTIVITY_API, {
    method: 'POST',
    body: JSON.stringify({ data: activities, fileName }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (response.ok) {
    return Promise.resolve(true);
  } else {
    throw Error('Fatigue API saveActivitiesList Request failed');
  }
}

/**Load activity list with the given fileName */
export async function getActivityList(fileName: string): Promise<IBaseActivity[]> {
  const response = await fetch(GET_ACTIVITY_LIST_API + '?fileName=' + fileName, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (response.ok) {
    return Promise.resolve(data.activities);
  } else {
    throw Error('Fatigue API getActivityList Request failed');
  }
}

export async function getActivityListMetaData(fileName: string): Promise<{ description?: string; subBreachName?: string }> {
  const response = await fetch(GET_ACTIVITY_LIST_META_DATA_API + '?fileName=' + fileName, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (response.ok) {
    return Promise.resolve(data);
  } else {
    throw Error('Fatigue API getActivityListMetaData Request failed');
  }
}

export async function getBFMBreaches(activities: IActivity[]): Promise<BreachResult> {
  const response = await fetch(GET_BREACHES_API, {
    method: 'POST',
    body: JSON.stringify({ activities: activities.map((act): IBaseActivity => ({ startTime: act.startTime, type: act.type })) }),
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
