import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import { Activity, ActivityType } from '../models/Activity';
import { useEffect, useState } from 'react';
import { dateToLocalDate, getDurationFromSeconds, nowTime } from '../utils/dateUtils';
import { AddActivityConfirmation, DeleteActivityConfirmation, MoveOption } from './Modals';
import { ActivityInputOptions } from '../App';

type DatePickerProps = {
  name: any;
  value: any;
  onChange: any;
  disabled: any;
};
export interface ActivityFormData {
  startDate: Date;
  days: number;
  hours: number;
  minutes: number;
  type: string;
}

const defaultFormData: ActivityFormData = {
  startDate: new Date(),
  days: 0,
  hours: 0,
  minutes: 0,
  type: 'work',
};

const validationSchema = Yup.object().shape({
  startDate: Yup.date(),
  days: Yup.number().min(0),
  hours: Yup.number().min(0),
  minutes: Yup.number().min(0),
  type: Yup.string(),
});

const DatePickerField = ({ name, value, onChange, disabled }: DatePickerProps) => {
  return (
    <DatePicker
      showTimeSelect
      dateFormat="Pp"
      disabled={disabled}
      selected={(value && new Date(value)) || null}
      onChange={(val) => {
        onChange(name, val);
      }}
    />
  );
};

export const ActivityForm = (props: {
  disableDateEdit: boolean;
  inputActivity: Activity | undefined;
  hasSelectedActivity: boolean;
  inputOptions: ActivityInputOptions;
  reset: boolean;
  onSubmit: (data: ActivityFormData, moveOption?: MoveOption) => void;
  onRemove: (moveOption: MoveOption) => void;
}) => {
  const [formData, setFormData] = useState<ActivityFormData>({ startDate: new Date(), days: 0, hours: 0, minutes: 0, type: 'work' });
  const [triggerAddConfirmation, setTriggerAddConfirmation] = useState(false);
  const [triggerDeleteConfirmation, setTriggerDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (props.inputActivity) {
      setFormData({ ...getDurationFromSeconds(props.inputActivity.duration), startDate: dateToLocalDate(props.inputActivity.startTime), type: props.inputActivity.type });
    } else {
      setFormData({ ...defaultFormData });
    }
  }, [props.inputActivity]);

  useEffect(() => {
    setFormData({ ...defaultFormData });
  }, [props.reset]);

  const onDataSubmit = (data: any) => {
    console.log('got data', data);
    setFormData(data);
    if (props.hasSelectedActivity) setTriggerAddConfirmation((val) => !val);
    else props.onSubmit(data);
  };

  /**when adding item when item is selected */
  const onAddAfterSelectionSubmit = (option: MoveOption) => {
    props.onSubmit(formData, option);
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={formData} onSubmit={onDataSubmit} validationSchema={validationSchema}>
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue, handleSubmit }) => (
          <Form>
            <Form.Group className="row mb-3">
              <Form.Label className="col-sm-2">Start Date</Form.Label>
              <div className="col-sm-10">
                <DatePickerField name="startDate" value={values.startDate} onChange={setFieldValue} disabled={props.disableDateEdit} />
              </div>
            </Form.Group>
            <Form.Group className="row mb-3">
              <Form.Label className="col-sm-2 col-form-label">Duration</Form.Label>
              <div className="col-sm-10">
                <div className="row">
                  <div className="col">
                    <div className="row w-100">
                      <div className="col-2">
                        <Form.Label>days</Form.Label>
                      </div>
                      <div className="col-10">
                        <Form.Control
                          name="days"
                          type="number"
                          className={touched.days && errors.days ? ' error' : ''}
                          placeholder="Days"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.days}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="row w-100">
                      <div className="col-2">
                        <Form.Label>Hours</Form.Label>
                      </div>
                      <div className="col-10">
                        <Form.Control
                          name="hours"
                          type="number"
                          className={touched.hours && errors.hours ? ' error' : ''}
                          placeholder="Hours"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.hours}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="row w-100">
                      <div className="col-2">
                        <Form.Label>Minutes</Form.Label>
                      </div>
                      <div className="col-10">
                        <Form.Control
                          name="minutes"
                          type="number"
                          className={touched.minutes && errors.minutes ? ' error' : ''}
                          placeholder="Minutes"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.minutes}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form.Group>
            <Form.Group className="row mb-3">
              <Form.Label className="col-sm-2">Type</Form.Label>
              <div className="col-sm-10">
                <Form.Select aria-label="Default select example" name="type" onChange={handleChange} onBlur={handleBlur} value={values.type}>
                  <option value="work">Work</option>
                  <option value="rest">Rest</option>
                </Form.Select>
              </div>
            </Form.Group>
            <Form.Group className="row mb-3">
              <div className="col d-flex offset-sm-2">
                <Button
                  variant="primary"
                  className="btn btn-primary me-2"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  {props.inputOptions.append ? 'Add Activity' : 'Modifiy Activity'}
                </Button>
                <Button variant="danger" onClick={() => setTriggerDeleteConfirmation((val) => !val)} disabled={!props.hasSelectedActivity || props.inputOptions.modify}>
                  Delete Activity
                </Button>
              </div>
            </Form.Group>
          </Form>
        )}
      </Formik>
      <AddActivityConfirmation trigger={triggerAddConfirmation} onConfirmation={onAddAfterSelectionSubmit} />
      <DeleteActivityConfirmation trigger={triggerDeleteConfirmation} onConfirmation={props.onRemove} />
    </>
  );
};
