import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'

function CardDescription({description}) {
    return (
        <Card variant="outlined" sx={{ width: '97.3%', height: '30rem', padding: '16px', backgroundColor: '#e8e6e6;'}}>
            <Typography variant="h6">
                Descripción del caso
            </Typography>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {
                        description ? description : 'No se encontro una descripción del caso' 
                    }
                </Typography>
            </CardContent>
        </Card>
    )
}

export default CardDescription