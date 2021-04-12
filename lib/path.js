import path from "path";
import { fileURLToPath } from "url";

export function resolve_path( to ) {
	return path.resolve(
		path.dirname( fileURLToPath( import.meta.url ) ),
		to
	);
}