import React, { useState } from "react";
import { authenticate, isAuthenticated, adminLogin } from "./ApiCalls";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
const Login = () => {
	// initialize usehistory hook
	const history = new useHistory();
	// object state that holds the login details
	const [loginDetails, setLoginDetails] = useState({
		email: "",
		password: "",
	});
	const [checkBackend, setcheckBackend] = useState("");
	// state that holds the response error
	const [responseError, setResponseError] = useState("");
	// state that holds validation error
	const [validationErrorMsg, setValidationErrorMsg] = useState([]);

	// function that runs on each onChange event of input tag
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setLoginDetails((preVal) => {
			return { ...preVal, [name]: value };
		});
	};
	// function that runs when login form submited
	const loginAdmin = async (e) => {
		e.preventDefault();
		// calling the login function that calling the login API and passing the loggin credential to it
		const response = await adminLogin(loginDetails);
		if (response === undefined) {
			setcheckBackend("check backend conection is on");
			return;
		}
		if (response.status === "wrong pair") {
			setResponseError(response.message);
			setValidationErrorMsg(() => {
				return [];
			});
		}
		if (response.status === "validation error") {
			setValidationErrorMsg(() => {
				return response.error;
			});
			setResponseError();
		}
		// After successfully login
		if (response.status === "ok") {
			response.status = undefined;
			// calling the authenticate function which stores token and logged in user details into localstorage
			authenticate(response);
			// redirect to dash board page after successfully login
			history.push("/dashboard");
		}
	};
	// function to show error
	const ShowError = () => {
		// scrolling to top
		window.scrollTo(0, 0);
		return (
			<>
				{validationErrorMsg.map((data, index) => {
					return (
						<>
							<p key={index}>{data}</p>
						</>
					);
				})}
			</>
		);
	};

	return (
		<>
			{isAuthenticated() && <Redirect to="/dashboard" />}

			<div className="container h-100">
				<div className="row d-flex justify-content-center align-items-center h-100">
					<div className="col-lg-12 col-xl-11">
						<div className="card text-black">
							<div className="card-body p-md-5">
								<div className="row justify-content-center">
									<div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
										<p style={{ color: "red" }}>
											{validationErrorMsg.length > 0 ? (
												<ShowError />
											) : (
												responseError
											)}
										</p>

										<form className="mx-1 mx-md-4" onSubmit={loginAdmin}>
											<div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
												<div className="form-outline flex-fill mb-0">
													<label className="form-label">Your Email</label>
													<input
														type="email"
														className="form-control"
														name="email"
														value={loginDetails.email}
														onChange={handleChange}
													/>
												</div>
											</div>

											<div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-lock fa-lg me-3 fa-fw"></i>
												<div className="form-outline flex-fill mb-0">
													<label className="form-label">Password</label>
													<input
														type="password"
														className="form-control"
														name="password"
														value={loginDetails.password}
														onChange={handleChange}
													/>
												</div>
											</div>

											<div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
												<button
													type="submit"
													className="btn btn-primary btn-lg"
												>
													Login
												</button>
												<div id="registerLink">
													<Link to="/">Register Here</Link>
												</div>
											</div>
											<p style={{ color: "red" }}>{checkBackend}</p>
										</form>
									</div>
									<div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Login;
