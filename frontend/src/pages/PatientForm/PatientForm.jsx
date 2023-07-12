import { Alert, Button, Card, CardMedia, Divider, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const PatientForm = ({user}) => {
    const { id } = useParams();
    const [data, setData] = useState({});

    const [openAlert, setOpenAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertTitle, setAlertTitle] = useState('');

    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const getPatientById = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/patient/api/v1/patients/${id}`, {
                headers: {
                    Authorization: `Token ${user.token.token}`
                },
            }); 
            setData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(id) {
            getPatientById()
        }
    },[id])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        const formData = new FormData();
        formData.append('image', file);
        console.log(formData)
        setData((prevData) => ({ ...prevData, image: file }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
      
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });
        
        if (id) {
            try {
                await axios.patch(`http://localhost:8000/patient/api/v1/patients/${id}/`, formData, {
                    headers: {
                        Authorization: `Token ${user.token.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setOpenAlert(true);
                setAlertSeverity('success')
                setAlertTitle(`El Paciente ${data.name} ha sido actualizado correctamente.`)
                setTimeout(() => {
                    setOpenAlert(false)
                }, 5000);

            } catch (error) {
                setAlertTitle(`Hubo un error al actualizar el paciente ${data.name}`)
                setAlertSeverity('error')
                setTimeout(() => {
                    setOpenAlert(false)
                }, 6000);
            }

        } else {
            try {
                const response = await axios.post(`http://localhost:8000/patient/api/v1/patients/`, formData, {
                headers: {
                    Authorization: `Token ${user.token.token}`,
                    'Content-Type': 'multipart/form-data',
                },
                });

                setAlertSeverity('success')
                setOpenAlert(true);
                setAlertTitle(`El Paciente ${response.data.name} ha sido creado correctamente.`)
                setTimeout(() => {
                    setOpenAlert(false)
                    navigate(`/patient/${response.data.id}`)
                }, 5000);

            } catch (error) {
                setAlertTitle(`Hubo un error al crear el paciente ${error.message}`)
                setAlertSeverity('error')
                setOpenAlert(true)

                setTimeout(() => {
                    setOpenAlert(false)
                }, 6000);
            }
        }
    };

    const cancel = () => {
        navigate(`/home`)
    }

    return (
        <Card
            sx={{
                margin: '20px 20px 0px 20px',
                padding: '35px',
                backgroundColor: '#eeeeee',
                height: '40rem',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
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
                    {id ? `Editar Paciente ${data.name} ${data.last_name} ` : 'Nuevo Paciente'}
            </Typography>
            <Divider style={{marginBottom:'10px'}}/>
            <form 
                 //onSubmit={handleSubmit}
            >
                <Grid container>
                    <Grid item xs={3}>
                        <TextField
                            sx={{width: '90%', margin: '7px'}}
                            name="name"
                            label="Nombre"
                            variant="outlined"
                            value={data.name || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            sx={{width: '90%', margin: '7px'}}
                            name="last_name"
                            label="Apellido"
                            variant="outlined"
                            value={data.last_name || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            sx={{width: '90%', margin: '7px'}}
                            name="dni"
                            label="DNI"
                            variant="outlined"
                            type="number"
                            value={data.dni || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            sx={{width: '90%', margin: '7px'}}
                            name="social_security"
                            label="Obra Social"
                            variant="outlined"
                            type="text"
                            value={data.social_security || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Divider variant="middle" style={{marginBottom:'10px', width: '80%'}}/>
                <Grid container alignItems="end">
                    <Grid item xs={4}>
                        <InputLabel id="gender-label">Género</InputLabel>
                        <Select
                            sx={{width: '92%', margin: '7px'}}
                            labelId="gender-label"
                            name='gender'
                            id="gender-select"
                            value={data.gender || ''}
                            onChange={handleChange}
                            label="Género"
                        >
                            <MenuItem value="masculino">Masculino</MenuItem>
                            <MenuItem value="femenino">Femenino</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={4}>
                        <InputLabel id="date-label">Fecha de nacimiento</InputLabel>
                        <TextField
                            sx={{width: '92%', margin: '7px'}}
                            name="birth_date"
                            variant="outlined"
                            type="date"
                            value={data.birth_date || ''}
                            onChange={handleChange}  
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            sx={{width: '92%', margin: '7px'}}
                            name="age"
                            label="Edad"
                            variant="outlined"
                            type="number"
                            value={data.age || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Divider variant="middle" style={{marginBottom:'10px', width: '80%'}}/>
                <Grid container>
                    <Grid item xs={3}>
                        <TextField
                            sx={{width: '90%', margin: '7px'}}
                            name="email"
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={data.email || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            sx={{width: '90%', margin: '7px'}}
                            name="phone"
                            label="Telefono"
                            variant="outlined"
                            type="tel"
                            value={data.phone || ''}
                            onChange={handleChange}  
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            sx={{width: '90%', margin: '7px'}}
                            name="address"
                            label="Dirección"
                            variant="outlined"
                            type="text"
                            value={data.address || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            sx={{width: '90%', margin: '7px'}}
                            name="city"
                            label="Ciudad"
                            variant="outlined"
                            type="text"
                            value={data.city || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Divider variant="middle" style={{marginBottom:'10px', width: '80%'}}/>
                <Grid container>
                    <Grid item xs={6}>
                        <TextField
                            sx={{width: '95%', margin: '7px'}}
                            name="description"
                            label="Descripción medica"
                            variant="outlined"
                            type="text"
                            multiline
                            rows={4}
                            value={data.description || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {id ?  
                            <TextField
                                sx={{width: '95%', margin: '7px'}}
                                name="report"
                                //label="Reporte"
                                variant="outlined"
                                type="text"
                                multiline
                                rows={4}
                                value={data.report || ''}
                                onChange={handleChange}
                            />   :
                            <Typography variant="body1" gutterBottom>
                                El reporte se generará automáticamente. Puedes editarlo si no estás de acuerdo.
                            </Typography>
                        }
                    </Grid>
                    <Divider variant="middle" style={{marginBottom:'10px', width: '80%'}}/>
                </Grid>
                <Grid container alignItems="center">
                    {id ?
                        <Grid xs={6} sx={{marginBottom: '10px'}}>
                            <CardMedia
                                component="img"
                                height="194"
                                image={data.image}
                                alt="Muestra del paciente"
                                sx={{ 
                                    margin: 'auto',
                                    objectFit: 'unset'
                                }}
                                /> 
                        </Grid> : 
                        <Grid xs={6}>
                            <InputLabel id="image-label">Cargar Imagen</InputLabel>
                            <TextField
                                sx={{width: '95%', margin: '10px'}}
                                type="file"
                                name="image"
                                variant="outlined"
                                onChange={handleImageChange}
                                id="imageInput"
                            />
                        </Grid>
                    }
                    <Grid
                        xs={6}
                        container
                        direction={id ? 'column' : ''}
                        justifyContent={id ? 'flex-start' : ''}
                        alignContent={id ? 'center' : ''}
                    >
                        <Button 
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{marginBottom: id ? '30px' : '', marginRight: id ? '' : '5px' }}
                            onClick={handleUpdate}
                        >
                            {id ? 'Actualizar Paciente' : 'Nuevo Paciente'} 
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{marginBottom: id ? '30px' : '', marginRight: id ? '' : '5px' }}
                            onClick={() => cancel()}
                        >
                            Cancelar
                        </Button> 
                    </Grid>
                </Grid>
            </form>
            <Snackbar open={openAlert}>
                <Alert severity={alertSeverity === 'success' ? 'success' : 'error'} sx={{ width: '35rem' }}>
                    {alertTitle ? alertTitle : ''}
                </Alert>
            </Snackbar>
        </Card>
    )
}

export default PatientForm;


