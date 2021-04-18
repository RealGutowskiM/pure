import path from "node:path";
import { fileURLToPath } from "node:url";

export function resolve_path( to ) {
	return path.resolve(
		path.dirname( fileURLToPath( import.meta.url ) ),
		to
	);
}