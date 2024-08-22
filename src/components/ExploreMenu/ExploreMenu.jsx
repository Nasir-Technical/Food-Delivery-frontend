import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
   return (
      <div className='explore-menu' id='explore-menu'>
         <h1>Explore our menu</h1>
         <p className='explore-menu-text'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto tempore aut distinctio provident. Eveniet quos saepe ipsa quidem modi explicabo ex quis hic reiciendis accusantium, dicta sunt dolores voluptate consequuntur.
         </p>
         <div className="explore-menu-list">
            {menu_list.map((item) => (
               <div 
                  key={item.menu_name}
                  onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
                  className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
               >
                  <img src={item.menu_image} alt={item.menu_name} />
                  <p>{item.menu_name}</p>
               </div>
            ))}
         </div>
         <hr />
      </div>
   );
};

export default ExploreMenu;
