import { Activity } from '../Activity';

const BASE_URL = 'http://localhost:3300/';
const get_breaches = BASE_URL + 'get-breaches';
/**return input samples from backend */
export function getInputs() {}

export function getRuleSet() {}

export async function getBFMBreaches(activities: Activity[]) {
  const response = await fetch(get_breaches, {
    method: 'POST',
    body: JSON.stringify({ tada: 'tada' }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (response.ok) {
    return Promise.resolve(data);
  } else {
    const error = new Error(data.errors?.map((e: any) => e.message).join('\n') ?? 'unknown');
    return Promise.reject(error);
  }
}
