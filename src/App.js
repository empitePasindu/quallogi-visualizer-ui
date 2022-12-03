import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ActivityForm } from './ActivityForm';
function App() {
  return (
    // <div className="container" style={{ height: "100vh" }}>
    <div className="container">
      <div className="row">
        <ActivityForm />
      </div>
      <div className="row bg-border">
        <div className="col-4 bg-border">sas</div>
        <div className="col-8 bg-border">asas</div>
      </div>
    </div>
  );
}

export default App;
