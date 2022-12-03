import React, { useState } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ActivityForm, ActivityFormData } from './ActivityForm';
import { ActivityList } from './ActivityList';
import { Activity, ActivityType, Duration, IActivity } from './Activity';
import { InputGroup, Form } from 'react-bootstrap';

type ActivityInputOptions = {
  /**add new activity*/
  addNew: boolean;
  /**modify a selected activity */
  modify: boolean;
};

function App() {
  const [activities, setActivites] = useState<Activity[]>([]);
  /**activity selected */
  const [selectedActivity, setSelectedActivity] = useState<Activity>();
  const [inputOptions, setInputOptions] = useState<ActivityInputOptions>({ addNew: true, modify: false });

  const addActivity = (startDate: string, type: ActivityType, duration: Duration) => {
    if (activities.length === 0) {
      setActivites([...activities, Activity.fromOffestDuration(0, startDate, type, duration)]);

      return;
    }

    if (!selectedActivity) {
      setActivites([...activities, Activity.fromOffestDuration(activities.length, startDate, type, duration)]);
      return;
    }

    //if activity is selected for modification adjust all the durations of that activity and in the activities after that
  };

  const onActivityAdd = (activityInput: ActivityFormData) => {
    addActivity(activityInput.startDate.toString(), activityInput.type, { days: activityInput.days, hours: activityInput.hours, minutes: activityInput.minutes });
  };

  return (
    <div className="container">
      <div className="row">
        <InputGroup className="mb-3">
          <Form.Check
            className="me-3"
            type="radio"
            label={'Add'}
            checked={inputOptions.addNew}
            onClick={() => setInputOptions({ addNew: !inputOptions.addNew, modify: !inputOptions.modify })}
          />
          <Form.Check type="radio" label={'Modify'} checked={inputOptions.modify} onClick={() => setInputOptions({ addNew: !inputOptions.addNew, modify: !inputOptions.modify })} />
        </InputGroup>
      </div>
      <div className="row">
        <ActivityForm onSubmit={onActivityAdd} disableDateEdit={selectedActivity != null} />
      </div>
      <div className="row bg-border">
        <div className="col-4 bg-border">
          <ActivityList activities={activities} />
        </div>
        <div className="col-8 bg-border">asas</div>
      </div>
    </div>
  );
}

export default App;
