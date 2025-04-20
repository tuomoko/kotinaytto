import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';
import DisplayDepartures from './HSLDepartures';
import DisplayBikes from './HSLBikes';
import Electricity from './Electricity';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the key to trigger re-render
  };

  return (
    <div className="App">
      <button onClick={handleRefresh} style={{ margin: '10px', padding: '10px' }}>
        Päivitä
      </button>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Bussit ja Sporat</Accordion.Header>
          <Accordion.Body>
            <DisplayDepartures key={refreshKey} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Kaupunkipyörät</Accordion.Header>
          <Accordion.Body>
            <DisplayBikes key={refreshKey} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Sähkö</Accordion.Header>
          <Accordion.Body>
            <Electricity key={refreshKey} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default App;
