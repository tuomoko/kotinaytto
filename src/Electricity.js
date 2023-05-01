// Use ElectricityPrice to get price data, make some calculations and show the results

import ElectricityPrice from "./ElectricityPrice";
import { useSettings } from './SettingsContext';
import { Table } from 'react-bootstrap'
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import moment from 'moment'

function Electricity() {
    const {electricityConfig} = useSettings();
    const prices = ElectricityPrice();
    const currentHour = moment().startOf('hour');
    const getPrice = price => (price * (1+electricityConfig.SPOT_TAX) + electricityConfig.TRANSFER_PRICE + electricityConfig.SPOT_MARGIN + electricityConfig.ELECTRICITY_TAX).toFixed(2)

    const rows = prices.slice(1).map((price, i) => (
      <tr key={i}>
        <td>
          {currentHour.add(1, 'hours').format('HH:mm')} 
        </td>
        <td>
          {getPrice(price)} c/kWh 
        </td>
      </tr>
    ))

    const tasks = electricityConfig.TASKS.map((task, i) => (
      <p key={task.NAME}>
        {task.NAME} ({task.ENERGY} kWh) maksaa {(task.ENERGY * getPrice(prices[0])/100).toFixed(2)} EUR. 
      </p>
    ))

    const popover = (
      <Popover id="popover-basic">
        <Popover.Header as="h3">Hinta</Popover.Header>
        <Popover.Body>
          <p>Pörssisähkö (ALV {electricityConfig.SPOT_TAX*100} %): {(prices[0]*(1+electricityConfig.SPOT_TAX)).toFixed(2)} c/kWh</p>
          <p>Marginaali: {electricityConfig.SPOT_MARGIN.toFixed(2)} c/kWh</p>
          <p>Siirto: {electricityConfig.TRANSFER_PRICE.toFixed(2)} c/kWh</p>
          <p>Vero: {electricityConfig.ELECTRICITY_TAX.toFixed(2)} c/kWh</p>
        </Popover.Body>
      </Popover>
    );

    return (

      <div>
          <p>Sähkön hinta nyt <OverlayTrigger trigger="focus" placement="bottom" overlay={popover}>
              <a tabIndex="0" role="button" className="link-primary">{getPrice(prices[0])} c/kWh.</a>
          </OverlayTrigger></p>
            
      {tasks.length > 0 ? tasks : ""}
      <p>Tulevien tuntien hinnat:</p>
      
      <Table>
      <tbody>
        {rows.length > 0
          ? rows
          : <tr><td className="text-center">Ei tietoja</td></tr>}
      </tbody>
    </Table>
    </div>
    );
  }

export default Electricity;

/* 
        
*/