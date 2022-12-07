import { Activity, ActivityType } from '../models/Activity';
import { toSimpleDateString } from '../utils/dateUtils';
import { RuleBreachCounter, Severity } from '../models/RuleBreachCounter';

type BreachedCounterProps = {
  breachCounter: RuleBreachCounter[];
  onCounterClick: (breachCounter: RuleBreachCounter) => void;
};

const colorBySeverity: { [key: number]: string } = {
  [Severity.zero]: 'lightgreen',
  [Severity.minor]: 'gold',
  [Severity.substantial]: 'yellow',
  [Severity.severe]: 'orange',
  [Severity.critical]: 'red',
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
        <div className="col-4 bg-border d-flex flex-column justify-content-start">
          <div>{toSimpleDateString(props.breachCounter.startTime)}</div>
          <div>{toSimpleDateString(props.breachCounter.endTime)}</div>
          <div style={{ backgroundColor: colorBySeverity[props.breachCounter.severity] }}>{props.breachCounter.getSeverityKey()}</div>
        </div>
        <div className="col-1 bg-border ps-0" style={{ backgroundColor: props.breachCounter.type === ActivityType.rest ? 'lightgreen' : 'lightyellow' }}>
          <div>{props.breachCounter.type}</div>
        </div>
        <div className="col-6 bg-border">
          {props.breachCounter.subRule
            .split('>>')[0]
            .split('|')
            .map((str) => (
              <div>{str}</div>
            ))}
        </div>
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
