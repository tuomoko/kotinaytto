import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';
import DisplayDepartures from './HSLDepartures';
import DisplayBikes from './HSLBikes';
import Electricity from './Electricity';

function App() {
  return (
    <div className="App">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Bussit ja Sporat</Accordion.Header>
          <Accordion.Body>
            <DisplayDepartures />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Kaupunkipyörät</Accordion.Header>
          <Accordion.Body>
            <DisplayBikes />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Sähkö</Accordion.Header>
          <Accordion.Body>
            <Electricity />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default App;
