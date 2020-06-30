import React from 'react';

import appLogo from '../../assets/images/appLogo.png';
import classes from './Logo.module.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={appLogo} alt="MyLogo" />
    </div>
);

export default logo;