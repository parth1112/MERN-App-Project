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
            <NavigationItem link="/profile" exact >About</NavigationItem>
            <NavigationItem link="/profile/myposts">MyPosts</NavigationItem>
            <NavigationItem link="/profile/update">UpdateProfile</NavigationItem>
            { role === 'admin' && <NavigationItem link="/users">Users</NavigationItem> }
       </ul>  
    );
};

export default NavigationItems;