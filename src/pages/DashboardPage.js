import React from 'react';
import Sidebar from './Dashboard/Global/Sidebar';
import Topbar from './Dashboard/Global/Topbar';
import './DashboardPage.scss';
import { Link } from 'react-router-dom';
import { ColorModeContext, useMode } from '../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Components/Dashboard/Dashboard'
import Team from './Dashboard/Components/Team/Team';
import Contacts from './Dashboard/Components/Contacts/Contacts';
import Invoices from './Dashboard/Components/Invoices/Invoices';
import Bar from './Dashboard/Components/Bar/Bar';
import Form from './Dashboard/Components/Form/Form';
import Line from './Dashboard/Components/Line/Line';
import Pie from './Dashboard/Components/Pie/Pie';
import FAQ from './Dashboard/Components/Faq/Faq';
import Geography from './Dashboard/Components/Geography/Geography';
import Calendar from './Dashboard/Components/Calendar/Calendar';

const DashboardPage = () => {
    const [theme, colorMode] = useMode();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className='dashboard-background'>
                    <Sidebar />
                    <main className='content'>
                        <Topbar />
                        <Routes>
                            <Route path='/' element={<Dashboard />} />
                            <Route path='/team' element={<Team />} />
                            <Route path='/contacts' element={<Contacts />} />
                            <Route path='/invoices' element={<Invoices />} />
                            <Route path='/form' element={<Form />} />
                            <Route path='/calendar' element={<Calendar />} />
                            <Route path='/faq' element={<FAQ />} />
                            <Route path='/bar' element={<Bar />} />
                            <Route path='/pie' element={<Pie />} />
                            <Route path='/line' element={<Line />} />
                            <Route path='/geography' element={<Geography />} />
                            
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default DashboardPage;