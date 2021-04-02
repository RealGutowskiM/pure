import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import http2 from "http2";

const dirname = path.dirname( fileURLToPath( import.meta.url ) ),
    frontend_dir = path.resolve( dirname, "../frontend" ),
    TLS_CERT_KEY_PATH = process.env.TLS_CERT_KEY_PATH ||
        path.resolve( dirname, "../cert/localhost.key" ),
    TLS_CERT_PATH = process.env.TLS_CERT_PATH ||
        path.resolve( dirname, "../cert/localhost.crt" ),
    PORT = process.env.PORT || 8080;

main();

async function main() {
    http2
        .createSecureServer( {
            key: await fs.readFile( TLS_CERT_KEY_PATH ),
            cert: await fs.readFile( TLS_CERT_PATH )
        } )
        .on( "stream", respond )
        .on( "error", console.error )
        .on( "listening", report_listening )
        .listen( PORT );
};

function respond( stream, headers ) {
    console.log( "Got request", headers );
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
        console.error( "Reading file failed", error );
        stream.respond( { ":status": 404 } );
        stream.end();
    }
}

function parse_to_frontend_path( headers ) {
    const path = headers[ ":path" ];
    return frontend_dir + ( path.endsWith( "/" ) ? path + "index.html" : path );
}

function report_listening() {
    console.log( "Listening on port", PORT );
}