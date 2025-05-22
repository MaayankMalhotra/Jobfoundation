import React, { useState } from 'react';
import accountImage from '../assets/images/login-bg.jpg'
import logoLight from '../assets/images/logo-light.png'
const ImageAuth = () => {
    return(
        <div className='col-md-5'>
        <div className='sideAccountImage' style={{backgroundImage:`url(${accountImage})`}}>
            <img src={logoLight}/>
            <h2>Welcome back!</h2>
            <p>Log in to apply for jobs, track your applications, and receive personalized job recommendations.</p>
        </div>
    </div>
    )
}
export default ImageAuth