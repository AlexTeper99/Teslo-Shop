import { AddBox, AttachMoneyOutlined, CancelPresentationOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Grid, CardContent, Typography, Card } from '@mui/material';
import React from 'react'
import useSWR from 'swr';
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts'
import { DashboardSummaryResponse } from '../../interfaces';
import { useState, useEffect } from 'react';

export const DashboardPage = () => {
    
    const {data, error} = useSWR<DashboardSummaryResponse>('/api/admin/dashboard',{
        refreshInterval: 30 * 1000
    })

    const [refreshIn, setRefreshIn] = useState(30)


    useEffect(() => {
      const interval = setInterval( () => {
        console.log('Tick')
        setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1: 30)
      }, 1000)
    
      return () => clearInterval(interval)
     
    }, [])
    

    if( !error && !data){
        return <></>
    }

    if(error){
        console.log(error)
        return <Typography>Error al cargar la informacion</Typography>
    }

    const {
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders
    } = data!;
  return (
    <AdminLayout
        title={'Dashboard'}
        subTitle={'Estadisticas generales'}
        icon={<DashboardOutlined/>}
    >
        <Grid container spacing={2}>
            
            <SummaryTile 
                title={numberOfOrders} 
                subTitle={'Ordenes totales'} 
                icon={<CreditCardOutlined color='secondary' sx={{fontSize:40}}/>} 
            />
            

            <SummaryTile 
                title={paidOrders} 
                subTitle={'Ordenes pagadas'} 
                icon={<AttachMoneyOutlined sx={{fontSize: 40}} color="success" /> }
            />

            <SummaryTile 
                title={notPaidOrders} 
                subTitle={'Ordenes pendientes'} 
                icon={<CreditCardOffOutlined sx={{fontSize: 40}} color="error" /> }
            />

            <SummaryTile 
                title={numberOfClients} 
                subTitle={'Clientes'} 
                icon={<GroupOutlined sx={{fontSize: 40}} color="success" /> }
            />

            <SummaryTile 
                title={numberOfProducts} 
                subTitle={'Productos'} 
                icon={<CategoryOutlined sx={{fontSize: 40}} color="success" /> }
            />

            <SummaryTile 
                title={productsWithNoInventory} 
                subTitle={'Sin existencias'} 
                icon={<CancelPresentationOutlined sx={{fontSize: 40}} color="error" /> }
            />

            <SummaryTile 
                title={lowInventory} 
                subTitle={'Bajo inventario'} 
                icon={<ProductionQuantityLimitsOutlined sx={{fontSize: 40}} color="warning" /> }
            />

            <SummaryTile 
                title={refreshIn} 
                subTitle={'Actualizacion en:'} 
                icon={<AccessTimeOutlined sx={{fontSize: 40}} color="secondary" /> }
            />


            

        </Grid>


    </AdminLayout>

    
  )
}

export default DashboardPage