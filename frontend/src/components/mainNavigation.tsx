import {Link} from 'react-router-dom';

export const MainNavigation = () => {
    return (<nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/timetable">Timesheet</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/invoices">Invoices</Link></li>
            <li><Link to="/settings">Settings</Link></li>
        </ul>
    </nav>)
}

