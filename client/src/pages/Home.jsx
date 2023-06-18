import { useState } from 'react';
import Header from '../components/Header';

function Home(){
    return(
        <div>
            <Header/>
            {window.name}
            {window.email}
            {window.password}
        </div>
    )
}

export default Home;