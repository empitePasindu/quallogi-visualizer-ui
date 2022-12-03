import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { ActivityForm, ActivityFormData } from './ActivityForm';
import { ActivityList } from './ActivityList';
import { Activity, ActivityType, Duration, IActivity } from './Activity';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

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
  const [resetForm, setResetForm] = useState(false);
  const addActivity = (startDate: string, type: ActivityType, duration: Duration) => {
    const newActivity = Activity.fromOffestDuration(activities.length, startDate, type, duration);

    if (newActivity.duration == 0) {
      toast.error('duration cannot be Zero');
      return;
    }

    if (activities.length === 0) {
      setActivites([...activities, Activity.fromOffestDuration(0, startDate, type, duration)]);
      console.log('setting activities');
      return;
    }

    if (!selectedActivity) {
      const existingActivity = activities.find((act) => act.startTimeMs === newActivity.startTimeMs);
      if (existingActivity) {
        toast.error('Activity already exists at id:' + existingActivity.id);
        return;
      }

      setActivites([...activities, newActivity]);
    }

    //if activity is selected for modification adjust all the durations of that activity and in the activities after that
  };

  useEffect(() => {
    console.log('activities updated', activities);
  }, [activities]);
  const removeActivity = (activityId: number) => {
    setActivites(activities.filter((activity) => activity.id !== activityId));
  };

  const removeSelectedActivity = () => {
    if (selectedActivity) {
      removeActivity(selectedActivity.id);
    }
  };

  const onActivityAdd = (activityInput: ActivityFormData) => {
    addActivity(activityInput.startDate.toString(), activityInput.type as ActivityType, { days: activityInput.days, hours: activityInput.hours, minutes: activityInput.minutes });
  };

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-start mb-3">
          <div className="d-flex mt-2">
            <InputGroup>
              <Form.Check
                className="me-3"
                type="radio"
                label={'Add'}
                checked={inputOptions.addNew}
                onClick={() => setInputOptions({ addNew: !inputOptions.addNew, modify: !inputOptions.modify })}
              />

              <Form.Check
                className="me-3"
                type="radio"
                label={'Modify'}
                checked={inputOptions.modify}
                onClick={() => setInputOptions({ addNew: !inputOptions.addNew, modify: !inputOptions.modify })}
              />
            </InputGroup>
          </div>
          <div className="d-flex">
            <Button variant="danger" onClick={removeSelectedActivity}>
              Delete
            </Button>
          </div>
        </div>
        <div className="row">
          <ActivityForm activity={selectedActivity} onSubmit={onActivityAdd} disableDateEdit={selectedActivity != null} reset={resetForm} />
        </div>
        <div className="row bg-border">
          <div className="col-4 bg-border">
            <ActivityList activities={activities} />
          </div>
          <div className="col-8 bg-border">asas</div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover theme="colored" />
    </>
  );
}

export default App;
