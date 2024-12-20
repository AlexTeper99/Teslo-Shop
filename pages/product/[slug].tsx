import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { initialData } from '../../database/seed-data';
import { ItemCounter } from '../../components/ui/ItemCounter';
import { useRouter } from 'next/router';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { dbProducts } from '../../database';
import { useContext, useState } from 'react';
import { ICartProduct, IProduct, ISize } from '../../interfaces';
import { CartContext } from '../../context/cart/CartContext';

const product = initialData.products[0];

interface Props{
  product: IProduct;
}


const ProductPage:NextPage<Props> = ({product}) => {

  const router = useRouter();
  const {addProductToCart} = useContext(CartContext)

  //estado inicial.
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const selectedSize = (size: ISize) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      size: size
    }))
  }

  const onUpdateQuantity = (newQuantity: number) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      quantity: newQuantity
    }))
  }

  const onAddProduct = () => {

    if(!tempCartProduct.size){return};

    //llamar la accion del context para agregar al carrito
    addProductToCart(tempCartProduct);
     router.push('/cart')
  }

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description } imageFullUrl={ product.images[0] }>
    
      <Grid container spacing={3}>

        <Grid item xs={12} sm={ 7 }>
          <ProductSlideshow 
            images={ product.images }
          />
        </Grid>

        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column'>

            {/* titulos */}
            <Typography variant='h1' component='h1'>{ product.title }</Typography>
            <Typography variant='subtitle1' component='h2'>{ `$${product.price}` }</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter currentValue={tempCartProduct.quantity} maxValue={product.inStock > 5 ? 5 : product.inStock} updatedQuantity={onUpdateQuantity}
               />
              <SizeSelector 
                // selectedSize={ product.sizes[2] } 
                sizes={ product.sizes }
                selectedSize={tempCartProduct.size}
                onSelectedSize={(size) => selectedSize(size)}
              />
            </Box>


            {/* Agregar al carrito */}

            {
              (product.inStock > 0) 
              ? (
                <Button 
                  color="secondary" 
                  className='circular-btn'
                  onClick={onAddProduct}
                  >
                  {
                    (tempCartProduct.size) 
                    ? 'Agregar al carrito' 
                    : 'Seleccione una talla'
                  }
                </Button>
  
              )
              :
              (
                <Chip label="No hay disponibles" color="error" variant='outlined' /> 
              )
            }

            {/* Descripción */}
            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{ product.description }</Typography>
            </Box>

          </Box>
        </Grid>


      </Grid>

    </ShopLayout>
  )
}

// getServerSideProps 
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//* No usar esto.... SSR
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  
//   const { slug = '' } = params as { slug: string };
//   const product = await dbProducts.getProductBySlug( slug );

//   if ( !product ) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
  const productSlugs = await dbProducts.getAllProductSlugs();

  
  return {
    paths: productSlugs.map( ({ slug }) => ({
      params: {
        slug
      }
    })),
    fallback: 'blocking'
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  
  const { slug = '' } = params as { slug: string };
  const product = await dbProducts.getProductBySlug( slug );

  if ( !product ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24
  }
}




export default ProductPage