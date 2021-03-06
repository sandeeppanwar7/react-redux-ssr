import React from 'react';
import App from "../app/containers/App";
import { Home, Country } from "./splitcomponent";
import NotFound from "../app/containers/NotFound";

const routes = [
	{
		component: App,
		routes: [
			{
				path: "/",
				component: Home,
				exact: true,
			},
			{
				path: "/country/:name",
				component: Country,
				exact: true,
			},
			{
				component: NotFound
			}
		]
	}
];


export default routes;