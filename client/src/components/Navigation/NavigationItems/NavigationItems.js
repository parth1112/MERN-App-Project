import React from 'react';
import { useSelector } from 'react-redux';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = ( props ) => {

 const role = useSelector(state => {
    return state.auth.role;   
 });

    return  (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" exact>Home</NavigationItem>
            {role && <NavigationItem link="/profile">MyProfile</NavigationItem> }
            {!role
                ? <NavigationItem link="/signin">SignIn</NavigationItem>
                : <NavigationItem link="/logout">Logout</NavigationItem>}
            {!role && <NavigationItem link="/signup">SignUp</NavigationItem> }
        </ul>
    );
};

export default NavigationItems;