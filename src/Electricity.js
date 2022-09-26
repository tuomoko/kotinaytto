// Use ElectricityPrice to get price data, make some calculations and show the results

import ElectricityPrice from "./ElectricityPrice";
import { useSettings } from './SettingsContext';
import { Table } from 'react-bootstrap'
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
      <p>
        {task.NAME} ({task.ENERGY} kWh) maksaa {(task.ENERGY * getPrice(prices[0])/100).toFixed(2)} EUR. 
      </p>
    ))

    return (
      <div>
      <p>Sähkön hinta nyt {getPrice(prices[0])} c/kWh.</p>
      {tasks.length > 0 ? tasks : ""}
      <p>Tulevien tuntien hinnat:</p>
      <Table>
      <tbody>
        {rows.length > 0
          ? rows
          : <tr><td className="text-center">Ei lähtöjä</td></tr>}
      </tbody>
    </Table>
    </div>
    );
  }

export default Electricity;