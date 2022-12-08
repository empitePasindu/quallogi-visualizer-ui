import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { ActivityForm, ActivityFormData } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';
import { Activity, ActivityType, Duration, IActivity } from './models/Activity';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import * as du from './utils/dateUtils';
import { AddActivityConfirmation, AddBreachDialog, DeleteActivityConfirmation, MoveOption } from './components/Modals';
import { ActivityTimeline } from './components/ActivityTimeline';
import { BreachResult, getBFMBreaches } from './services/FatigueApi';
import { RuleBreachCounter } from './models/RuleBreachCounter';
import { BreachedCounterList } from './components/BreachedCounterList';
import { SaveLoad } from './components/SaveLoad';
import { scrollToElement } from './utils/utils';
import { BreachList } from './components/BreachList';
import { ISubBreach, SubBreach } from './models/BreachMapper';
import { act } from 'react-dom/test-utils';

export type ActivityInputOptions = {
  /**append new activity to bottom*/
  append: boolean;
  /**modify a selected activity */
  modify: boolean;
};

function App() {
  const [activities, setActivites] = useState<Activity[]>([]);
  /**represents exptected breaches that were added manually */
  const [breaches, setBreaches] = useState<SubBreach[]>([]);
  const [breachCounters, setBreachCounters] = useState<RuleBreachCounter[]>([]);

  const [breachResult, setBreachResult] = useState<BreachResult>();
  const [loading, setLoading] = useState(false);

  /**activity selected */
  const [selectedActivity, setSelectedActivity] = useState<Activity>();
  const [selectedBreach, setSelectedBreach] = useState<SubBreach>();

  /**duration add start point */
  const [durationAddStartActivity, setDurationAddStartActivity] = useState<Activity>();

  /**counter selected */
  const [selectedCounter, setSelectedCounter] = useState<RuleBreachCounter>();

  const [formInputActivity, setFormInputActivity] = useState<Activity>();
  const [inputOptions, setInputOptions] = useState<ActivityInputOptions>({ append: true, modify: false });
  const [resetForm, setResetForm] = useState(false);
  const [fullResetTrigger, setFullResetTrigger] = useState(false);
  const [triggerDeleteConfirmation, setTriggerDeleteConfirmation] = useState(false);
  const [triggerAddBreachDialog, setTriggerAddBreachDialog] = useState(false);

  const addOrModifyActivity = (startDate: string, type: ActivityType, duration: Duration, moveOption?: MoveOption) => {
    if (inputOptions.modify && activities.length === 0) {
      toast.info('Create an activity first to modify');
      return;
    }

    if (inputOptions.modify && !selectedActivity) {
      toast.info('Select an activity to modify');
      return;
    }

    if (duration.days === 0 && duration.hours === 0 && duration.minutes === 0) {
      toast.error('Duration cannot be Zero ');
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

    //if activity is selected with modify option
    if (inputOptions.modify) {
      const selectedActivityIndex = selectedActivity.id;
      const updatedDuration = du.getSecondsFromDuration(duration);
      const durationOffset = updatedDuration - selectedActivity.duration;
      if (durationOffset === 0) toast.info('New and prev durations are same and type is same,Nothing to modify');
      activities.forEach((activity, index) => {
        if (moveOption === MoveOption.moveBeforeActivities && index < selectedActivityIndex) {
          activity.moveActivityTimeBy(durationOffset * -1);
        } else if (moveOption === MoveOption.moveAfterActivites && index > selectedActivityIndex) {
          activity.moveActivityTimeBy(durationOffset);
        }
      });
      if (moveOption === MoveOption.moveBeforeActivities) selectedActivity.setDuration(updatedDuration, true);
      else if (moveOption === MoveOption.moveAfterActivites) selectedActivity.setDuration(updatedDuration, false);
      selectedActivity.type = type;
      setActivites([...activities]);
      return;
    }

    //default -- activity is selected with add or modify option add the new activity
    const beforeActivityIndex = selectedActivity.id;
    const durationSeconds = du.getSecondsFromDuration(duration);
    activities.forEach((activity, index) => {
      if (moveOption === MoveOption.moveBeforeActivities && index <= beforeActivityIndex) {
        activity.moveActivityTimeBy(durationSeconds * -1);
      } else if (moveOption === MoveOption.moveAfterActivites && index > beforeActivityIndex) {
        activity.moveActivityTimeBy(durationSeconds);
      }

      if (index > beforeActivityIndex) activity.id += 1;
    });

    activities.splice(beforeActivityIndex + 1, 0, Activity.withDuration(beforeActivityIndex + 1, selectedActivity.endTime, type, duration));
    setActivites([...activities]);
  };

  const addBreach = (rawSubBreach: ISubBreach) => {
    if (!selectedActivity) return;
    const newBreach = new SubBreach(breaches.length, rawSubBreach, selectedActivity);
    selectedActivity.addBreach(newBreach);
    breaches.push(newBreach);
    setBreaches([...breaches]);
  };

  useEffect(() => {
    console.log('updates', selectedActivity, activities);

    if (selectedActivity) setFormInputActivity(selectedActivity);
    else if (activities.length > 0) setFormInputActivity(activities[activities.length - 1]);
    else setFormInputActivity(undefined);
  }, [activities, selectedActivity]);

  useEffect(() => {}, [durationAddStartActivity]);

  /**Removes a given activity and
   *
   * - option===moveAfterActivites >>  moves the after activities backward by the removed activity's duration
   * - option===moveBeforeActivities >>  moves the before activities forward by the removed activity's duration */
  const removeActivity = (activityId: number, option: MoveOption) => {
    const targetActivityIndex = activityId;
    if (targetActivityIndex == -1) throw Error('no activity found to delete');
    const targetActivity = activities[targetActivityIndex];

    activities.forEach((activity, index) => {
      if (option === MoveOption.moveBeforeActivities && index <= targetActivityIndex) activity.moveActivityTimeBy(targetActivity.duration);
      else if (option === MoveOption.moveAfterActivites && index >= targetActivityIndex) activity.moveActivityTimeBy(targetActivity.duration * -1);

      if (index >= targetActivityIndex) activity.id -= 1;
    });
    activities.splice(targetActivityIndex, 1);
    setActivites([...activities]);
    setSelectedActivity(undefined);
  };

  const removeSelectedActivity = (option: MoveOption) => {
    if (selectedActivity) {
      removeActivity(selectedActivity.id, option);
    }
  };

  const removeSelectedBreach = () => {
    if (!selectedBreach) return;
    activities.forEach((act) => act.removeBreach(selectedBreach));
    setBreaches([...breaches.filter((breach) => breach.id !== selectedBreach.id)]);
  };

  const onActivityAddOrUpdate = (activityInput: ActivityFormData, moveOption?: MoveOption) => {
    addOrModifyActivity(
      du.localDateToString(activityInput.startDate),
      activityInput.type as ActivityType,
      {
        days: activityInput.days,
        hours: activityInput.hours,
        minutes: activityInput.minutes,
      },
      moveOption,
    );
  };
  /**sets or clears the activity selection
   * @param updateBreaches highlights corresponding breaches for the selected activity
   */
  const updateSelectedActivity = (selectedActivity: Activity | null, updateBreaches = true) => {
    activities.forEach((activity) => {
      if (activity.id === selectedActivity?.id) {
        activity.setSelected(true);
        //updated by reference ,so no need to map with original breach list
        if (updateBreaches) {
          breaches.forEach((breach) => breach.setSelected(false));
          activity.getBreaches().forEach((sBreach) => sBreach.setSelected(true));
        }
      } else activity.setSelected(false);
    });
    setActivites([...activities]);
    setSelectedActivity(selectedActivity ? selectedActivity : undefined);
    setBreaches([...breaches]);
  };
  /**sets or clears the breach selection*/
  const updateSelectedBreach = (selectedBreach: SubBreach | null) => {
    breaches.forEach((breach) => {
      if (breach.id === selectedBreach?.id) {
        breach.setSelected(true);
      } else breach.setSelected(false);
    });
    setBreaches([...breaches]);
    setSelectedBreach(selectedBreach ? selectedBreach : undefined);
  };

  /**@param selectSameActivityBreaches selects the other breaches belonging to the activity of the breach */
  const onBreachSelectUpdate = (breach: SubBreach | null, selectSameActivityBreaches = false) => {
    updateSelectedBreach(breach);
    if (breach) {
      updateSelectedActivity(breach.activity, selectSameActivityBreaches);
    }
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

  /**sets the selected activity as duration add start and does the other related calcualations*/
  const setDurationAddStart = (set: boolean) => {
    if (selectedActivity && set) {
      setActivites([...addUpDurations(selectedActivity.id, activities)]);
      setDurationAddStartActivity(selectedActivity);
    } else if (activities.length > 0) {
      setActivites(
        activities.map((act) => {
          act.resetTotalDurations();
          return act;
        }),
      );
      setDurationAddStartActivity(undefined);
    }
  };

  const addUpDurations = (startActivityId: number, activities: Activity[]) => {
    let workSum = 0;
    let restSum = 0;
    activities.forEach((act) => {
      if (act.id >= startActivityId) {
        if (act.type === ActivityType.work) {
          workSum += act.duration;
        } else {
          restSum += act.duration;
        }
      }
      act.totalRest = restSum;
      act.totalWork = workSum;
    });
    return activities;
  };

  /**
   * @description Moving all the activites forward or backward by amount equals to lastActivity.endTime - currentTime.
   *
   * this is done since the calculation always refers the lastActivity endTime as the currentTime .
   */
  const syncActivityTimes = () => {
    const currentEpoch = du.nowTimeInEpoch();
    const moveDuration = currentEpoch - (selectedActivity ? selectedActivity.endTimeS : activities[activities.length - 1].endTimeS);
    activities.forEach((act) => act.moveActivityTimeBy(moveDuration));
    setActivites([...activities]);
  };

  const resetSelections = () => {
    updateSelectedActivity(null);
    updateSelectedCounter(null);
    updateSelectedBreach(null);
  };

  const resetAll = () => {
    updateSelectedActivity(null);
    updateSelectedCounter(null);
    updateSelectedBreach(null);
    setActivites([]);
    setBreachCounters([]);
    setBreaches([]);
    setFullResetTrigger((trig) => !trig);
  };

  //-----------API-----------------
  const getBreaches = async () => {
    setLoading(true);
    const startTime = Date.now();
    const result = await getBFMBreaches(selectedActivity ? activities.filter((act) => act.id <= selectedActivity.id) : activities);
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
      const endTime = Date.now() - startTime;
      toast.success('Calcuation Done in ' + endTime / 1000 + 's');
      console.log('time taken', endTime);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="container my-2" style={{ maxWidth: '90vw' }}>
        <div className="row justify-content-start mb-3">
          <div className="col-3 mt-2">
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
              <div className="col-4">
                <div className="d-flex  justify-content-around">
                  <Button variant="info" onClick={resetSelections} disabled={!selectedActivity && !selectedCounter}>
                    Deselect
                  </Button>
                  <Button variant="warning" onClick={resetAll} disabled={activities.length === 0 && breachCounters.length === 0}>
                    Reset
                  </Button>
                  <Button variant="success" onClick={() => getBreaches()} disabled={activities.length === 0}>
                    BFM
                  </Button>
                  <Button variant="primary" onClick={syncActivityTimes} disabled={activities.length === 0}>
                    Sync
                  </Button>
                </div>
              </div>
              <div className="col">
                <SaveLoad
                  activities={activities}
                  onActivitesLoaded={(activities, breaches) => {
                    setActivites(activities);
                    setBreaches(breaches);
                  }}
                  triggerReset={fullResetTrigger}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <ActivityForm
            inputActivity={formInputActivity}
            onSubmit={onActivityAddOrUpdate}
            onRemove={removeSelectedActivity}
            inputOptions={inputOptions}
            disableDateEdit={activities.length !== 0}
            hasSelectedActivity={selectedActivity != null}
            reset={resetForm}
          />
        </div>
        <div className="row">
          <div className="col-5 d-flex">
            <Button
              variant="info"
              onClick={() => {
                setDurationAddStart(durationAddStartActivity ? false : true);
              }}
              disabled={!selectedActivity && !durationAddStartActivity}
            >
              {durationAddStartActivity ? 'Reset Add' : 'Set Add'}
            </Button>
            <div className="mx-3 d-flex">
              <h4 className="align-self-center">{durationAddStartActivity?.id}</h4>
            </div>
            <Button
              className="mx-2"
              variant="warning"
              onClick={() => {
                setTriggerAddBreachDialog((val) => !val);
              }}
              disabled={!selectedActivity}
            >
              Add Breach
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                removeSelectedBreach();
              }}
              disabled={!selectedBreach}
            >
              Remove Breach
            </Button>
          </div>
        </div>
        <div className="row bg-border" style={{ fontSize: '0.8em' }}>
          <div className="col bg-border">
            <div className="row bg-border">
              <h4 className="col">Activities</h4>
              <div className="w-100"></div>
              <div className="col scroll-list" style={{ maxHeight: '50vh', overflow: 'scroll' }}>
                <ActivityList activities={activities} selectedActivity={selectedActivity} onActivityClick={updateSelectedActivity} />
              </div>
            </div>
          </div>
          <div className="col-3 bg-border">
            <div className="row bg-border">
              <h4 className="col">Expected Breaches</h4>
              <div className="w-100"></div>
              <div className="col scroll-list" style={{ maxHeight: '50vh', overflow: 'scroll' }}>
                <BreachList breaches={breaches} selectedBreach={selectedBreach} onBreachClick={onBreachSelectUpdate} />
              </div>
            </div>
          </div>
          <div className="col bg-border">
            <div className="row bg-border">
              <h4 className="col">Actual Breaches</h4>
              <div className="w-100"></div>
              <div className="col scroll-list" style={{ maxHeight: '50vh', overflow: 'scroll' }}>
                <BreachedCounterList breachCounter={breachCounters} onCounterClick={updateSelectedCounter} />
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col bg-border">
            <ActivityTimeline
              activities={activities}
              breachCounters={breachCounters}
              breaches={breaches}
              selectedActivity={selectedActivity}
              onActivitySelect={updateSelectedActivity}
              onCounterSelect={updateSelectedCounter}
              onBreachSelect={(breach) => onBreachSelectUpdate(breach, true)}
            />
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover theme="colored" />
      <AddBreachDialog trigger={triggerAddBreachDialog} onConfirmation={addBreach} />
    </>
  );
}

export default App;
