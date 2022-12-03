import React, { useState } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ActivityForm } from './ActivityForm';
import { ActivityList } from './ActivityList';
import { Activity, IActivity } from './Activity';
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

  const addActivity = (startDate: string, days = 0, hours = 0, minutes = 0) => {
    if (activities.length === 0) {
      activities.push(Activity.fromOffestDuration(0, startDate, days, hours, minutes));
      return;
    }

    if (!selectedActivity) {
      activities.push(Activity.fromOffestDuration(activities.length, startDate, days, hours, minutes));
      return;
    }

    //if activity is selected for modification adjust all the durations of that activity and in the activities after that
  };

  const onActivityAdd = (activityInput: any) => {};

  return (
    <div className="container">
      <div className="row">
        <InputGroup className="mb-3">
          <Form.Check type="radio" name="group1" label={'Add'} checked={true} />
          <Form.Check type="radio" name="group1" label={'Modify'} />
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
