import React, { useState } from 'react';

import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';


const Layout = props  => {

  const [sideDrawerIsVisble, setSideDrawerIsVisble] = useState(false);

    const sideDrawerClosedHandler = () => {
      setSideDrawerIsVisble(false);
    
    };

  const sideDrawerToggleHandler = () => {
      setSideDrawerIsVisble(!sideDrawerIsVisble);
    };

 
      return (
        <React.Fragment>
          <Toolbar
            drawerToggleClicked={sideDrawerToggleHandler}/>
            <SideDrawer 
             open={sideDrawerIsVisble} 
             closed={sideDrawerClosedHandler}/>
          <main className={classes.Content}>
            {props.children}
         </main>
       </React.Fragment>  
      );
};

export default Layout;

