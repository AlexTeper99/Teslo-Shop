import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces';
import { connect, disconnect } from '../../../database/db';
import { Product } from '../../../models';
import { db } from '../../../database';

type Data = 
| { message: string }
| IProduct[]
| IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    
    switch (req.method) {
        case 'GET':
            return getProducts( req, res );
            
        case 'PUT':
           // return updateProduct( req, res );

        case 'POST':
         //   return createProduct( req, res )
            
        default:
            return res.status(400).json({ message: 'Bad request' });
    }

    res.status(200).json({ message: 'Example' })
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();

    const products = await Product.find().sort().lean();

    await db . disconnect(); 


    //TODO: tendremos que actualizar las imagenes
}
