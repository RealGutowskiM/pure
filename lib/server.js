import fs from "fs/promises";
import http2 from "http2";
import { resolve_path } from "./path.js";

const frontend_dir = process.env.FRONTEND_DIR ||
	resolve_path( "../frontend" ),
	TLS_CERT_KEY_PATH = process.env.TLS_CERT_KEY_PATH ||
		resolve_path( "../cert/localhost.key" ),
	TLS_CERT_PATH = process.env.TLS_CERT_PATH ||
		resolve_path( "../cert/localhost.crt" ),
	PORT = process.env.PORT || 8080;

export async function start_server() {
	http2
		.createSecureServer( {
			key: await fs.readFile( TLS_CERT_KEY_PATH ),
			cert: await fs.readFile( TLS_CERT_PATH )
		} )
		.on( "stream", respond )
		.on( "error", function report_error( error ) {
			console.error( "Server error", JSON.stringify( error ) );
			process.exit( 1 );
		} )
		.on( "listening", report_listening )
		.listen( PORT );
};

function respond( stream, headers ) {
	console.log( "Got request", JSON.stringify( headers ) );
	const filepath = parse_to_frontend_path( headers );

	stream.respondWithFile(
		filepath,
		{ 'content-type': "text/plain; charset=utf-8" },
		{ statCheck, onError }
	);

	function statCheck( stat, headers ) {
		if ( filepath.endsWith( ".html" ) ) headers[ 'content-type' ] = "text/html; charset=utf-8";
		headers[ 'last-modified' ] = stat.mtime.toUTCString();
	}

	function onError( error ) {
		console.error( "Reading file failed", JSON.stringify( error ) );
		stream.respond( { ":status": 404 } );
		stream.end();
	}
}

function parse_to_frontend_path( headers ) {
	const path = headers[ ":path" ];
	return frontend_dir + ( path.endsWith( "/" ) ? path + "index.html" : path );
}

function report_listening() {
	console.log( process.pid, "Listening on port", PORT );
}