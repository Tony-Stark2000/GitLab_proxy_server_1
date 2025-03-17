# GitLab Proxy Server

A proxy server to handle GitLab API (v4) requests securely from web applications without exposing API tokens to the client.

## Overview

This server acts as a middleware between your frontend application and the GitLab API. It proxies all GitLab API requests through a single endpoint, keeping your GitLab access token secure on the server-side.

## Installation

1. Clone this repository:

```bash
git clone https://github.com/Tony-Stark2000/GitLab_proxy_server_1.git
cd GitLab_proxy_server_1
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
GITLAB_API_URL=https://gitlab.com/api/v4
GITLAB_ACCESS_TOKEN=your_gitlab_personal_access_token
```

4. Start the server:

```bash
npm start
```

## Usage

The server exposes a single endpoint for all GitLab API operations:

### Endpoint: `POST /api/gitlabproxy`

This endpoint accepts a JSON payload with the following structure:

```json
{
	"apiPath": "/projects/:id/repository/branches",
	"method": "GET",
	"queryParams": {
		"param1": "value1",
		"param2": "value2"
	},
	"postData": {
		"key1": "value1",
		"key2": "value2"
	},
	"apiHeaders": {
		"Custom-Header": "value"
	}
}
```

#### Parameters

-   `apiPath` (required): The GitLab API endpoint path (without the base URL)
-   `method` (optional): The HTTP method (GET, POST, PUT, DELETE, etc.). Defaults to "GET"
-   `queryParams` (optional): Query parameters to append to the URL
-   `postData` (optional): Request body for POST, PUT, or PATCH requests
-   `apiHeaders` (optional): Additional headers to send with the request

## Examples

### Get all projects

```javascript
fetch("http://localhost:3000/api/gitlabproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/projects",
		method: "GET",
		queryParams: { membership: true }
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Create a new project

```javascript
fetch("http://localhost:3000/api/gitlabproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/projects",
		method: "POST",
		postData: {
			name: "My Project",
			description: "A project created via the proxy server",
			visibility: "private"
		}
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Get my own projects

```javascript
fetch("http://localhost:3000/api/gitlabproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/projects",
		method: "GET",
		queryParams: {
			owned: true,
			simple: true,
			order_by: "last_activity_at",
			sort: "desc"
		}
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Get issues from a project

```javascript
fetch("http://localhost:3000/api/gitlabproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/projects/123/issues",
		method: "GET",
		queryParams: {
			state: "opened",
			order_by: "created_at",
			sort: "desc"
		}
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Create an issue in a project

```javascript
fetch("http://localhost:3000/api/gitlabproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/projects/123/issues",
		method: "POST",
		postData: {
			title: "New issue title",
			description: "This is the description of the new issue",
			labels: "bug,important",
			assignee_ids: [42],
			due_date: "2023-12-31"
		}
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Get a specific issue from a project

```javascript
fetch("http://localhost:3000/api/gitlabproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/projects/123/issues/456",
		method: "GET"
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

## Error Handling

The server will forward any errors from the GitLab API with appropriate status codes and error messages.

## Security Notes

-   This proxy server is designed to keep your GitLab access token secure by storing it on the server.
-   Consider implementing additional authentication for the proxy server in a production environment.
-   The CORS middleware is enabled to allow cross-origin requests. Configure it appropriately for your use case.
