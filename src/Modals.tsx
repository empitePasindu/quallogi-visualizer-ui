import { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';

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
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
