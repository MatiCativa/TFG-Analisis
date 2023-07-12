import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { Alert, Snackbar, TableFooter, TablePagination, Tooltip } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function TablePatients({tableData, user}) {
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [page, setPage] = useState(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertTitle, setAlertTitle] = useState('');
    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const slicedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const goPatient = (id) => {
        navigate(`/patient/${id}`)
    }

    const goEdit = (id) => {
        navigate(`/patient-create/${id}`)
    }

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/patient/api/v1/patients/${id}`, {
                headers: {
                    Authorization: `Token ${user.token.token}`
                },
            });
            
            console.log(response);
            if(response.status === 204) {
                setOpenAlert(true);
                setAlertTitle("Paciente Eliminado")
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
            console.log(error)
            setAlertSeverity("error")
            setAlertTitle(error.message)
            setTimeout(() => {
                setOpenAlert(false)
            }, 3000);
        }
    }

    const dateFormatFuntion = (date) => {
        const dateFormat = format(new Date(date), 'dd/MM/yyyy', { locale: es });
        return dateFormat
    }

    const iconReport = (report) => {
        if(report) {
            return <CheckCircleOutlineIcon color="success"/>
        }else {
            return <BlockIcon color='error' />
        }
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ width: '85.7rem', marginLeft: '-29px' }}>
                <Table  aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="center">Nombre</TableCell>
                        <TableCell align="center">Apellido</TableCell>
                        <TableCell align="center">Fecha Nacimiento</TableCell>
                        <TableCell align="center">DNI</TableCell>
                        <TableCell align="center">Obra social</TableCell>
                        <TableCell align="center">Direccion</TableCell>
                        <TableCell align="center">Ciudad</TableCell>
                        <TableCell align="center">Genero</TableCell>
                        <TableCell align="center">Reporte</TableCell>
                        <TableCell align="center">Fecha Reporte</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {slicedData.map((t) => (
                        <TableRow
                            key={t.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >   
                            <TableCell align='center' sx={{width: '10%'}}>{t.name}</TableCell>
                            <TableCell align="center" sx={{width: '10%'}}>{t.last_name}</TableCell>
                            <TableCell align='center'>{dateFormatFuntion(t.birth_date)}</TableCell>
                            <TableCell align='center'>{t.dni}</TableCell>
                            <TableCell align="center" sx={{width: '10%'}}>{t.social_security}</TableCell>
                            <TableCell align='center'>{t.address}</TableCell>
                            <TableCell align='center'>{t.city}</TableCell>
                            <TableCell align='center'>{t.gender}</TableCell>
                            <TableCell align='center'>{iconReport(t.report)}</TableCell>
                            <TableCell align='center'>{dateFormatFuntion(t.date)}</TableCell>
                            <TableCell align="center" sx={{width: '12%'}}>
                                <Tooltip title="Ver">
                                    <IconButton
                                        aria-label="Ver"
                                        color="primary"
                                        fontSize="small"
                                        onClick={() => goPatient(t.id)}
                                    >
                                        <OpenInNewIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Editar">
                                    <IconButton
                                        aria-label="Editar"
                                        color="secondary"
                                        fontSize="small"
                                        onClick={() => goEdit(t.id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar">
                                    <IconButton
                                        onClick={() => deleteItem(t.id)}
                                        aria-label="Eliminar"
                                        color="error"
                                        fontSize="small"
                                    >
                                        <DeleteIcon /> 
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                        <TablePagination
                            colSpan={5}
                            count={tableData.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[4, 10]}
                            sx={{ justifyContent: 'center' }}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <Snackbar open={openAlert}>
                <Alert severity={alertSeverity === 'success' ? 'success' : 'error'} sx={{ width: '35rem' }}>
                    {alertTitle ? alertTitle : ''}
                </Alert>
            </Snackbar>
        </>
    )
}

export default TablePatients