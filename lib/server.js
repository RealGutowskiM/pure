import fs from "node:fs/promises";
import http2 from "node:http2";
import { info, error } from "./logger.js";
import { resolve_path } from "./path.js";

const frontend_dir = process.env.FRONTEND_DIR ||
	resolve_path( "../frontend" ),
	TLS_CERT_KEY_PATH = process.env.TLS_CERT_KEY_PATH ||
		resolve_path( "../cert/localhost.key" ),
	TLS_CERT_PATH = process.env.TLS_CERT_PATH ||
		resolve_path( "../cert/localhost.crt" ),
	PORT = process.env.PORT || 8080;

export async function start_server() {
	const [ key, cert ] = [
		fs.readFile( TLS_CERT_KEY_PATH ),
		fs.readFile( TLS_CERT_PATH )
	];

	http2
		.createSecureServer( {
			key: await key,
			cert: await cert
		} )
		.on( "stream", respond )
		.on( "error", report_error )
		.on( "listening", report_listening )
		.listen( PORT );
};

function respond( stream, headers ) {
	info( "Got request", headers );
	const filepath = parse_to_frontend_path( headers );

	stream.respondWithFile(
		filepath,
		{ 'content-type': "text/plain;charset=utf-8" },
		{ statCheck, onError }
	);

	function statCheck( stat, response_headers ) {
		if ( has_file_not_changed( stat.mtime, headers ) ) {
			stream.respond( { ":status": 304 } );
			return false;
		}

		set_content_type( response_headers, filepath );
		response_headers[ "last-modified" ] = stat.mtime.toUTCString();
	}

	function onError( err ) {
		error( "Reading file failed", { error: err } );
		stream.respond( { ":status": 404 } );
		stream.end();
	}

	function has_file_not_changed( time, headers ) {
		const modified_since = new Date( headers[ "if-modified-since" ] );
		return modified_since <= time;
	}
}

function set_content_type( headers, filepath ) {
	if ( filepath.endsWith( ".html" ) )
		return headers[ 'content-type' ] = "text/html;charset=utf-8";
	if ( filepath.endsWith( ".css" ) )
		return headers[ 'content-type' ] = "text/css;charset=utf-8";
	if ( filepath.endsWith( ".js" ) )
		return headers[ 'content-type' ] = "application/javascript;charset=utf-8";
	if ( filepath.endsWith( ".mjs" ) )
		return headers[ 'content-type' ] = "application/javascript;charset=utf-8";
}

function parse_to_frontend_path( headers ) {
	const path = headers[ ":path" ];
	return frontend_dir + ( path.endsWith( "/" ) ? path + "index.html" : path );
}

function report_listening() {
	info( "Listening", { port: PORT } );
}

function report_error( err ) {
	error( "Server error", { error: err } );
	process.exit( 1 );
}