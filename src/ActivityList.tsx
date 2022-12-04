import { Activity, ActivityType } from './Activity';
import { toSimpleDateString } from './dateUtils';

type ActivityProps = {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
};

const ActivityItem = (props: { activity: Activity; onClick: (activity: Activity) => void }) => {
  return (
    <div
      className="col bg-border"
      onClick={() => {
        props.onClick(props.activity);
      }}
    >
      <div className="row" style={{ backgroundColor: props.activity.selected ? 'lightblue' : '' }}>
        <div className="col-1 bg-border">{props.activity.id}</div>
        <div className="col-7 bg-border">{toSimpleDateString(props.activity.startTime)}</div>
        <div className="col-2 bg-border" style={{ backgroundColor: props.activity.type === ActivityType.rest ? 'lightgreen' : 'lightyellow' }}>
          {props.activity.type}
        </div>
        <div className="col-2 bg-border">{props.activity.durationStr}</div>
      </div>
    </div>
  );
};

export const ActivityList = ({ activities, onActivityClick }: ActivityProps) => {
  const onItemClick = (activity: Activity) => {
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
