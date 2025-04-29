// top 3 leaderboard & countdown to trip date

import { useContext } from "react"; 
import UserContext from "../UserContext"
import './Banner.css';

const Banner = () => {
    const [user] = useContext(UserContext);

    return(
        <div className="banner">
        <h5><em>{user && user.name ? user.name : 'Anonymous'}</em> is logged in</h5>
        </div>
    )
}; 

export default Banner; 