import { useQuery, gql } from '@apollo/client';
import { useSettings } from './SettingsContext';

const GET_BIKES = gql`
query GetBikes($ids: [String]!) {
  bikeRentalStations(ids: $ids) {
    stationId
    name
    bikesAvailable
    spacesAvailable
    lat
    lon
    allowDropoff
    }
  }
`

function DisplayBikes() {
    const {bikeRentalStations} = useSettings();
    const { loading, error, data } = useQuery(GET_BIKES, {variables: {ids: bikeRentalStations}});
    if (loading) return <p>Loading...</p>;
    if (error) {
        //console.log(error);
        return <p>Error :(</p>;
    }
    if (!data) return null;

    return data.bikeRentalStations.map(({ stationId, name, bikesAvailable, spacesAvailable }) => (
    <div key={stationId}>
        <p><b>{name}</b></p>
        <p>{bikesAvailable}/{bikesAvailable+spacesAvailable} pyörää saatavilla</p>
    </div>
    ));
  }

export default DisplayBikes;