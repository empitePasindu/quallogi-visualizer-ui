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
        <Modal.Title>Modal heading</Modal.Title>
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