import { logger } from "@vendetta";
import { findByProps } from "@vendetta/metro";

// Grab the internal HTTP module
const { get, post } = findByProps("get", "post", "put");

export default {
    onLoad: () => {
        logger.log("Plugin loaded!");

        // Example: Fetch information about a specific channel
        get({
            url: "/safety-hub/@me"
        }).then(response => {
            logger.log(`${response.body}`);
        }).catch(err => {
            logger.error("Error: ", err);
        });
    },
    
    onUnload: () => {
        logger.log("Plugin unloaded!");
    }
}