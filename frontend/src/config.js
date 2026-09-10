const API_URL = process.env.NODE_ENV === "development"
	? "http://localhost:5000"
	: "https://shopdroby-ecommerce-3.onrender.com";

export default API_URL;