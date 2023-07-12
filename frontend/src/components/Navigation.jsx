import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Button, Container, IconButton, Toolbar, Tooltip } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import LoginIcon from '@mui/icons-material/Login';

const Navigation = ({dataFromLogin, user}) => {
    const [userLogin, setUserLogin] = useState(null);

    const navigate = useNavigate();

    const logOut = () => {
        const updatedUser = {
            token: '',
            user: '',
          };
        
        setUserLogin(updatedUser);
        dataFromLogin(updatedUser);
        navigate(`/landing`)
    }

    const logIn = () => {
        navigate(`/login`)
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                    mr: 2,
                    //display: { xs: 'none', md: 'flex' },
                    display: 'flex',
                    alignItems: 'center',
                    //fontFamily: 'monospace',
                    fontWeight: 600,
                    letterSpacing: '.2rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    }}
                >
                    <TroubleshootIcon /> Análisis App
                </Typography>
           
          
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Button
                        component={Link}
                        to="home"
                        sx={{ my: 2, color: 'white', display: 'block' }}
                        disabled={user.token ? false : true}
                    >
                        Home
                    </Button>
                    <Button
                        component={Link}
                        to="patients"
                        sx={{ my: 2, color: 'white', display: 'block' }}
                        disabled={user.token ? false : true}
                    >
                        Pacientes
                    </Button>
                    <Button
                        component={Link}
                        to="patient-create"
                        sx={{ my: 2, color: 'white', display: 'block' }}
                        disabled={user.token ? false : true}
                    >
                        Nuevo Pacientes
                    </Button>
                    
                </Box>
                
                {user.token ? 
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Salir">
                            <IconButton sx={{ p: 0 }} onClick={() => logOut()}>
                                <Avatar sx={{ bgcolor:'#1a76d2'}}>
                                    <LogoutIcon />
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box> :
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Ingresar">
                            <IconButton sx={{ p: 0 }} onClick={() => logIn()}>
                                <Avatar sx={{ bgcolor:'#1a76d2'}}>
                                    <LoginIcon />
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
            </Toolbar>
        </Container>
    </AppBar>
    )
}

export default Navigation
