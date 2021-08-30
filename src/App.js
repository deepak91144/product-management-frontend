import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import { Switch, Route, Redirect } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./components/Dashboard";
import UpdateEmployee from "./components/UpdateEmployee";
import Error from "./components/Error";
function App() {
	return (
		<>
			<Switch>
				<Route exact path="/" component={Register} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/dashboard" component={Dashboard} />

				<Route
					exact
					path="/dashboard/employee/update/:productId"
					component={UpdateEmployee}
				/>
				<Redirect to="/" />
			</Switch>
		</>
	);
}

export default App;
