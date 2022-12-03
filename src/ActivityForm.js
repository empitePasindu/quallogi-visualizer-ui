import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerField = ({ name, value, onChange }) => {
  return (
    <DatePicker
      selected={(value && new Date(value)) || null}
      onChange={(val) => {
        onChange(name, val);
      }}
    />
  );
};

export const ActivityForm = () => {
  const onDataSubmit = (data) => {
    console.log('got data', data);
  };

  return (
    <Formik initialValues={{ startDate: Date(), days: '', hours: '', minutes: '', type: 'work' }} onSubmit={onDataSubmit} validator={() => ({})}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form>
          <Form.Group className="row mb-3">
            <Form.Label className="col-sm-2">Start Date</Form.Label>
            <div className="col-sm-10">
              <DatePickerField name="startDate" value={values.startDate} onChange={setFieldValue} />
            </div>
          </Form.Group>
          <Form.Group className="row mb-3">
            <Form.Label className="col-sm-2 col-form-label">Duration</Form.Label>
            <div className="col-sm-10">
              <div className="row">
                <Form.Control name="days" type="text" className="col" placeholder="Days" onChange={handleChange} onBlur={handleBlur} value={values.days} />
                <Form.Control name="hours" type="text" className="col" placeholder="Hours" onChange={handleChange} onBlur={handleBlur} value={values.hours} />
                <Form.Control name="minutes" type="text" className="col" placeholder="Minutes" onChange={handleChange} onBlur={handleBlur} value={values.minutes} />
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
              <Button variant="primary" className="btn btn-primary" onClick={handleSubmit}>
                Add activity
              </Button>
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};
