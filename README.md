### Limitations

**max activity input is 1000 ,if needed to increase edit the following limit of 1000 in ActivityTimeline.tsx**

- in onActivitySelect function

```js
if (id < 1000) {
  const activity = props.activities.find((act) => act.id === id - 1);
  if (activity) props.onActivitySelect(activity);
} else {
  const counter = props.breachCounters.find((act) => act.id === id - 1000);
  if (counter) props.onCounterSelect(counter);
}
```

- in mapBreachResults function
  ```js
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
  ```

### Features

- submitting to BFM after clicking on an activity will only process upto the selected activity .If no selected element ,total activity list will be submitted
-
