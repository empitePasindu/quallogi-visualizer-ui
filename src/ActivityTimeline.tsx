// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import { Activity, ActivityType } from './Activity';
import { useEffect, useState } from 'react';
import ReactCalendarTimeline from 'react-calendar-timeline';
import { BreachResult } from './service/FatigueApi';
import { RuleBreachCounter, RuleType } from './RuleBreachCounter';

const groups = [
  { id: 1, title: 'activities' },
  { id: 2, title: '14 Day' },
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
  breachCounters: RuleBreachCounter[];
  selectedActivity: Activity | undefined;
  onActivitySelect: (activity: Activity) => void;
  onCounterSelect: (counter: RuleBreachCounter) => void;
}) => {
  const [tLActivites, setTlActivities] = useState<TimeLineActivity[]>([]);
  const [startActivity, setStartActivity] = useState<TimeLineActivity>();
  const [endActivity, setEndActivity] = useState<TimeLineActivity>();

  useEffect(() => {
    let newTlActivities = props.activities.map((act): TimeLineActivity => {
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

    if (props.breachCounters) {
      newTlActivities = newTlActivities.concat(mapBreachResults(props.breachCounters));
    }

    setTlActivities(newTlActivities);
    setStartActivity(newTlActivities[0]);
    setEndActivity(newTlActivities[newTlActivities.length - 1]);
  }, [props.activities, props.breachCounters]);

  const mapBreachResults = (breachCounters: RuleBreachCounter[]): TimeLineActivity[] => {
    const tlActivities: TimeLineActivity[] = breachCounters
      .filter((c) => c.mainRule === RuleType.Day14)
      .map((counter) => {
        return {
          id: counter.id + 1000,
          group: 2,
          title: counter.subRule.split('>>')[0],
          start_time: moment(counter.startTime),
          end_time: moment(counter.endTime),
          itemProps: {
            style: {
              'background-color': counter.type === ActivityType.rest ? 'blue' : 'orange',
            },
          },
        };
      });
    return tlActivities;
  };

  const onActivitySelect = (id: number) => {
    console.log('selectedTimeplineActivityId', id);
    if (id < 1000) {
      const activity = props.activities.find((act) => act.id === id - 1);
      if (activity) props.onActivitySelect(activity);
    } else {
      const counter = props.breachCounters.find((act) => act.id === id - 1000);
      if (counter) props.onCounterSelect(counter);
    }
  };

  return startActivity && endActivity ? (
    <Timeline
      groups={groups}
      items={tLActivites}
      defaultTimeStart={startActivity.start_time.subtract(2, 'day')}
      defaultTimeEnd={endActivity.end_time.add(2, 'day')}
      canMove={false}
      itemHeightRatio={0.75}
      stackItems
      onItemSelect={onActivitySelect}
    />
  ) : (
    <></>
  );
};
