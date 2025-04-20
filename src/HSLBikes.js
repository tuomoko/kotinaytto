import { useQuery, gql } from '@apollo/client';
import { useSettings } from './SettingsContext';
import React from 'react';

const GET_BIKES = gql`
query GetBikes($ids: [String]!) {
  vehicleRentalStations(ids: $ids) {
    stationId
    name
    availableVehicles {
      byType {
        count
        vehicleType {
          formFactor
        }
      }
    }
    lat
    lon
    allowDropoff
    capacity
    }
  }
`

function DisplayBikes({ key: refreshKey }) {
    const {bikeRentalStations} = useSettings();
    const { loading, error, data, refetch } = useQuery(GET_BIKES, {variables: {ids: bikeRentalStations}});
    // Refetch data when refreshKey changes
    React.useEffect(() => {
      refetch();
  }, [refreshKey, refetch]);
    
    if (loading) return <p>Loading...</p>;
    if (error) {
        //console.log(error);
        return <p>Error :(</p>;
    }
    if (!data) return null;

    return data.vehicleRentalStations.map(({ stationId, name, availableVehicles, capacity }) => {
      // Filter available vehicles by formFactor (e.g., only "BICYCLE")
      const availableBicycles = availableVehicles.byType.filter(
          ({ vehicleType }) => vehicleType.formFactor === "BICYCLE"
      );

      const bikesAvailable = availableBicycles.reduce((sum, { count }) => sum + count, 0);

      return (
          <div key={stationId}>
              <p><b>{name}</b></p>
              <p>{bikesAvailable}/{capacity} pyörää saatavilla</p>
          </div>
      );
  });
  }

export default DisplayBikes;