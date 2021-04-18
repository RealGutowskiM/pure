import cluster from "node:cluster";
import os from "node:os";
import { warn, info } from "./logger.js";

export function run_clustered( func ) {
	if ( cluster.isMaster ) {
		info( "Sprawning workers", { cpus: os.cpus().length } );
		os.cpus().forEach( fork_worker );
		cluster.on( "exit", report_death );
	} else {
		info( "Starting worker" );
		func();
	}
}

function fork_worker() {
	cluster.fork();
}

function report_death( _worker, code, signal ) {
	warn( "Died", { code, signal } );
	fork_worker();
}