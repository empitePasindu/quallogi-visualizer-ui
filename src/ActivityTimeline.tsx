// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import { Activity, ActivityType } from './Activity';
import { useEffect, useState } from 'react';
import ReactCalendarTimeline from 'react-calendar-timeline';
import { BreachResult } from './service/FatigueApi';

const groups = [
  { id: 1, title: 'activities' },
  { id: 2, title: 'breaches' },
];

/** 
const fullItemData = {
  id: 1,
  group: 1,
  title: 'Random title',
  start_time: 1457902922261,
  end_time: 1457902922261 + 86400000,
  canMove: true,
  canResize: false,
  canChangeGroup: false,
  itemProps: {
    // these optional attributes are passed to the root <div /> of each item as <div {...itemProps} />
    'data-custom-attribute': 'Random content',
    'aria-hidden': true,
    onDoubleClick: () => {
      console.log('You clicked double!');
    },
    className: 'weekend',
    style: {
      background: 'fuchsia',
    },
  },
};
*/
interface TimeLineActivity {
  id: number;
  group: number;
  title: string;
  start_time: moment.Moment;
  end_time: moment.Moment;
  itemProps?: any;
}

export const ActivityTimeline = (props: {
  activities: Activity[];
  breachResult: BreachResult | undefined;
  selectedActivity: Activity | undefined;
  onActivitySelect: (activity: Activity) => void;
}) => {
  const [tLActivites, setTlActivities] = useState<TimeLineActivity[]>([]);
  const [startActivity, setStartActivity] = useState<TimeLineActivity>();
  const [endActivity, setEndActivity] = useState<TimeLineActivity>();

  useEffect(() => {
    const newTlActivities = props.activities.map((act): TimeLineActivity => {
      return {
        id: act.id + 1,
        group: 1,
        title: act.type.toUpperCase() + ' ' + act.id,
        start_time: moment(act.startTime),
        end_time: moment(act.endTime),
        itemProps: {
          style: {
            'background-color': act.type === ActivityType.rest ? 'green' : 'red',
          },
        },
      };
    });

    if (props.breachResult) newTlActivities.concat(mapBreachResults(props.breachResult));

    setTlActivities(newTlActivities);
    setStartActivity(newTlActivities[0]);
    setEndActivity(newTlActivities[newTlActivities.length - 1]);
  }, [props.activities, props.breachResult]);

  const mapBreachResults = (breachResult: BreachResult): TimeLineActivity[] => {
    const tlActivities: TimeLineActivity[] = [];
    breachResult.resultSet.forEach((rule) => {});
    return tlActivities;
  };

  const onActivitySelect = (id: number) => {
    console.log('selectedTimeplineActivityId', id);
    const activity = props.activities.find((act) => act.id === id - 1);
    if (activity) props.onActivitySelect(activity);
  };

  return startActivity && endActivity ? (
    <Timeline
      groups={groups}
      items={tLActivites}
      defaultTimeStart={startActivity.start_time.subtract(2, 'day')}
      defaultTimeEnd={endActivity.end_time.add(2, 'day')}
      canMove={false}
      itemHeightRatio={0.75}
      onItemSelect={onActivitySelect}
    />
  ) : (
    <></>
  );
};
