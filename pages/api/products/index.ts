import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { Product } from '../../../models'
import { IProduct } from '../../../interfaces/products';

type Data = 
  | {message: string} 
  | IProduct[]


export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch( req.method ) {
        case 'GET':
            return getProducts( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
    
}

//acceso desde postman: http://localhost:3000/api/products?gender=women
async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {

    const { gender = 'all' } = req.query; //por defeto es all y sino req.query

    let condition = {}; //declaro la variable

    if ( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ) { 
        condition = { gender };
    }   
    

    await db.connect();
    const products = await Product.find(condition)
                                .select('title images price inStock slug -_id')
                                .lean();

    await db.disconnect();

    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}products/${ image }`
        });

        return product;
    })



    return res.status(200).json( updatedProducts );
}
