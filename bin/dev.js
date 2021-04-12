import { start_server } from "../lib/server.js";
import { run_clustered } from "../lib/cluster.js";

run_clustered( start_server );