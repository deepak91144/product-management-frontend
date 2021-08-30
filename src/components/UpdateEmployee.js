import React, { useState, useEffect } from "react";
import { Redirect, useParams, Link } from "react-router-dom";
import { getAnProduct, isAuthenticated, productUpdate } from "./ApiCalls";

const UpdateEmployee = () => {
	var x = {};
	const { productId } = useParams();
	const [res, setRes] = useState("");
	useEffect(() => {
		let fetchAnEmployee = async () => {
			if (localStorage.getItem("mbjwt")) {
				const { user, token } = JSON.parse(localStorage.getItem("mbjwt"));
				const response = await getAnProduct(productId, user._id, token);

				x.productname = response.product.productname;
				x.price = response.product.price;
				x.description = response.product.description;
			}
		};
		fetchAnEmployee();
	});
	const [productData, setProductData] = useState(x);

	const inputChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setProductData((preValue) => {
			return { ...preValue, [name]: value };
		});
	};
	const updateProduct = async (e) => {
		e.preventDefault();
		if (localStorage.getItem("mbjwt")) {
			const { user, token } = JSON.parse(localStorage.getItem("mbjwt"));
			const response = await productUpdate(
				productId,
				user._id,
				token,
				productData
			);
			console.log(response);
			if (response.status === "ok") {
				setRes(response.message);
			}
		}
	};
	return (
		<>
			{!isAuthenticated() && <Redirect to="/login" />}
			<div>
				<h2>Update Product</h2>
				<form id="emp-update-form" onSubmit={updateProduct}>
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
						<lable>Enter last name </lable>
						<input
							onChange={inputChange}
							type="number"
							name="price"
							value={productData.price}
						/>
					</div>
					<div>
						<lable>Enter Address</lable>
						<textarea
							onChange={inputChange}
							name="description"
							value={productData.description}
						></textarea>
					</div>
					<button style={{ margin: "10px" }} type="submit">
						Update Product
					</button>{" "}
					<Link to="/dashboard">Go To Dashboard</Link>
					<p style={{ color: "green" }}>{res !== "" ? res : ""}</p>
				</form>
			</div>
		</>
	);
};
export default UpdateEmployee;
