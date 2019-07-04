import React from 'react';
import { Link } from 'react-router-dom';

export default ({ name, flag, capital, population })  => {
  return (
    	<Link to={`/country/${name}`} className="countries-item">
      		<div className="countries-item-data">
        		<h4>{name}</h4>
        		<span>{capital}</span>
        		<span>{population} pop.</span>
      		</div>
    	</Link>
  	)
}