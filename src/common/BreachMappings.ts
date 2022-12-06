import { IMainBreach } from '../models/BreachMapper';
import { RuleType } from '../models/RuleBreachCounter';

type TBreachMappings = {
  mainBreaches: IMainBreach[];
};

/**Contains breach mappings from the NHVR Documentation in json doc format*/
export const breachMappings: TBreachMappings = {
  mainBreaches: [
    {
      name: '14 Day',
      description: '14 day rule',
      type: RuleType.Day14,
      subBreaches: [
        {
          name: '84 Hour',
          description: '84 Hour rule',
          documentReference: {
            name: '14 Day 84H Work Breach NHVR Rule',
            description: '14 Day NHVR Rule 1 desciption',
          },
        },
      ],
    },
  ],
};
