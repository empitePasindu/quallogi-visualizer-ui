/*
 * This Script Represents Breach mapping functions between source code rule keys and NHVR documentation rule keys
 *
 */

import { breachMappings } from '../common/BreachMappings';
import { Activity } from './Activity';
import { IBreach } from './Breach';

export interface IDocumentReference {
  /**common name used for the breach */
  name: '14 Day 84H Work Breach NHVR Rule';
  description: '14 Day NHVR Rule 1 desciption';
}

export interface ISubBreach {
  /**unique name for the sub rule */
  name: string;
  description: string;
  /**NHVR document data for the rule*/
  documentReference: IDocumentReference;
}

export interface IMainBreach {
  /**unique name for the main rule */
  name: string;
  description: string;
  subBreaches: ISubBreach[];
}

export type SubBreachListItem = {
  id: number;
  subBreach: ISubBreach;
};

const mainBreaches: IMainBreach[] = breachMappings.mainBreaches;

export const getAllSubBreaches = (): SubBreachListItem[] => {
  const subBreaches: SubBreachListItem[] = [];
  let indexCounter = 0;
  mainBreaches.forEach((mainBreach, mIndex) => {
    mainBreach.subBreaches.forEach((subBreach, index) => {
      subBreaches.push({ id: indexCounter, subBreach: subBreach });
      indexCounter += 1;
    });
  });
  return subBreaches;
};

const getMainBreachBySubBreachName = (subBreachName: string) => {
  const mainBreach = mainBreaches.find((mb) => mb.subBreaches.find((sb) => sb.name === subBreachName));
  if (!mainBreach) throw Error('getMainBreachBySubBreachName::could not find mainBreach by subBreachName,' + subBreachName);
  return mainBreach;
};

export class SubBreach implements ISubBreach {
  description: string;
  documentReference: IDocumentReference;
  name: string;

  id: number;
  mainBreach: IMainBreach;
  /**activity where the breach happenes */
  activity: Activity;
  selected = false;

  /**@param activity activity where the breach happenes */
  constructor(id: number, subBreach: ISubBreach, activity: Activity) {
    this.id = id;
    this.name = subBreach.name;
    this.description = subBreach.description;
    this.documentReference = subBreach.documentReference;
    this.mainBreach = getMainBreachBySubBreachName(subBreach.name);
    this.activity = activity;
  }

  setSelected(select: boolean) {
    this.selected = select;
  }
}
