import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { SaveActivityConfirmation } from './Modals';

export const SaveLoad = () => {
  const [triggerSave, setTriggerSave] = useState(true);

  const saveActivities = (fileName: string) => {
    console.log('saveActivites', fileName);
  };

  return (
    <>
      <div className="d-flex">
        <Button variant="danger" onClick={() => {}}>
          Load Activites
        </Button>
        <Button variant="info" onClick={() => {}}>
          Save Activites
        </Button>
      </div>
      <SaveActivityConfirmation trigger={triggerSave} onConfirmation={saveActivities} />
    </>
  );
};
