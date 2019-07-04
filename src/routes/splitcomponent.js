import React from 'react';
import Loadable from 'react-loadable';

export const Home = Loadable({
	loader: () => import( /* webpackChunkName: "Home" */ '../app/containers/Home'),
	loading() {
		return <div> Loading... </div>
	}
});

export const Country = Loadable({
	loader: () => import( /* webpackChunkName: "Country" */ '../app/containers/Country'),
	loading() {
		return <div> Loading... </div>
	}
});