import { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Navbar, SideMenu } from '../ui';


interface Props {
    title: string;
    pageDescription: string;
    imageFullUrl?: string;
}

export const ShopLayout:FC<Props> = ({ children, title, pageDescription, imageFullUrl }) => {
    const { asPath} = useRouter();
    //   console.log(process.env.NEXT_PUBLIC_LINK + asPath)
    //{console.log("https://tesloshop-alex.herokuapp.com/" + asPath)}
    return (
    <>
        <Head>
            <title>{ title }</title>

            <meta name="description" content={ pageDescription } />
            
            <meta name="og:title" content={ title } />
            <meta name="og:description" content={ pageDescription } />
            <meta property="og:url" content={process.env.NEXT_PUBLIC_LINK + asPath}/>
            <meta property="og:type" content="article" />
            <meta property="og:locale" content="es_ES" />
            {
                imageFullUrl && (
                    <meta name="og:image" content={ imageFullUrl } />
                )
            }

        </Head> 

        <nav>
            <Navbar />
        </nav>

        <SideMenu />

        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>
            { children }
        </main>

        {/* Footer */}
        <footer>
            {/* TODO: mi custom footer */}
        </footer>

    </>
  )
}


