import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Activity, IBaseActivity } from '../models/Activity';
import { dateToEpoch } from '../utils/dateUtils';
import { LoadActivityFileConfirmation, SaveActivityAsFileConfirmation } from './Modals';
import { getActivityFileNames, getActivityList, saveActivitiesList } from '../services/FatigueApi';
import { SubBreach } from '../models/BreachMapper';

export const SaveLoad = (props: { triggerReset: boolean; activities: Activity[]; onActivitesLoaded: (activities: Activity[], breaches: SubBreach[]) => void }) => {
  const [triggerSave, setTriggerSave] = useState(false);
  const [triggerLoad, setTriggerLoad] = useState(false);
  /**activity list file names */
  const [fileNames, setFileNames] = useState<string[]>([]);
  const resetPrevRef = useRef(false);

  useEffect(() => {
    if (resetPrevRef.current !== props.triggerReset) {
      resetPrevRef.current = props.triggerReset;
    }
  }, [props.triggerReset]);

  const showLoadActivities = () => {
    getActivityFileNames()
      .then((names) => {
        setFileNames(names);
        setTriggerLoad((val) => !val);
      })
      .catch((error) => {
        toast.error('Load file name List Failed');
        console.log(error);
      });
  };

  const loadActivities = (fileName: string) => {
    getActivityList(fileName)
      .then((baseActivities) => {
        console.log('base activities', baseActivities);
        const { finalActivities, finalBreaches } = mapBaseActivities(baseActivities);
        props.onActivitesLoaded(finalActivities, finalBreaches);
        toast.success('Load Activities success');
      })
      .catch((error) => {
        toast.error('Load Activities Failed');
        console.log(error);
      });
  };

  const mapBaseActivities = (baseActivities: IBaseActivity[]) => {
    //add epochTime(=startTimeS) variable and sort list using it
    const sortedBaseActivities = baseActivities.map((act) => ({ ...act, startTimeS: dateToEpoch(act.startTime) })).sort((a, b) => a.startTimeS - b.startTimeS);
    const lastActivityIndex = baseActivities.length - 1;
    const finalActivities: Activity[] = [];
    const finalBreaches: SubBreach[] = [];

    let breachCounter = 0;
    sortedBaseActivities.forEach((bActivity, index) => {
      //-------activity mapping---------
      let activity: Activity;
      if (index < lastActivityIndex) {
        if (!sortedBaseActivities[index + 1]) throw Error('invalid activity at :' + (index + 1));
        activity = Activity.withEndTime(index, bActivity.startTime, bActivity.type, sortedBaseActivities[index + 1].startTime);
      } else {
        activity = Activity.asLastActivity(index, bActivity.startTime, bActivity.type);
      }
      finalActivities.push(activity);
      //-------breach mapping---------
      if (bActivity.breaches) {
        bActivity.breaches.forEach((breach) => {
          const subBreach = new SubBreach(breachCounter, breach, activity);
          finalBreaches.push(subBreach);
          activity.addBreach(subBreach);
          breachCounter++;
        });
      }
    });

    return { finalActivities, finalBreaches };
  };

  const saveActivities = (fileName: string) => {
    saveActivitiesList(props.activities, fileName)
      .then((res) => {
        toast.success('File Saved Successfully');
      })
      .catch((er) => {
        toast.error('File Save Failed');
        console.log('save failed', er);
      });
  };

  return (
    <>
      <div className="d-flex">
        <Button variant="danger" onClick={showLoadActivities}>
          Load Activites
        </Button>
        <Button
          variant="info"
          onClick={() => {
            setTriggerSave((val) => !val);
          }}
        >
          Save Activites
        </Button>
      </div>
      <SaveActivityAsFileConfirmation trigger={triggerSave} onConfirmation={saveActivities} />
      <LoadActivityFileConfirmation trigger={triggerLoad} fileNames={fileNames} onConfirmation={loadActivities} />
    </>
  );
};
