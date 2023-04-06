import * as core from "@actions/core";
import { exec } from "@actions/exec";
import * as github from "@actions/github";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import * as path from "path";


// Recuperer les parametres d'entrée
import { GITHUB_TOKEN, SHACL_PLAY_VERSION } from "./constants";

// Recuperer la version de SHACL-Play
async function getLatestVersion() {
    const octokit = github.getOctokit(GITHUB_TOKEN);
    const {
      data: { tag_name: version },
    } = await octokit.rest.repos.getLatestRelease({
      owner: "sparna-git",   
      repo: "shacl-play",
    });
    
    return version;
 }
  
async function getVersion(version: string) {
    if (version === "latest") {
      const latestVersion = await getLatestVersion();
      return latestVersion;
    } else {
      return version;
    }
 }

// download        
function composeDownloadUrl(version: string) {
  const url = `https://github.com/sparna-git/shacl-play/releases/download/${version}/shacl-play-app-${version}-onejar.jar`;
  return url;
}


function addPath(baseDir: string): void {
    core.addPath(path.join(baseDir,'shacl-play','releases'));
}

export async function adquiriSHACL_Play() : Promise<void> {
  const version = await getVersion(SHACL_PLAY_VERSION);
  const downloadUrl = composeDownloadUrl(version);

  let shaclPlayPath = tc.find("shacl-play",version);

    core.debug('Actions function ini .......');
    core.debug(version);
    core.debug(downloadUrl);

    if (shaclPlayPath === ""){
        core.debug('Condition pour trouver la rute du fichier jar..........');
        const downloadedPath = await tc.downloadTool(downloadUrl);
        core.debug(downloadedPath);
        
        const cachedPath = await tc.cacheFile(downloadedPath, "shacl-play.jar","shacl-play",version);
        core.debug(cachedPath);
        core.addPath(cachedPath)

        // addPath(cachedPath);
        shaclPlayPath = tc.find("shacl-play",version);
    }

    // const shaclPlayPath = await io.which("shacl-play",true);
    
    core.debug('SHACL-Play Path ');
    core.debug(shaclPlayPath);
    
    await exec(`java -jar ${shaclPlayPath} ${version} --help`);
}