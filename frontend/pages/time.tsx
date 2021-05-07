import { HourInput } from '../components/hourInput';
import { WeekSelector} from '../components/weekSelector';

const Time = () => {
  return (
    <article>
      <h2>Your timetable</h2>
      <WeekSelector />
      <table className="w-full table-auto">
        <thead>
        <tr>
          <th>M</th>
          <th>T</th>
          <th>W</th>
          <th>Th</th>
          <th>F</th>
          <th>S</th>
          <th>Su</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td><HourInput></HourInput></td>
          <td><HourInput></HourInput></td>
          <td><HourInput></HourInput></td>
          <td><HourInput></HourInput></td>
          <td><HourInput></HourInput></td>
          <td><HourInput></HourInput></td>
          <td><HourInput></HourInput></td>
        </tr>
        </tbody>
      </table>
    </article>
  )
}

export default Time