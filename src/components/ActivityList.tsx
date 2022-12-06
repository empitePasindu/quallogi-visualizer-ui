import { useLayoutEffect, useRef } from 'react';
import { Activity, ActivityType } from '../models/Activity';
import { toSimpleDateString } from '../utils/dateUtils';
import { scrollToElement } from '../utils/utils';

type ActivityProps = {
  selectedActivity: Activity | undefined;
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
};

const ActivityItem = (props: { activity: Activity; onClick: (activity: Activity) => void }) => {
  return (
    <div
      id={'act-' + props.activity.id}
      className="col bg-border"
      onClick={() => {
        props.onClick(props.activity);
      }}
    >
      <div className="row" style={{ backgroundColor: props.activity.selected ? 'lightblue' : '' }}>
        <div className="col-1 bg-border">{props.activity.id}</div>
        <div className="col-5 bg-border">{toSimpleDateString(props.activity.startTime)}</div>
        <div className="col-4 bg-border" style={{ backgroundColor: props.activity.type === ActivityType.rest ? 'lightgreen' : 'lightyellow' }}>
          <div className="d-flex justify-content-around">
            <div>{props.activity.type.toUpperCase()}</div>
            <div>{props.activity.type === ActivityType.rest ? props.activity.getTotalRestHumanized() : props.activity.getTotalWorkHumanized()}</div>
          </div>
        </div>
        <div className="col-2 bg-border">{props.activity.durationStr}</div>
      </div>
    </div>
  );
};

export const ActivityList = ({ selectedActivity, activities, onActivityClick }: ActivityProps) => {
  const itemClickedRef = useRef(false);
  useLayoutEffect(() => {
    if (!itemClickedRef.current && selectedActivity) scrollToElement('act-' + selectedActivity.id);
    itemClickedRef.current = false;
  }, [selectedActivity]);

  const onItemClick = (activity: Activity) => {
    itemClickedRef.current = true;
    onActivityClick(activity);
  };
  return (
    <div className="row flex-column bg-border">
      {activities.map((activity, index) => (
        <ActivityItem key={index} activity={activity} onClick={onItemClick} />
      ))}
    </div>
  );
};
