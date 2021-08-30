import React, { useState, useEffect } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";
import { BounceLoader } from "react-spinners";

import {
	createProduct,
	deleteProduct,
	fetchProduct,
	isAuthenticated,
	signout,
	searchProduct,
} from "./ApiCalls";

const Dashboard = () => {
	// state to toggle modal
	const [modal, setModal] = useState(false);
	const [spinner, setSpinner] = useState(true);
	const [tottalNumberOfRecord, settottalNumberOfRecord] = useState();
	// object state that holds employess input data
	const [productData, setProductData] = useState({
		productname: "",
		price: "",
		description: "",
	});
	// state to holds validation error of employee registration
	const [validationError, setValidationError] = useState([]);
	// state that contains employees that are previously exist in db;
	const [productFromDb, setProductFromDb] = useState([]);
	const [searchResult, setSearchResult] = useState([]);
	const [toggleSearch, setToggleSearch] = useState(false);
	// initializing useHostory hook
	const history = useHistory();
	// signout method for manager
	const signoutManager = () => {
		// calling the signout method which calling the signout API
		signout();
		// redirect to login after successfully signout
		history.push("/login");
	};

	// function that collects all employees that that are existed in db;
	const getProductData = async (limit, offset) => {
		console.log(offset);
		// checking if token and user info available in localstorage
		if (localStorage.getItem("mbjwt")) {
			// destructure user and token from localstorage
			const { user, token } = JSON.parse(localStorage.getItem("mbjwt"));
			// calling the Fectch product API
			const response = await fetchProduct(user._id, token, offset, limit);
			console.log(response);
			if (response.status === "ok") {
				setProductFromDb(() => {
					return response.product;
				});
				settottalNumberOfRecord(response.totalRecord);
				setSpinner(false);
			} else {
				setProductFromDb(() => {
					return [];
				});
			}
			if (response.status === 401) {
				signout();
				history.push("/login");
			}
			if (response.status === "user not found") {
				signout();
				history.push("/login");
			}
		}
	};
	// useEffect hook to call the getEmployeeData function which calling the fetchEmployee API
	useEffect(() => {
		getProductData(3, 0);
	}, []);
	// function that handles the onchange event of all the input tag of add employee form
	const inputChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setProductData((preVal) => {
			return {
				...preVal,
				[name]: value,
			};
		});
	};
	// function to call the add product APi
	const addProduct = async (e) => {
		e.preventDefault();
		// checking the token and user info exist in localstorage
		if (localStorage.getItem("mbjwt")) {
			// destructure the token and user from localstorage
			const { user, token } = JSON.parse(localStorage.getItem("mbjwt"));
			// calling the create Employee Api
			const response = await createProduct(user._id, token, productData);

			if (response.status === "validation error") {
				setValidationError(() => {
					return response.error;
				});
			} else {
				setValidationError(() => {
					return [];
				});
			}
			if (response.status === "ok") {
				setModal(false);
				getProductData(3, 0);
				setProductData(() => {
					return {
						firstname: "",
						lastname: "",
						address: "",
						dob: "",
						mobile: "",
						city: "",
					};
				});
			}
		}
	};

	// function to show error
	const ShowValidationError = () => {
		return (
			<>
				{validationError.length > 0 &&
					validationError.map((error, ind) => {
						return (
							<>
								<p style={{ color: "red" }}>{error}</p>
							</>
						);
					})}
			</>
		);
	};
	// function to toogle modal state value
	const toggleModal = () => {
		setModal(() => {
			return true;
		});
	};
	// function to delete Employee
	const productDelete = async (productId) => {
		let check = window.confirm("Are you sure to delete");
		if (check) {
			// checking the token and user info exist in localstorage
			if (localStorage.getItem("mbjwt")) {
				// destructure the token and user from localstorage
				const { user, token } = JSON.parse(localStorage.getItem("mbjwt"));
				// calling the delete Employee API
				await deleteProduct(user._id, token, productId);
				setSearchResult(() => {
					return [];
				});
				getProductData(3, 0);
			}
		}
	};
	// function to close modal
	const closeModal = () => {
		setModal(false);
	};
	const handleSeacrh = async (e) => {
		const searchTerm = e.target.value;
		console.log(searchTerm);
		if (searchTerm.length > 0) {
			// checking the token and user info exist in localstorage
			if (localStorage.getItem("mbjwt")) {
				// destructure the token and user from localstorage
				const { user, token } = JSON.parse(localStorage.getItem("mbjwt"));
				// calling the delete Employee API
				let response = await searchProduct(user._id, token, searchTerm);
				console.log(response);
				if (response.status === "ok") {
					setSearchResult(() => {
						return response.product;
					});
				} else {
					setSearchResult(() => {
						return [];
					});
				}

				setToggleSearch(() => {
					return true;
				});
			}
		} else {
			getProductData(3, 0);
		}
	};

	const paginateCal = (pageNo) => {
		let offset = (parseInt(pageNo) - 1) * 3;

		getProductData(3, offset);
	};

	const Pagination = () => {
		let totalPages = Math.ceil(tottalNumberOfRecord / 3);
		var arr = [];
		for (var i = 0; i < totalPages; i++) {
			arr[i] = i;
		}

		return (
			<>
				<div id="paginationContainer">
					{arr.map((number, index) => {
						return (
							<>
								<button
									onClick={() => {
										paginateCal(number + 1);
									}}
								>
									{number + 1}
								</button>
							</>
						);
					})}
				</div>
			</>
		);
	};
	const ShowSearchResult = () => {
		return (
			<>
				{searchResult.length > 0 ? (
					searchResult.map((product, index) => {
						return (
							<tr>
								<td>{product.id}</td>
								<td>{product.productname}</td>
								<td>{product.price}</td>
								<td>{product.description}</td>
								<td>{product.addedBy}</td>
								<td>{product.createdAt}</td>
								<td>{product.updatedAt}</td>

								<td>
									<button
										id="deleteBtn"
										onClick={() => {
											productDelete(product._id);
										}}
									>
										Delete
									</button>

									<Link
										exact
										to={{
											pathname: `/dashboard/employee/update/${product._id}`,
										}}
									>
										update
									</Link>
								</td>
							</tr>
						);
					})
				) : (
					<p>no result found</p>
				)}
			</>
		);
	};
	return (
		<>
			{!isAuthenticated() && <Redirect to="/login" />}
			<div className="dashboard-menu">
				<button className="btn btn-danger" onClick={signoutManager}>
					Logout
				</button>
				<button className="btn btn-success " onClick={toggleModal}>
					Add Product
				</button>
				<form id="searchForm">
					<input type="text" placeholder="search" onChange={handleSeacrh} />
				</form>
			</div>
			{modal && (
				<div id="modal">
					<div id="modal-form">
						<div id="closeBtn" onClick={closeModal}>
							X
						</div>
						<h2>Product Create Form</h2>
						<form id="emp-update-form" onSubmit={addProduct}>
							<div>
								<lable>Enter product name</lable>
								<input
									type="text"
									name="productname"
									value={productData.productname}
									onChange={inputChange}
								/>
							</div>

							<div>
								<lable>Enter Price </lable>
								<input
									onChange={inputChange}
									type="number"
									name="price"
									value={productData.price}
								/>
							</div>
							<div>
								<lable>Enter Description </lable>
								<textarea
									onChange={inputChange}
									name="description"
									value={productData.description}
								></textarea>
							</div>

							<button type="submit">Create Product</button>
							<ShowValidationError />
						</form>
					</div>
				</div>
			)}
			<table className="table">
				<thead className="thead-dark">
					<tr>
						<th scope="col">Product ID</th>
						<th scope="col">Product Name</th>
						<th scope="col">Price</th>
						<th scope="col">Description</th>
						<th scope="col">Added By</th>
						<th scope="col">Created_At</th>
						<th scope="col">Updated_At</th>
					</tr>
				</thead>
				<tbody>
					{toggleSearch === true ? (
						<ShowSearchResult />
					) : (
						productFromDb.map((product, index) => {
							return (
								<tr>
									<td>{product.id}</td>
									<td>{product.productname}</td>
									<td>{product.price}</td>
									<td>{product.description}</td>
									<td>{product.addedBy}</td>
									<td>{product.createdAt}</td>
									<td>{product.updatedAt}</td>

									<td>
										<button
											id="deleteBtn"
											onClick={() => {
												productDelete(product._id);
											}}
										>
											Delete
										</button>

										<Link
											exact
											to={{
												pathname: `/dashboard/employee/update/${product._id}`,
											}}
										>
											update
										</Link>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>

			<div>{searchResult.length > 0 ? "" : <Pagination />}</div>
			<BounceLoader loading={spinner} />
		</>
	);
};
export default Dashboard;
