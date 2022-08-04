import NextLink from 'next/link';
import { Box, Button, Grid, Link, TextField, Typography, Chip } from '@mui/material';
import { AuthLayout } from '../../components/layouts'
import { useForm } from 'react-hook-form';
import { tesloApi } from '../../api';
import { validations } from '../../utils';
import { useState } from 'react';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
    name    : string;
    email   : string;
    password: string;
};

const RegisterPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ showError, setShowError ] = useState(false);

    const onRegisterForm = async( {  name, email, password }: FormData ) => {
        //console.log({name, email, password})

        try{
            const {data} = await tesloApi.post('/user/register', {name, email, password})
            const {token, user} = data;
            console.log({token, user})
        }catch(error){
            console.log('error en las credenciales')
            setShowError(true);
            setTimeout((  ) => setShowError(false), 3000)
        }

        //todo: navegar a la pantalla que el usuario estaba
    }


  return (
    <AuthLayout title={'Ingresar'}>
        <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
            <Box sx={{ width: 350, padding:'10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component="h1">Crear cuenta</Typography>
                    </Grid>
                    <Chip 
                                    label="No puede usar ese correo"
                                    color="error"
                                    icon={ <ErrorOutline /> }
                                    className="fadeIn"
                                    sx={{ display: showError ? 'flex': 'none' }}
                                />

                    <Grid item xs={12}>
                        <TextField 
                            label="Nombre completo" 
                            variant="filled" 
                            fullWidth 
                            { ...register('name', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                        error={ !!errors.name }
                        helperText={ errors.name?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            type="email"
                            label="Correo" 
                            variant="filled" 
                            fullWidth 
                            { ...register('email', {
                                required: 'Este campo es requerido',
                                validate: validations.isEmail
                                
                            })}
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Contraseña" 
                            type='password'
                            variant="filled" 
                            fullWidth 
                            { ...register('password', {
                                required: 'Este campo es requerido',
                                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                            })}
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button color="secondary" className='circular-btn' size='large' fullWidth type="submit">
                            Ingresar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href="/auth/login" passHref>
                            <Link underline='always'>
                                ¿Ya tienes cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

export default RegisterPage