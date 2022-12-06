import { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAllSubBreaches, ISubBreach, SubBreach, SubBreachListItem } from '../models/BreachMapper';

export enum DeleteOption {
  moveAfterActivites,
  moveBeforeActivities,
}

export const DeleteActivityConfirmation = (props: { trigger: boolean; onConfirmation: (option: DeleteOption) => void }) => {
  const [show, setShow] = useState(false);
  const [deleteOption, setDeleteOption] = useState<DeleteOption>(DeleteOption.moveBeforeActivities);
  const prevStateRef = useRef(false);
  useEffect(() => {
    if (prevStateRef.current !== props.trigger) {
      handleShow();
      prevStateRef.current = props.trigger;
    }
  }, [props.trigger]);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex mt-2">
          <InputGroup>
            <Form.Check
              className="me-3"
              type="radio"
              label={'Move Before Activities Forward'}
              checked={deleteOption === DeleteOption.moveBeforeActivities}
              onChange={() => setDeleteOption(DeleteOption.moveBeforeActivities)}
            />

            <Form.Check
              className="me-3"
              type="radio"
              label={'Move After Activities Backward'}
              checked={deleteOption === DeleteOption.moveAfterActivites}
              onChange={() => setDeleteOption(DeleteOption.moveAfterActivites)}
            />
          </InputGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.onConfirmation(deleteOption);
            handleClose();
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const SaveActivityAsFileConfirmation = (props: { trigger: boolean; onConfirmation: (fileName: string) => void }) => {
  const [show, setShow] = useState(false);
  const [fileName, setFileName] = useState('');
  const prevStateRef = useRef(false);
  useEffect(() => {
    if (prevStateRef.current !== props.trigger) {
      handleShow();
      prevStateRef.current = props.trigger;
    }
  }, [props.trigger]);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Save Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container mt-2">
          <Form.Label>Enter file name</Form.Label>
          <Form.Control
            name="days"
            type="text"
            className={fileName === '' ? 'error' : ''}
            placeholder="file name"
            onChange={(e) => {
              setFileName(e.target.value);
            }}
            value={fileName}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.onConfirmation(fileName);
            handleClose();
          }}
          disabled={fileName.length === 0}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const LoadActivityFileConfirmation = (props: { fileNames: string[]; trigger: boolean; onConfirmation: (fileName: string) => void }) => {
  const [show, setShow] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const prevStateRef = useRef(false);
  useEffect(() => {
    if (prevStateRef.current !== props.trigger) {
      handleShow();
      prevStateRef.current = props.trigger;
    }
  }, [props.trigger]);

  useEffect(() => {
    setFileNames(props.fileNames);
    if (props.fileNames.length > 0) setSelectedFileName(props.fileNames[0]);
  }, [props.fileNames]);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Save Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container mt-2">
          <Form.Label>Enter file name</Form.Label>
          <Form.Select onChange={(e) => setSelectedFileName(e.target.value)}>
            {fileNames.map((file, index) => (
              <option value={file} key={index}>
                {file}
              </option>
            ))}
          </Form.Select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.onConfirmation(selectedFileName);
            handleClose();
          }}
          disabled={selectedFileName.length === 0}
        >
          Load
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const AddBreachDialog = (props: { trigger: boolean; onConfirmation: (subBreachListItem: ISubBreach) => void }) => {
  const [show, setShow] = useState(false);
  const [breachListItems, setBreachListItems] = useState<SubBreachListItem[]>(getAllSubBreaches());
  const [selectedSubBreachId, setSelectedSubBreachId] = useState<number>(breachListItems.length > 0 ? breachListItems[0].id : 0);
  const prevStateRef = useRef(false);
  useEffect(() => {
    if (prevStateRef.current !== props.trigger) {
      handleShow();
      prevStateRef.current = props.trigger;
    }
  }, [props.trigger]);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const getNhvrName = () => {
    const subBreachItem = breachListItems.find((sBreach) => sBreach.id === selectedSubBreachId);
    if (subBreachItem) return subBreachItem.subBreach.documentReference.name;
    return '';
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Save Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container mt-2">
          <div className="row flex-column">
            <Form.Label>Select Breach</Form.Label>
            <Form.Select onChange={(e) => setSelectedSubBreachId(Number(e.target.value))}>
              {breachListItems.map((sBreach, index) => (
                <option value={sBreach.id} key={index}>
                  {sBreach.subBreach.name}
                </option>
              ))}
            </Form.Select>
            <Form.Label className="mt-3">NHVR REF : {getNhvrName()}</Form.Label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            const subBreachItem = breachListItems.find((sBreach) => sBreach.id === selectedSubBreachId);
            if (subBreachItem) {
              props.onConfirmation(subBreachItem.subBreach);
              handleClose();
            } else {
              throw Error('SubBreachListItem id mapping invalid at AddBreachDialog');
            }
          }}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
