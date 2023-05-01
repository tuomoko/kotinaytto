import { useQuery, gql } from '@apollo/client';
import { useSettings } from './SettingsContext';
import { Table } from 'react-bootstrap'
import moment from 'moment'
import { FaRss } from 'react-icons/fa';



const GET_STOPS = gql`
query GetStops($ids: [String]!, $nstoptimes: Int!) {
  stops(ids: $ids) {
    gtfsId
    name
    lat
    lon
    stoptimesForPatterns(numberOfDepartures: $nstoptimes) {
        pattern {
          name
          headsign
          route {
            shortName
            desc
            mode
            agency {
              gtfsId
              name
            }
          }
        }
        stoptimes {
          realtime
          realtimeDeparture
          scheduledDeparture
          serviceDay
          stop {
            name
          }
        }
      }
    }
  }
`

function DisplayDepartures() {
    const formatTime = tstamp => moment.unix(tstamp).format('HH:mm')
    const {stops} = useSettings();
    const { loading, error, data } = useQuery(GET_STOPS, {variables: {ids: stops, nstoptimes: 2}});
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    if (!data) return null;

    const flattenDepartures = (acc, departure) =>
    acc.concat(
      departure.stoptimes.map(stoptime => ({
        stop: stoptime.stop.name,
        line: departure.pattern.route.shortName,
        headsign: departure.pattern.headsign,
        mode: departure.pattern.route.mode,
        time: stoptime.serviceDay + stoptime.realtimeDeparture,
        isRealtime: stoptime.realtime
      }))
    )

    const list = data.stops.reduce(
        (acc, stop) =>
        {
          if (stop)
            return acc.concat(stop.stoptimesForPatterns.reduce(flattenDepartures, []));
          else
            return acc;
        },
        []
    )
    list.sort((a, b) => a.time - b.time)
    const rows = list.map((departure, i) => (
        <tr key={i}>
          <td>
            {departure.line+" "+departure.headsign} 
          </td>
          <td>
            {departure.stop}
          </td>
          <td>
            {formatTime(departure.time)}
            {' '}
            {departure.isRealtime
              ? <FaRss />
              : ''}
          </td>
        </tr>
      ))
      return (<Table>
      <tbody>
        {rows.length > 0
          ? rows
          : <tr><td className="text-center">Ei lähtöjä</td></tr>}
      </tbody>
    </Table>)
  }

export default DisplayDepartures;