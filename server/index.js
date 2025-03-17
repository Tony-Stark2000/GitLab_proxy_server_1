const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GitLab API configuration
const gitlabApiUrl = process.env.GITLAB_API_URL;
const gitlabToken = process.env.GITLAB_ACCESS_TOKEN;

// Basic health check endpoint
app.get("/", (req, res) => {
	res.json({ message: "GitLab Proxy Server is running" });
});

// Generic GitLab proxy endpoint
app.post("/api/gitlabproxy", async (req, res) => {
	try {
		const {
			apiPath,
			queryParams = {},
			postData = {},
			method = "GET",
			apiHeaders = {}
		} = req.body;

		if (!apiPath) {
			return res.status(400).json({ error: "apiPath is required" });
		}

		// Construct the full GitLab API URL with query parameters
		let fullUrl = `${gitlabApiUrl}${apiPath}`;

		// Add query parameters if they exist
		if (Object.keys(queryParams).length > 0) {
			const urlParams = new URLSearchParams();
			for (const [key, value] of Object.entries(queryParams)) {
				if (value !== null && value !== undefined) {
					urlParams.append(key, value);
				}
			}
			fullUrl += `?${urlParams.toString()}`;
		}

		// Configure the request options
		const requestConfig = {
			method,
			url: fullUrl,
			headers: {
				"Private-Token": gitlabToken,
				"Content-Type": "application/json",
				...apiHeaders
			}
		};

		// Add request body data for non-GET requests
		if (method !== "GET" && Object.keys(postData).length > 0) {
			requestConfig.data = postData;
		}

		// Make the request to GitLab API
		const response = await axios(requestConfig);

		// Return the GitLab API response to the client
		return res.status(response.status).json(response.data);
	} catch (error) {
		console.error(`Error proxying GitLab request:`, error.message);

		if (error.response) {
			// Return the error status and data from GitLab
			return res.status(error.response.status).json({
				error: "Error from GitLab API",
				details: error.response.data
			});
		}

		return res.status(500).json({ error: "Failed to proxy request to GitLab API" });
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
