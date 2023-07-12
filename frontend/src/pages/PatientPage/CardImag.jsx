import { Card, CardContent, CardMedia, Divider, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


function CardImag({date, img, report}) {
    const formattedDate = date ? format(new Date(date), 'd MMMM yyyy', { locale: es }) : '';
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <Card variant="outlined" sx={{ width: '55%', height: '30rem', padding: '16px', backgroundColor: '#e8e6e6;'}}>
            <Typography variant="h6">
                Informe del {formattedDate}
            </Typography>
            <Divider variant="middle" sx={{marginBottom: '10px'}}/>
            <CardMedia
                component="img"
                image={img}
                alt="Muestra del paciente"
                sx={{ 
                    margin: 'auto',
                    objectFit: 'contain !important',
                    height: isHovered ? '28rem' : '22rem',
                    width: isHovered ? '47rem' : '37rem',
                    transition: 'all 0.3s ease',  
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            <Divider variant="middle" sx={{marginBottom: '10px', marginTop: '10px'}}/>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {
                        report ? report : 'No se encontro reporte del caso' 
                    }
                </Typography>
            </CardContent>
        </Card>         
    )
}

export default CardImag