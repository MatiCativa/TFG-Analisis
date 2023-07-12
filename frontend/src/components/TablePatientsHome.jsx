import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Snackbar, TableFooter, TablePagination, Tooltip } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function TablePatientsHome({tableData, user}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
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

    return (
        <>
            <TableContainer component={Paper} sx={{ width: '45rem' }}>
                <Table  aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="center">Nombre</TableCell>
                        <TableCell align="center">Apellido</TableCell>
                        <TableCell align="center">Obra social</TableCell>
                        <TableCell align="center">DNI</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {slicedData.map((t) => (
                        <TableRow
                            key={t.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align='center' sx={{width: '21%'}}>{t.name}</TableCell>  
                            <TableCell align="center" sx={{width: '21%'}}>{t.last_name}</TableCell>
                            <TableCell align="center" sx={{width: '21%'}}>{t.social_security}</TableCell>
                            <TableCell align="center">{t.dni}</TableCell>
                            <TableCell align="center">
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
                                rowsPerPageOptions={[5, 10]}
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

export default TablePatientsHome