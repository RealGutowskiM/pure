export function get( property ) {
	return function extractor( obj ) { return obj?.[ property ]; };
}
