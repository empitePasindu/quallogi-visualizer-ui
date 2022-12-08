import { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAllSubBreaches, ISubBreach, SubBreach, SubBreachListItem } from '../models/BreachMapper';
import { Severity } from '../models/RuleBreachCounter';
import { getActivityListMetaData } from '../services/FatigueApi';
import FileImporter from './FileImporter';

export enum MoveOption {
  moveAfterActivites,
  moveBeforeActivities,
}
export const DeleteActivityConfirmation = (props: { trigger: boolean; onConfirmation: (option: MoveOption) => void }) => {
  const [show, setShow] = useState(false);
  const [deleteOption, setDeleteOption] = useState<MoveOption>(MoveOption.moveBeforeActivities);
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
              checked={deleteOption === MoveOption.moveBeforeActivities}
              onChange={() => setDeleteOption(MoveOption.moveBeforeActivities)}
            />

            <Form.Check
              className="me-3"
              type="radio"
              label={'Move After Activities Backward'}
              checked={deleteOption === MoveOption.moveAfterActivites}
              onChange={() => setDeleteOption(MoveOption.moveAfterActivites)}
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

export const AddActivityConfirmation = (props: { trigger: boolean; onConfirmation: (option: MoveOption) => void }) => {
  const [show, setShow] = useState(false);
  const [moveOption, setMoveOption] = useState<MoveOption>(MoveOption.moveBeforeActivities);
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
        <Modal.Title>Add Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex mt-2">
          <InputGroup>
            <Form.Check
              className="me-3"
              type="radio"
              label={'Move Backward'}
              checked={moveOption === MoveOption.moveBeforeActivities}
              onChange={() => setMoveOption(MoveOption.moveBeforeActivities)}
            />

            <Form.Check
              className="me-3"
              type="radio"
              label={'Move Forward'}
              checked={moveOption === MoveOption.moveAfterActivites}
              onChange={() => setMoveOption(MoveOption.moveAfterActivites)}
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
            props.onConfirmation(moveOption);
            handleClose();
          }}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export type SaveActivitiesMetaData = {
  fileName: string;
  description?: string;
  subBreachName?: string;
};

export const SaveActivityAsFileConfirmation = (props: { trigger: boolean; onConfirmation: (metaData: SaveActivitiesMetaData, download?: boolean) => void }) => {
  const [show, setShow] = useState(false);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [subBreachName, setSubBreachName] = useState<string>();
  const [breachListItems, setBreachListItems] = useState<SubBreachListItem[]>(getAllSubBreaches());

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
        <Form>
          <Form.Group className="mb-3">
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
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe activity list's test scenario"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tested Breach</Form.Label>
            <Form.Select onChange={(e) => setSubBreachName(e.target.value)}>
              <option value={''} key={10}>
                None
              </option>
              {breachListItems.map((sBreach, index) => (
                <option value={sBreach.subBreach.name} key={index}>
                  {sBreach.subBreach.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.onConfirmation({
              fileName: fileName,
              description: description !== '' ? description : undefined,
              subBreachName: subBreachName !== '' ? subBreachName : undefined,
            });
            handleClose();
          }}
          disabled={fileName.length === 0}
        >
          Save
        </Button>
        <Button
          variant="info"
          onClick={() => {
            props.onConfirmation(
              {
                fileName: fileName,
                description: description !== '' ? description : undefined,
                subBreachName: subBreachName !== '' ? subBreachName : undefined,
              },
              true,
            );
            handleClose();
          }}
          disabled={fileName.length === 0}
        >
          Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const LoadActivityFileConfirmation = (props: { fileNames: string[]; trigger: boolean; onConfirmation: (fileName: string) => void; onDataUpload: (data: any) => void }) => {
  const [show, setShow] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [metaData, setMetaData] = useState<{ subBreachName?: string; description?: string }>();
  const [uploadFileSelected, setUploadFileSelected] = useState(false);
  const prevStateRef = useRef(false);
  useEffect(() => {
    if (prevStateRef.current !== props.trigger) {
      handleShow();
      prevStateRef.current = props.trigger;
      setUploadFileSelected(false);
    }
  }, [props.trigger]);

  useEffect(() => {
    setFileNames(props.fileNames);
    if (props.fileNames.length > 0) setSelectedFileName(props.fileNames[0]);
  }, [props.fileNames]);

  useEffect(() => {
    if (selectedFileName && selectedFileName.length !== 0) {
      getActivityListMetaData(selectedFileName)
        .then((data) => {
          setMetaData(data);
          console.log('metaData', data);
        })
        .catch((e) => console.log('failed to get metadata by fileName', selectedFileName, e));
    }
  }, [selectedFileName]);

  const onDataUpload = (data: any) => {
    try {
      const jsonData = JSON.parse(data);
      setMetaData({ description: jsonData.description, subBreachName: jsonData.subBreachName });
      props.onDataUpload(jsonData);
      setUploadFileSelected(true);
    } catch (e) {
      setUploadFileSelected(false);
      console.log('file upload error', e);
      toast.error('file parsing failed');
    }
  };
  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Save Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Upload File</Form.Label>
            <FileImporter onDataReceived={onDataUpload} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Select file name</Form.Label>
            <Form.Select onChange={(e) => setSelectedFileName(e.target.value)}>
              {fileNames.map((file, index) => (
                <option value={file} key={index}>
                  {file}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="col-4">Sub Breach</Form.Label>
            <Form.Text className="col">{metaData?.subBreachName}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="col-4">description</Form.Label>
            <Form.Text className="col">{metaData?.description}</Form.Text>
          </Form.Group>
        </Form>
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
          disabled={selectedFileName.length === 0 || uploadFileSelected}
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
  const [severity, setSeverity] = useState<Severity>(Severity.minor);

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
  const getBreachDescription = () => {
    const subBreachItem = breachListItems.find((sBreach) => sBreach.id === selectedSubBreachId);
    if (subBreachItem) return subBreachItem.subBreach.description;
    return '';
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Save Expected Breach</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container mt-2">
          <div className="row row-cols-2">
            <Form.Label className="col-4">Select Breach</Form.Label>
            <div className="col">
              <Form.Select onChange={(e) => setSelectedSubBreachId(Number(e.target.value))}>
                {breachListItems.map((sBreach, index) => (
                  <option value={sBreach.id} key={index}>
                    {sBreach.subBreach.name}
                  </option>
                ))}
              </Form.Select>
            </div>
            <Form.Label className="col-4">Severity</Form.Label>
            <div className="col">
              <InputGroup>
                <Form.Check
                  radioGroup="severity-group"
                  className="me-3"
                  type="radio"
                  label={Severity.getKeyByValue(Severity.minor) as string}
                  checked={severity === Severity.minor}
                  onChange={() => setSeverity(Severity.minor)}
                />
                <Form.Check
                  radioGroup="severity-group"
                  className="me-3"
                  type="radio"
                  label={Severity.getKeyByValue(Severity.substantial) as string}
                  checked={severity === Severity.substantial}
                  onChange={() => setSeverity(Severity.substantial)}
                />
                <Form.Check
                  radioGroup="severity-group"
                  className="me-3"
                  type="radio"
                  label={Severity.getKeyByValue(Severity.severe) as string}
                  checked={severity === Severity.severe}
                  onChange={() => setSeverity(Severity.severe)}
                />
                <Form.Check
                  radioGroup="severity-group"
                  className="me-3"
                  type="radio"
                  label={Severity.getKeyByValue(Severity.critical) as string}
                  checked={severity === Severity.critical}
                  onChange={() => setSeverity(Severity.critical)}
                />
              </InputGroup>
            </div>
            <Form.Label className="col-4">NHVR REF</Form.Label>
            <Form.Text className="col">{getNhvrName()}</Form.Text>
            <Form.Label className="col-4">Description</Form.Label>
            <Form.Text className="col">{getBreachDescription()}</Form.Text>
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
              subBreachItem.subBreach.severity = severity;
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
