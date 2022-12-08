import { useRef, useState } from 'react';
import { Form } from 'react-bootstrap';

export default function FileImporter(props: { onDataReceived: (data: any) => void }) {
  const fileRef = useRef<any>();

  const onChangeFile = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const updatedJSON = e.target.files[0];
      console.log(updatedJSON);
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onloadend = (e) => {
        console.log('e.target.result', e.target);
        const target = e.target;
        const result = target?.result;
        console.log(result);
        if (result) props.onDataReceived(result);
        // };
      };
    }
  };

  return <Form.Control name="days" type="file" placeholder="select file" ref={fileRef} onChange={onChangeFile} />;
}
