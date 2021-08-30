const API = "http://localhost:5000/api";
const adminRegister = (admin) => {
	return fetch(`${API}/admin/register`, {
		method: "post",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(admin),
	})
		.then((res) => {
			return res.json();
		})
		.catch((error) => {
			console.log(error);
		});
};
export const adminLogin = (loginDtails) => {
	return fetch(`${API}/admin/login`, {
		method: "post",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(loginDtails),
	})
		.then((res) => {
			return res.json();
		})
		.catch((error) => {
			console.log(error);
		});
};
export const authenticate = (data) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("mbjwt", JSON.stringify(data));
	}
};

export const signout = (next) => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("mbjwt");
		// next();
		return fetch(`${API}/signout`, {
			method: "GET",
		})
			.then((response) => {
				console.log("sigout successfull");
			})
			.catch((error) => {
				console.log(error);
			});
	}
};
export const isAuthenticated = () => {
	if (typeof window == "undefined") {
		return false;
	}
	if (localStorage.getItem("mbjwt")) {
		return JSON.parse(localStorage.getItem("mbjwt"));
	} else {
		return false;
	}
};

// create new employee
export const createProduct = (adminId, token, productData) => {
	return fetch(`${API}/product/add/${adminId}`, {
		method: "post",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(productData),
	})
		.then((Response) => {
			return Response.json();
		})
		.catch((error) => {
			console.log(error);
		});
};

// fetch all employee
export const fetchProduct = (adminId, token, offSet, limit) => {
	return fetch(`${API}/product/${offSet}/${limit}/${adminId}`, {
		method: "GET",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			return res.json();
		})
		.catch((error) => {
			console.log(error);
		});
};

export const deleteProduct = (adminId, token, productId) => {
	return fetch(`${API}/product/delete/${productId}/${adminId}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			return res.json();
		})
		.catch((error) => {
			console.log(error);
		});
};
export const getAnProduct = (productId, adminId, token) => {
	return fetch(`${API}/product/${productId}/${adminId}`, {
		method: "GET",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			return res.json();
		})
		.catch((error) => {
			console.log(error);
		});
};

// update employee
export const productUpdate = (productId, userId, token, product) => {
	return fetch(`${API}/product/update/${productId}/${userId}`, {
		method: "PUT",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(product),
	})
		.then((res) => {
			return res.json();
		})
		.catch((error) => {
			console.log(error);
		});
};

// caling search product API
export const searchProduct = (adminId, token, searchTerm) => {
	return fetch(`${API}/product/search/any/${searchTerm}/${adminId}`, {
		method: "GET",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			return res.json();
		})
		.catch((error) => {
			console.log(error);
		});
};

export default adminRegister;
