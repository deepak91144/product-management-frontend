import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import adminRegister, { authenticate, isAuthenticated } from "./ApiCalls";
import { useHistory } from "react-router-dom";

const Register = () => {
	const history = useHistory();
	// object state to hold all the input values
	const [data, setData] = useState({
		username: "",
		email: "",
		password: "",
	});
	// state to check backend connection
	const [checkBackend, setcheckBackend] = useState("");
	// state to hold the error response
	const [responseError, setResponseError] = useState([]);
	// state to hold the error if the email previously exist in db
	const [emailExist, setEmailExist] = useState("");
	// funtion to handle the input event of all input
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setData((preVal) => {
			return {
				...preVal,
				[name]: value,
			};
		});
	};

	// function runs when registration form submited
	const registerAdmin = async (e) => {
		e.preventDefault();
		// calling the function which calls the ragister API and passing employee details
		const response = await adminRegister(data);
		if (response === undefined) {
			setcheckBackend("check bacned server running or not");
			return;
		}
		// working with various condition of response
		if (response.status === "validation error") {
			setResponseError(() => {
				return [response.error];
			});
			setEmailExist("");
		}
		if (response.status === "email exist") {
			setEmailExist(response.message);
			setResponseError(() => {
				return [];
			});
		}
		// if employee regisred successfully
		if (response.status === "ok") {
			response.status = undefined;
			response.message = undefined;
			// calling the authenticate function with store the token and user info into local storage
			authenticate(response);
			// redirect the the dashboard page once employee successfully signed up
			history.push("/dashboard");
		}
	};
	const ShowError = () => {
		// scrolling to the top of page to show errors
		window.scrollTo(0, 0);
		// convert array to string to print on screes
		const ans = responseError.join(",");
		return <>{ans}</>;
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
											{responseError.length > 0 ? <ShowError /> : emailExist}
										</p>
										<h3 id="registerHeading">Admin Register Form</h3>
										<form className="mx-1 mx-md-4" onSubmit={registerAdmin}>
											<div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-user fa-lg me-3 fa-fw"></i>

												<div className="form-outline flex-fill mb-0">
													<label className="form-label">Enter Admin Name</label>
													<input
														type="text"
														className="form-control"
														name="username"
														value={data.username}
														onChange={handleChange}
													/>
												</div>
											</div>

											<div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
												<div className="form-outline flex-fill mb-0">
													<label className="form-label">Your Email</label>
													<input
														type="email"
														className="form-control"
														name="email"
														value={data.email}
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
														value={data.password}
														onChange={handleChange}
													/>
												</div>
											</div>

											<div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
												<button
													type="submit"
													className="btn btn-primary btn-lg"
												>
													Register
												</button>
												<div id="loginHere">
													<Link to="/login"> Login Here</Link>
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
export default Register;
