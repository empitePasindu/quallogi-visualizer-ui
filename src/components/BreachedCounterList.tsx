import { Activity, ActivityType } from '../models/Activity';
import { toSimpleDateString } from '../utils/dateUtils';
import { RuleBreachCounter } from '../models/RuleBreachCounter';

type BreachedCounterProps = {
  breachCounter: RuleBreachCounter[];
  onCounterClick: (breachCounter: RuleBreachCounter) => void;
};

const BreachedCounterItem = (props: { breachCounter: RuleBreachCounter; onClick: (breachCounter: RuleBreachCounter) => void }) => {
  return (
    <div
      className="col bg-border"
      onClick={() => {
        props.onClick(props.breachCounter);
      }}
    >
      <div className="row" style={{ backgroundColor: props.breachCounter.selected ? 'lightblue' : '' }}>
        <div className="col-1 bg-border date-column">{props.breachCounter.id}</div>
        <div className="col-4 bg-border d-flex justify-content-around">
          <p>{toSimpleDateString(props.breachCounter.startTime)}</p>
          <p>{toSimpleDateString(props.breachCounter.endTime)}</p>
        </div>
        <div className="col-1 bg-border" style={{ backgroundColor: props.breachCounter.type === ActivityType.rest ? 'lightgreen' : 'lightyellow' }}>
          {props.breachCounter.type}
        </div>
        <div className="col-6 bg-border">{props.breachCounter.subRule.split('>>')[0]}</div>
      </div>
    </div>
  );
};

export const BreachedCounterList = ({ breachCounter, onCounterClick }: BreachedCounterProps) => {
  const onItemClick = (breachCounter: RuleBreachCounter) => {
    onCounterClick(breachCounter);
  };
  return (
    <div className="row flex-column bg-border">
      {breachCounter.map((activity, index) => (
        <BreachedCounterItem key={index} breachCounter={activity} onClick={onItemClick} />
      ))}
    </div>
  );
};
