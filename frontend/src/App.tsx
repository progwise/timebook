import React from 'react';
import './App.css';
import {FooterNavigation} from './components/footerNavigation';
import {MainNavigation} from './components/mainNavigation';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

export const App = () => {
    return (
        <>
            <BrowserRouter>
                <header>
                    <h1>time booking and invoicing services for developers</h1>
                    <MainNavigation></MainNavigation>
                </header>
                <main>
                    <h2>Main</h2>
                    <Switch>
                        <Route path="/timetable">
                            <p>
                                This is your time table
                            </p>
                        </Route>
                        <Route path="/projects">
                            <p>
                                Project list
                            </p>
                        </Route>
                        <Route path="/">
                            <p>
                                Welcome to time-book
                            </p>
                        </Route>
                    </Switch>
                </main>
                <footer>
                    <h3>Powered by progwise</h3>
                    <FooterNavigation></FooterNavigation>
                </footer>
            </BrowserRouter>
        </>
    )
}
