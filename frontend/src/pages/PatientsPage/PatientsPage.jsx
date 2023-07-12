import React, { useEffect, useState } from 'react'
import { Card, CardContent, Divider, FormHelperText, IconButton, InputBase, MenuItem, Paper, Select, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import TablePatients from '../../components/TablePatients'
import axios from 'axios';

function PatientsPage({user}) {
    const [tableData, setTableData] = useState([]);
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [socialSecurityFilter, setSocialSecurityFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [ageFilter, setAgeFilter] = useState('');



    const getPatients = async () => {
        try {
          const response = await axios.get('http://localhost:8000/patient/api/v1/patients/', {
            headers: {
              Authorization: `Token ${user.token.token}`
            },
        });
            console.log(response.data)
            setTableData(response.data)
        } catch (error) {
          console.error(error);
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

    const handleCityFilterChange = (event) => {
        setCityFilter(event.target.value);
    }

    const handleAgeFilterChange = (event) => {
        setAgeFilter(event.target.value)
    }

    const genderOptions = [...new Set(tableData.map((t) => t.gender))];
    const socialSecurityOptions = [...new Set(tableData.map((t) => t.social_security))];
    const cityOptions = [...new Set(tableData.map((t) => t.city))];
    const ageOptions = [...new Set(tableData.map((t) => t.age))];


    const filteredData = tableData.filter((t) => {
        if (genderFilter && t.gender !== genderFilter) {
            return false;
        }

        if (socialSecurityFilter && t.social_security !== socialSecurityFilter) {
            return false;
        }

        if(cityFilter && t.city !== cityFilter) {
            return false
        }

        if(ageFilter && t.age !== ageFilter) {
            return false
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
                Lista de Pacientes
            </Typography>
            <Divider variant="middle" />

            <CardContent sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around', marginTop: '-4%'}}>
                <div style={{display: 'flex', flexDirection: 'row',alignItems: 'flex-end', justifyContent: 'space-evenly', width: '100%'}}>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 450, height: '3.3rem' }}
                        >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Nombre, Apellido o DNI"
                            inputProps={{ 'aria-label': 'buscar paciente' }}
                            value={search} onChange={searchData}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="buscar">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    <div style={{display: 'flex', flexDirection: 'row', height: '100%', width: '100%', marginTop: '58px',justifyContent: 'space-evenly'}}>
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
                        <div>
                            <FormHelperText>
                                Filtrar por ciudad:
                            </FormHelperText>
                            <Select
                                id="city-filter"
                                value={cityFilter}
                                onChange={handleCityFilterChange}
                                sx={{ width: '12rem' }}
                            >
                            <MenuItem value="">
                                Todas
                            </MenuItem>
                            {cityOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                            </Select>
                        </div>
                        <div>
                            <FormHelperText>
                                Filtrar por edad:
                            </FormHelperText>
                            <Select
                                id="age-filter"
                                value={ageFilter}
                                onChange={handleAgeFilterChange}
                                sx={{ width: '12rem' }}
                            >
                            <MenuItem value="">
                                Todas
                            </MenuItem>
                            {ageOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                            </Select>
                        </div>
                    </div>
                </div>
            </CardContent>
            <TablePatients tableData={filteredData} user={user} />
        </Card>
    )
}

export default PatientsPage