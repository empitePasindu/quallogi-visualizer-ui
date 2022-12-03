import { Activity } from './Activity';

type ActivityProps = {
  activities: Activity[];
};

const ActivityItem = (props: { activity: Activity }) => {
  return (
    <div className="col bg-border">
      <div className="row">
        <div className="col-2 bg-border">id</div>
        <div className="col-10 bg-border">date</div>
      </div>
    </div>
  );
};

export const ActivityList = ({ activities }: ActivityProps) => {
  return (
    <div className="row flex-column bg-border">
      {activities.map((activity, index) => (
        <ActivityItem key={index} activity={activity} />
      ))}
    </div>
  );
};
