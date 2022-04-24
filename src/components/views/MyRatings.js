import React, { useState, useEffect } from "react";
import { getMyRatings } from "../../api/api";
import { Rating } from 'primereact/rating';
import "../../css/views/MyRatings.css";

const MyRatings = () => {

    const[ratings, setRatings] = useState([]);
    
    useEffect(() => {
        getMyRatings().then((data) => setRatings(data));
    }, []);

    return (    
        <div className="allRates">
            {ratings.length === 0 ? (
                <p className="text"> Parece que aún no tienes valoraciones </p>
            ) 
            : 
            ratings.map(rating => (
            <div className="rate mb-2">
                <Rating value={rating.rate} readOnly stars={5} cancel={false} disabled />
                <p className="text">{rating.comment}</p>
            </div>
            ))
            }
        </div>
    )

}
export default MyRatings;