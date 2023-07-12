import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, Divider, FormHelperText, IconButton, InputBase, MenuItem, Paper, Select, Snackbar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import TablePatientsHome from '../../components/TablePatientsHome';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home({user}) {
    const [tableData, setTableData] = useState([]);
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [socialSecurityFilter, setSocialSecurityFilter] = useState('');
    const [openAlert, setOpenAlert] = useState(false);

    const navigate = useNavigate();


    const getPatients = async () => {
        try {
          const response = await axios.get('http://localhost:8000/patient/api/v1/patients/', {
            headers: {
              Authorization: `Token ${user.token.token}`
            },
        });
          setTableData(response.data)
        } catch (error) {
            setOpenAlert(true)
            setTimeout(() => {
                setOpenAlert(false)
            }, 6000);
        }
    };

    const searchData = (event) => {
        setSearch(event.target.value);
    };

    const handleGenderFilterChange = (event) => {
        setGenderFilter(event.target.value);
      };
    
    const handleSocialSecurityFilterChange = (event) => {
        setSocialSecurityFilter(event.target.value);
      };

    const genderOptions = [...new Set(tableData.map((t) => t.gender))];
    const socialSecurityOptions = [...new Set(tableData.map((t) => t.social_security))];

    const filteredData = tableData.filter((t) => {
        if (genderFilter && t.gender !== genderFilter) {
            return false;
        }
        if (socialSecurityFilter && t.social_security !== socialSecurityFilter) {
            return false;
        }
        if (
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.last_name.toLowerCase().includes(search.toLowerCase())
            || t.dni.toLowerCase().includes(search.toLowerCase())

        ) {
            return true;
        }
            return false;
    });
    
    useEffect(() => {
        getPatients();
    }, [user])

    const goNewPatient = () => {
        navigate(`/patient-create/`)
    }

    const goPatient = () => {
        navigate(`/patients`)
    }

    const goLanding = () => {
        navigate(`/landing`)
    }

    return (
        <Card sx={{margin: '20px', padding: '35px', backgroundColor: '#eeeeee', height: '35rem'}}>
            <Typography 
                variant="h5"
                sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 500,
                    textDecoration: 'none',
                }}
                gutterBottom
                >
                Bienvenido de nuevo ! 
            </Typography>
            <Divider variant="middle" />

            <CardContent sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around'}}>
                <div className='filter-container'>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 450, height: '3.3rem' }}
                        >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Buscar Paciente Por Nombre o Apellido"
                            inputProps={{ 'aria-label': 'buscar paciente' }}
                            value={search} onChange={searchData}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="buscar">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    <div className='select-container'>
                        <div>
                            <FormHelperText>
                                Filtrar por género:
                            </FormHelperText>
                            <Select
                                id="gender-filter"
                                value={genderFilter}
                                onChange={handleGenderFilterChange}
                                sx={{ width: '12rem' }}
                            >
                            <MenuItem value="">
                                Todos
                            </MenuItem>
                            {genderOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                            </Select>
                        </div>
                        <div>
                            <FormHelperText>
                                Filtrar por obra social:
                            </FormHelperText>
                            <Select
                                id="social-security-filter"
                                value={socialSecurityFilter}
                                onChange={handleSocialSecurityFilterChange}
                                sx={{ width: '12rem' }}
                            >
                            <MenuItem value="">
                                Todas
                            </MenuItem>
                            {socialSecurityOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                            </Select>
                        </div>
                    </div>
                    <div className='button-container'>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ marginRight: '5px' }}
                            onClick={() => goNewPatient()}

                        >
                            Nuevo Análisis
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{ marginRight: '5px' }}
                            onClick={() => goPatient()}
                        >
                            Lista Detallada
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => goLanding()}
                        >
                            Cerrar sesión
                        </Button>
                    </div>
                </div>
                <TablePatientsHome tableData={filteredData} user={user} />
            </CardContent>
            <Divider>
                <FiberManualRecordIcon />
            </Divider>
            <Snackbar open={openAlert}>
                <Alert severity="error" sx={{ width: '35rem' }}>
                    Error al cargar los pacientes
                </Alert>
            </Snackbar>
        </Card>
    )
}

export default Home