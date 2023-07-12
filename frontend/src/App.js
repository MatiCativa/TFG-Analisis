import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage/LoginPage';
import PatientForm from './pages/PatientForm/PatientForm';
import PatientPage from './pages/PatientPage/PatientPage';
import Home from './pages/Home/Home';
import Landing from './pages/Landing/Landing';
import { ProtectedRoute } from './components/ProtectedRoute';
import PatientsPage from './pages/PatientsPage/PatientsPage';

function App() {
    const [user, setUser] = useState([]);

    const dataFromLogin = (data) => {
        console.log(data)
        setUser(data)
    }

    return (
        <BrowserRouter>
            <Navigation dataFromLogin={dataFromLogin} user={user}/>
            <Routes>
                <Route path='/' element={<Navigate to='/landing'/>} />
                <Route path='/landing' element={<Landing />} />
                <Route path='/login' element={<LoginPage dataFromLogin={dataFromLogin} />} />
                <Route path='/home' element={
                    <ProtectedRoute user={user}>
                        <Home user={user}/>
                    </ProtectedRoute>
                } />
                <Route path='/patient-create/:id?' element={<PatientForm user={user}/>} />
                <Route path='/patient/:id' element={<PatientPage user={user}/>} />
                <Route path='/patients' element={<PatientsPage user={user}/>} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
