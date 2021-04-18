module.exports = {
	apps: [ {
		name: "dev",
		script: "./bin/dev.js",
		watch: [ "bin", "lib", "src", "frontend", "cert" ]
	} ]
}