import React  from 'react';

import classes from './Navbar.module.css';
import NavigationItems from './NavigationItems/NavigationItems';

const Navbar = props => {

   return (
        <div className={classes.Navbar}>
           <nav className={classes.DesktopOnly}>
               <NavigationItems />
           </nav>
        </div>
  );
    
}

export default Navbar;
 