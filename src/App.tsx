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
import * as du from './dateUtils';
import { DeleteActivityConfirmation, DeleteOption } from './Modals';
import { ActivityTimeline } from './ActivityTimeline';
import { BreachResult, getBFMBreaches } from './service/FatigueApi';
import { RuleBreachCounter } from './RuleBreachCounter';
import { BreachedCounterList } from './BreachedCounterList';
import { SaveLoad } from './SaveLoad';

type ActivityInputOptions = {
  /**append new activity to bottom*/
  append: boolean;
  /**modify a selected activity */
  modify: boolean;
};

function App() {
  const [activities, setActivites] = useState<Activity[]>([]);
  const [breachCounters, setBreachCounters] = useState<RuleBreachCounter[]>([]);

  const [breachResult, setBreachResult] = useState<BreachResult>();
  const [loading, setLoading] = useState(false);

  /**activity selected */
  const [selectedActivity, setSelectedActivity] = useState<Activity>();

  /**counter selected */
  const [selectedCounter, setSelectedCounter] = useState<RuleBreachCounter>();

  const [formInputActivity, setFormInputActivity] = useState<Activity>();
  const [inputOptions, setInputOptions] = useState<ActivityInputOptions>({ append: true, modify: false });
  const [resetForm, setResetForm] = useState(false);
  const [fullResetTrigger, setFullResetTrigger] = useState(false);
  const [triggerDeleteConfirmation, setTriggerDeleteConfirmation] = useState(false);

  const addActivity = (startDate: string, type: ActivityType, duration: Duration) => {
    if (duration.days === 0 && duration.hours === 0 && duration.minutes === 0) {
      toast.error('duration cannot be Zero ');
      return;
    }

    if (activities.length === 0) {
      const firstActivity = Activity.withDuration(0, startDate, type, duration);
      setActivites([firstActivity]);
      return;
    }

    const newActivity = Activity.withDuration(activities.length, activities[activities.length - 1].endTime, type, duration);

    if (!selectedActivity) {
      const existingActivity = activities.find((act) => act.startTimeS === newActivity.startTimeS);
      if (existingActivity) {
        toast.error('Activity already exists at id:' + existingActivity.id);
        return;
      }

      setActivites([...activities, newActivity]);
      return;
    }
    console.log('has selectedActivity');

    //if activity is selected for modification adjust all the durations of that activity and in the activities after that
  };

  useEffect(() => {
    console.log('updates', selectedActivity, activities);

    if (selectedActivity) setFormInputActivity(selectedActivity);
    else if (activities.length > 0) setFormInputActivity(activities[activities.length - 1]);
    else setFormInputActivity(undefined);
  }, [activities, selectedActivity]);

  /**Removes a given activity and
   *
   * - option===moveAfterActivites >>  moves the after activities backward by the removed activity's duration
   * - option===moveBeforeActivities >>  moves the before activities forward by the removed activity's duration */
  const removeActivity = (activityId: number, option: DeleteOption) => {
    const targetActivityIndex = activityId;
    if (targetActivityIndex == -1) throw Error('no activity found to delete');
    const targetActivity = activities[targetActivityIndex];

    activities.forEach((activity, index) => {
      if (option === DeleteOption.moveBeforeActivities && index <= targetActivityIndex) activity.moveActivityTimeBy(targetActivity.duration);
      else if (option === DeleteOption.moveAfterActivites && index >= targetActivityIndex) activity.moveActivityTimeBy(targetActivity.duration * -1);

      if (index >= targetActivityIndex) activity.id -= 1;
    });
    activities.splice(targetActivityIndex, 1);
    setActivites([...activities]);
    setSelectedActivity(undefined);
  };

  const removeSelectedActivity = (option: DeleteOption) => {
    if (selectedActivity) {
      removeActivity(selectedActivity.id, option);
    }
  };

  const onActivityAdd = (activityInput: ActivityFormData) => {
    addActivity(du.localDateToString(activityInput.startDate), activityInput.type as ActivityType, {
      days: activityInput.days,
      hours: activityInput.hours,
      minutes: activityInput.minutes,
    });
  };
  /**sets or clears the activity selection*/
  const updateSelectedActivity = (selectedActivity: Activity | null) => {
    activities.forEach((activity) => {
      if (activity.id === selectedActivity?.id) activity.setSelected(true);
      else activity.setSelected(false);
    });
    setActivites([...activities]);
    setSelectedActivity(selectedActivity ? selectedActivity : undefined);
  };

  /**sets or clears the counter selection*/
  const updateSelectedCounter = (selectedCounter: RuleBreachCounter | null) => {
    breachCounters.forEach((counter) => {
      if (counter.id === selectedCounter?.id) counter.setSelected(true);
      else counter.setSelected(false);
    });
    setBreachCounters([...breachCounters]);
    setSelectedCounter(selectedCounter ? selectedCounter : undefined);
  };

  const resetSelections = () => {
    updateSelectedActivity(null);
    updateSelectedCounter(null);
  };

  const resetAll = () => {
    updateSelectedActivity(null);
    updateSelectedCounter(null);
    setActivites([]);
    setBreachCounters([]);
    setFullResetTrigger((trig) => !trig);
  };

  //-----------API-----------------
  const getBreaches = async () => {
    setLoading(true);
    const result = await getBFMBreaches(activities);
    console.log('got breaches', result);
    if (result) {
      setBreachResult(result);
      setBreachCounters(
        result.breached
          .sort((a, b) => a.startPoint - b.startPoint)
          .map((breached, idx) => {
            return RuleBreachCounter.fromBreached(idx, breached);
          }),
      );
    }
    setLoading(false);
  };

  return (
    <>
      <div className="container" style={{ width: '95vw' }}>
        <div className="row justify-content-start mb-3">
          <div className="col mt-2">
            <InputGroup>
              <Form.Check
                className="me-3"
                type="radio"
                label={'Append'}
                checked={inputOptions.append}
                onChange={() => setInputOptions({ append: !inputOptions.append, modify: !inputOptions.modify })}
              />

              <Form.Check
                className="me-3"
                type="radio"
                label={'Modify'}
                checked={inputOptions.modify}
                onChange={() => setInputOptions({ append: !inputOptions.append, modify: !inputOptions.modify })}
              />
            </InputGroup>
          </div>
          <div className="col">
            <div className="row w-100 ml-2">
              <div className="col">
                <div className="d-flex">
                  <Button variant="danger" onClick={() => setTriggerDeleteConfirmation((val) => !val)} disabled={selectedActivity == null}>
                    Delete
                  </Button>
                  <Button variant="info" onClick={resetSelections} disabled={!selectedActivity && !selectedCounter}>
                    Deselect
                  </Button>
                  <Button variant="warning" onClick={resetAll} disabled={activities.length === 0 && breachCounters.length === 0}>
                    Reset
                  </Button>
                  <Button variant="success" onClick={() => getBreaches()} disabled={activities.length === 0}>
                    BFM
                  </Button>
                </div>
              </div>
              <div className="col">
                <SaveLoad activities={activities} onActivitesLoaded={setActivites} triggerReset={fullResetTrigger} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <ActivityForm activity={formInputActivity} onSubmit={onActivityAdd} disableDateEdit={activities.length !== 0} reset={resetForm} />
        </div>
        <div className="row bg-border">
          <div className="col bg-border">
            <div className="row bg-border">
              <h4 className="col">Activities</h4>
              <div className="w-100"></div>
              <div className="col" style={{ maxHeight: '50vh', overflow: 'scroll' }}>
                <ActivityList activities={activities} onActivityClick={updateSelectedActivity} />
              </div>
            </div>
          </div>
          <div className="col bg-border">
            <div className="row bg-border">
              <h4 className="col">Breaches</h4>
              <div className="w-100"></div>
              <div className="col" style={{ maxHeight: '50vh', overflow: 'scroll' }}>
                <BreachedCounterList breachCounter={breachCounters} onCounterClick={updateSelectedCounter} />
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col bg-border">
            <ActivityTimeline
              activities={activities}
              selectedActivity={selectedActivity}
              breachCounters={breachCounters}
              onActivitySelect={updateSelectedActivity}
              onCounterSelect={updateSelectedCounter}
            />
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover theme="colored" />
      <DeleteActivityConfirmation trigger={triggerDeleteConfirmation} onConfirmation={removeSelectedActivity} />
    </>
  );
}

export default App;
