import cluster from "cluster";
import os from "os";

export function run_clustered( func ) {
	if ( cluster.isMaster ) {
		console.log( process.pid, "Sprawning workers", os.cpus().length );
		os.cpus().forEach( fork_worker );
		cluster.on( "exit", report_death );
	} else {
		func();
	}
}

function fork_worker() {
	cluster.fork();
}

function report_death( worker, code, signal ) {
	console.log( worker.process.pid, "Died", code, signal );
	fork_worker();
}