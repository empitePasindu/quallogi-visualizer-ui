import { useLayoutEffect, useRef } from 'react';
import { Activity, ActivityType } from '../models/Activity';
import { SubBreach } from '../models/BreachMapper';
import { toSimpleDateString } from '../utils/dateUtils';
import { scrollToElement } from '../utils/utils';

type BreachListProps = {
  selectedBreach: SubBreach | undefined;
  breaches: SubBreach[];
  onBreachClick: (breach: SubBreach) => void;
};

const BreachItem = (props: { breach: SubBreach; onClick: (breach: SubBreach) => void }) => {
  return (
    <div
      id={'act-' + props.breach.id}
      className="col bg-border"
      onClick={() => {
        props.onClick(props.breach);
      }}
    >
      <div className="row" style={{ backgroundColor: props.breach.selected ? 'lightblue' : '' }}>
        <div className="col-1 bg-border">{props.breach.id}</div>
        {/* <div className="col-5 bg-border">{toSimpleDateString(props.breach.startTime)}</div> */}
        <div className="col-4 " style={{ backgroundColor: 'lightred' }}>
          <div className="d-flex justify-content-around">
            <div>{props.breach.name.toUpperCase()}</div>
          </div>
        </div>
        {/* <div className="col-2 bg-border">{props.breach.durationStr}</div> */}
      </div>
    </div>
  );
};

export const BreachList = ({ selectedBreach, breaches, onBreachClick }: BreachListProps) => {
  const itemClickedRef = useRef(false);
  useLayoutEffect(() => {
    if (!itemClickedRef.current && selectedBreach) scrollToElement('act-' + selectedBreach.id);
    itemClickedRef.current = false;
  }, [selectedBreach]);

  const onItemClick = (subBreach: SubBreach) => {
    itemClickedRef.current = true;
    onBreachClick(subBreach);
  };
  return (
    <div className="row flex-column bg-border">
      {breaches.map((activity, index) => (
        <BreachItem key={index} breach={activity} onClick={onItemClick} />
      ))}
    </div>
  );
};
