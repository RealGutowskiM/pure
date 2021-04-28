export default async function api( headers, stream ) {
	const path = headers[ ":path" ],
		response_headers = {};

	if ( path === "/api/hello" ) {
		return say_hello( response_headers, stream );
	}

	if ( path === "/api/hello-json" ) {
		return say_hello_in_json( response_headers, stream );
	}
}

function say_hello_in_json( response_headers, stream ) {
	response_headers[ ":status" ] = 200;
	response_headers[ "content-type" ] = "application/json;charset=utf-8";

	stream.respond( response_headers );
	stream.end( JSON.stringify( { response: "Hello!" } ) );
}

function say_hello( response_headers, stream ) {
	response_headers[ ":status" ] = 200;
	response_headers[ "content-type" ] = "text/plain;charset=utf-8";

	stream.respond( response_headers );
	stream.end( "Hello!" );
}
