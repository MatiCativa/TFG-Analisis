import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Alert, AlertTitle, Button,
    CardActions,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Snackbar,
    TextField 
} from '@mui/material';
import axios from 'axios';
import img from '../../assets/img/Virus-bro.png';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

  

const LoginPage = ({dataFromLogin}) => {
    const [userLogin, setUserLogin] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate();



    const getUsername = (e) => {
        setUsername(e.target.value)
    }

    const getPassword = (e) => {
        setPassword(e.target.value)
    }

    const login = async () => {
        try {
            const data = new URLSearchParams();
            data.append('username', username);
            data.append('password', password);
                    
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            };
            const response = await axios.post('http://localhost:8000/patient/login/', data.toString(), config);
            setUserLogin({
                token: response.data,
                user: username,
            });
            
            setTimeout(() => {
                navigate('/home');
            }, 200)
             
        } catch (error) {
            setOpenAlert(true)
            setTimeout(() => {
                setOpenAlert(false)
            }, 3000);
        }
    }

    useEffect(() => {
        if (userLogin) {
            dataFromLogin(userLogin);
        }
      }, [userLogin, dataFromLogin]);

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

    return (
        <Card sx={{ maxWidth: 345, maxHeight: 2250 }} className='card-main' variant="outlined">
            <CardContent>
                <Typography  variant="h5" component="div">
                    Inicio de sesión
                </Typography>
                <CardMedia
                    component="img"
                    image={img}
                    alt="Image Login"
                    sx={{ maxWidth: 340, margin: 'auto'}} 
                />
                <CardContent>
                    <FormControl variant="outlined">
                        <TextField
                            id="outlined-basic"
                            label="Usuario"
                            className='text-input-login'
                            variant="outlined"
                            onChange={getUsername}
                        />
{/*                         <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
 */}                        <OutlinedInput
                                onChange={getPassword}
                                label="Contraseña"
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                    <CardActions>
                        <Button size="small" color="primary" variant="contained" className='button-login' onClick={login}>
                            Iniciar de Sesión
                        </Button>
                    </CardActions>
                </CardContent>
            </CardContent>
            <Typography variant="body2" color="text.secondary">
                • Para obtener una cuenta o si tiene algún problema, envíe un correo electrónico a analisis.machine.learning@gmail.com. 
            </Typography>
            <Snackbar open={openAlert}>
                <Alert severity="error" sx={{ width: '35rem' }}>
                    Usuario o Contraseña invalido
                </Alert>
            </Snackbar>
        </Card>
    )
}

export default LoginPage