import React, { useContext } from "react";
import "./FoodDisplay.css";
import StoreContext from "../../context/StoreContext";
import Fooditem from "../FoodItem/Fooditem";
const FoodDisplay = ({category}) => {

  const {food_list} = useContext(StoreContext);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {food_list.map((item)=>{
          if (category==="All" || category===item.food_category) {
            return <Fooditem key={item._id} image={item.image} name={item.name} description={item.description} price={item.price} id={item._id}/>
          }
        })}
      </div>
    </div>
  )
}

export default FoodDisplay

