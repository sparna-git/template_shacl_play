import * as core from "@actions/core"

export const GITHUB_TOKEN = core.getInput("github-token");
export const SHACL_PLAY_VERSION = core.getInput("shacl-play-version");