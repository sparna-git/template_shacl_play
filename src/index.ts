import * as core from "@actions/core"
import { adquiriSHACL_Play } from "./installer"

async function run() {

    try {
        return await adquiriSHACL_Play()
    } catch (error) {
        if (error instanceof Error ){
            return core.setFailed(error.message);
        }        
    }
}

run();