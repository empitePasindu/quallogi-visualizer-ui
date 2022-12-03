import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';

type DatePickerProps = {
  name: any;
  value: any;
  onChange: any;
  disabled: any;
};
interface ActivityFormData {
  startDate: Date;
  days: number;
  hours: number;
  minutes: number;
  type: number;
}

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
      disabled={disabled}
      selected={(value && new Date(value)) || null}
      onChange={(val) => {
        onChange(name, val);
      }}
    />
  );
};

export const ActivityForm = (props: { disableDateEdit: boolean; onSubmit: (data: ActivityFormData) => void }) => {
  const onDataSubmit = (data: any) => {
    console.log('got data', data);
    props.onSubmit(data);
  };

  return (
    <Formik
      initialValues={{
        startDate: Date(),
        days: '',
        hours: '',
        minutes: '',
        type: 'work',
      }}
      onSubmit={onDataSubmit}
      validationSchema={validationSchema}
    >
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
                <Form.Control
                  name="days"
                  type="text"
                  className={'col ' + (touched.days && errors.days ? ' error' : '')}
                  placeholder="Days"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.days}
                />
                <Form.Control
                  name="hours"
                  type="text"
                  className={'col ' + (touched.hours && errors.hours ? ' error' : '')}
                  placeholder="Hours"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.hours}
                />
                <Form.Control
                  name="minutes"
                  type="text"
                  className={'col ' + (touched.minutes && errors.minutes ? ' error' : '')}
                  placeholder="Minutes"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.minutes}
                />
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
            <div className="col-sm-10 offset-sm-2">
              <Button
                variant="primary"
                className="btn btn-primary"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Add activity
              </Button>
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};