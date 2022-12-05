import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Activity, IBaseActivity } from './Activity';
import { dateToEpoch } from './dateUtils';
import { LoadActivityFileConfirmation, SaveActivityAsFileConfirmation } from './Modals';
import { getActivityFileNames, getActivityList, saveActivitiesList } from './service/FatigueApi';

export const SaveLoad = (props: { triggerReset: boolean; activities: IBaseActivity[]; onActivitesLoaded: (activities: Activity[]) => void }) => {
  const [triggerSave, setTriggerSave] = useState(false);
  const [triggerLoad, setTriggerLoad] = useState(false);
  /**activity list file names */
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const resetPrevRef = useRef(false);

  useEffect(() => {
    if (resetPrevRef.current !== props.triggerReset) {
      setSelectedFileName('');
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
        props.onActivitesLoaded(mapBaseActivities(baseActivities));
        toast.success('Load Activities success');
        setSelectedFileName(fileName);
      })
      .catch((error) => {
        toast.error('Load Activities Failed');
        console.log(error);
      });
  };

  const mapBaseActivities = (baseActivities: IBaseActivity[]): Activity[] => {
    //add epochTime(=startTimeS) variable and sort list using it
    const sortedBaseActivities = baseActivities.map((act) => ({ ...act, startTimeS: dateToEpoch(act.startTime) })).sort((a, b) => a.startTimeS - b.startTimeS);
    const lastActivityIndex = baseActivities.length - 1;

    return sortedBaseActivities.map((bActivity, index) => {
      if (index < lastActivityIndex) {
        if (!sortedBaseActivities[index + 1]) console.log('invalid activity at ', index + 1);
        return Activity.withEndTime(index, bActivity.startTime, bActivity.type, sortedBaseActivities[index + 1].startTime);
      } else {
        return Activity.asLastActivity(index, bActivity.startTime, bActivity.type);
      }
    });
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
