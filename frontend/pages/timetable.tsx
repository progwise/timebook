import { HourInput } from '../components/hourInput';
import { WeekSelector} from '../components/weekSelector';

const Timetable = () => {
  return (
    <div className="p-6 m-4 bg-white rounded-xl shadow-md space-y-3 ">
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
    </div>
  )
}

export default Timetable