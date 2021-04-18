import cluster from "node:cluster";

const worker = cluster.isMaster ? 0 : cluster.worker.id;

export function info( message = "", data = {} ) {
	console.info( JSON.stringify( {
		...data,
		"@level": "info",
		"@timestamp": new Date(),
		"@message": message,
		"@pid": process.pid,
		"@worker": worker
	} ) );
}

export function warn( message = "", data = {} ) {
	console.warn( JSON.stringify( {
		...data,
		"@level": "warn",
		"@timestamp": new Date(),
		"@timestamp": new Date(),
		"@message": message,
		"@pid": process.pid,
		"@worker": worker
	} ) );
}

export function error( message = "", data = {} ) {
	console.error( JSON.stringify( {
		...data,
		"@level": "error",
		"@timestamp": new Date(),
		"@message": message,
		"@pid": process.pid,
		"@worker": worker
	} ) );
}

export function trace( message = "", data = {} ) {
	console.trace( JSON.stringify( {
		...data,
		"@level": "trace",
		"@timestamp": new Date(),
		"@message": message,
		"@pid": process.pid,
		"@worker": worker
	} ) );
}

export function debug( message = "", data = {} ) {
	console.debug( JSON.stringify( {
		...data,
		"@level": "debug",
		"@timestamp": new Date(),
		"@message": message,
		"@pid": process.pid,
		"@worker": worker
	} ) );
}