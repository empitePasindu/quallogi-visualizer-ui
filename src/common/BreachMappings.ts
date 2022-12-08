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
          description: '24 continuous hours stationary rest time taken after no more than 84 hours work time',
          documentReference: {
            name: '14 Day 84H Work Breach NHVR Rule',
            description: '14 Day NHVR Rule 1 desciption',
          },
          severity: 0,
        },
      ],
    },
  ],
};
