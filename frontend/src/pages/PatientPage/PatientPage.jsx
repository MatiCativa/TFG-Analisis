import { Alert, Button, Card, Divider, Snackbar, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import CardImag from './CardImag';
import CardDescription from './CardDescription';
import { useNavigate } from 'react-router-dom';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import generatePDF from './CreatePDFtest';



const Patient = ({user}) => {
    const { id } = useParams();
    const [patientData, setPatientData] = useState([])
    const [openAlert, setOpenAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertTitle, setAlertTitle] = useState('');
    const navigate = useNavigate();


    const getPatientById = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/patient/api/v1/patients/${id}`, {
                headers: {
                    Authorization: `Token ${user.token.token}`
                },
            }); 
            setPatientData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/patient/api/v1/patients/${id}`, {
                headers: {
                    Authorization: `Token ${user.token.token}`
                },
            });

            if(response.status === 204) {
                setAlertSeverity("success")
                setOpenAlert(true);
                setAlertTitle("Paciente Eliminado")
                setTimeout(() => {
                    setOpenAlert(false)
                    navigate(`/home`);
                }, 3000);

            } else {
                setAlertSeverity("error")
                setAlertTitle('Error al Eliminar')
                setTimeout(() => {
                    setOpenAlert(false)
                }, 3000);
            }

        } catch (error) {
            setAlertSeverity("error")
            setAlertTitle(error.message)
            setTimeout(() => {
                setOpenAlert(false)
            }, 3000);
        }
    }

    useEffect(() => {
        getPatientById()
    }, [user])

    const handleNavigate = () => {
        navigate(`/patient-create/${id}`);
    };

    const handlePrintAnalysis = async () => {
        try {
            const pdfBytes = await generatePDF(patientData);
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `analisis-${patientData.last_name}.pdf`);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };

    const sendEmail = async () => {
        try {
            const pdfBinary = await generatePDF(patientData);
            const blob = new Blob([pdfBinary], { type: 'application/pdf' });

            const formData = new FormData();
            formData.append('pdf', blob);
            formData.append('recipientEmail', patientData.email); // Adjunta la dirección de correo del destinatario
        
            const response = await axios.post(`http://localhost:8000/patient/send_email/`, formData); // Realiza la solicitud HTTP al backend
            
            if(response.status === 200) {
                setAlertSeverity("success")
                setOpenAlert(true);
                setAlertTitle("Email enviado correctamente")
                setTimeout(() => {
                    setOpenAlert(false)
                }, 3000);

            } else {
                setAlertSeverity("error")
                setAlertTitle('Error al Eliminar')
                setTimeout(() => {
                    setOpenAlert(false)
                }, 3000);
            }
            
        } catch (error) {
            setAlertSeverity("error")
            setAlertTitle(error)
            setTimeout(() => {
                setOpenAlert(false)
            }, 3000);
        }
      };
      

    return (
        <Card 
            sx={{
                margin: '20px 20px 0px 20px',
                padding: '35px',
                backgroundColor: '#eeeeee',
                height: '39rem',
                display: 'flex',
                flexDirection: 'column',
            }}
        >   
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <Card variant="outlined" sx={{ width: '25%', height: '30rem', padding: '16px', backgroundColor: '#e8e6e6;'}}>
                    <Typography variant="h6">
                        Paciente {patientData.last_name}
                    </Typography>
                    <Divider variant="middle"/>
                    <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                            Género:
                        </Typography>
                        <Typography fontWeight={500}>{patientData.gender}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            DNI:
                        </Typography>
                        <Typography fontWeight={500}>{patientData.dni}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Edad:
                        </Typography>
                        <Typography fontWeight={500}>{patientData.age}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Obra Social:
                        </Typography>
                        <Typography fontWeight={500}>{patientData.social_security}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Email:
                        </Typography>
                        <Typography fontWeight={500}>{patientData.email}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Teléfono:
                        </Typography>
                        <Typography fontWeight={500}>{patientData.phone}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Dirección:
                        </Typography>
                        <Typography fontWeight={500}>{patientData.address}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Localidad:
                        </Typography>
                        <Typography fontWeight={500}>{patientData.city}</Typography>
                    </Stack>
                </Card>
                <CardImag date={patientData.date} img={patientData.image} report={patientData.report}/>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
                    <Button
                        variant="contained"
                        disabled={patientData.report ? false : true}
                        color="primary"
                        size="small"
                        sx={{ marginRight: '5px' }}
                        onClick={handlePrintAnalysis}
                    >
                        Descargar Análisis
                    </Button>
                    <Button
                        variant="contained"
                        disabled={patientData.report ? false : true}
                        color="primary"
                        size="small"
                        sx={{ marginRight: '5px' }}
                        onClick={sendEmail}
                    >
                        Enviar por email
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        sx={{ marginRight: '5px' }}
                        onClick={handleNavigate}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ marginRight: '5px' }}
                        onClick={() => deleteItem(patientData.id)}
                    >
                        Eliminar
                    </Button>  
                </div>
            </div>
            <CardDescription description={patientData.description} />
            <Snackbar open={openAlert}>
                <Alert severity={alertSeverity === 'success' ? 'success' : 'error'} sx={{ width: '35rem' }}>
                    {alertTitle ? alertTitle : ''}
                </Alert>
            </Snackbar>
        </Card>
    )
}

export default Patient