export default async function api( headers ) {
	const path = headers[ ":path" ],
		response_headers = {};

	if ( path === "/api/hello" ) {
		return say_hello( response_headers );
	}

	if ( path === "/api/hello-json" ) {
		return say_hello_in_json( response_headers );
	}
}

function say_hello_in_json( response_headers ) {
	response_headers[ ":status" ] = 200;

	return {
		response_headers,
		data: { response: "Hello!" }
	};
}

function say_hello( response_headers ) {
	response_headers[ ":status" ] = 200;

	return {
		response_headers,
		data: "Hello!"
	};
}
