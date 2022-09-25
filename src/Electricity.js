// Use ElectricityPrice to get price data, make some calculations and show the result

import ElectricityPrice from "./ElectricityPrice";
import { useSettings } from './SettingsContext';

function Electricity() {
    const {electricityConfig} = useSettings();
    const price = ElectricityPrice();
    return (
        <p>Sähkön hinta {price}</p>
    );
  }

export default Electricity;