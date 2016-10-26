'use strict';

const path = require('path');
const glob = require('glob');

function resolveAsset(url) {

  const parsed = path.parse(url);
  const wildcard = path.join(parsed.dir, `${parsed.name}*(-rev.*)${parsed.ext}`)
  const matches = glob.sync(`build/${wildcard}`);

  if (!matches.length) {
    console.error(`${url} was not found in the build directory.`);
    return url;
  } else if (matches.length > 1) {
    console.error(`${wildcard} matched more than one file.`);
    return url;
  }

  const match = path.relative('build', matches[0]);
  return path.normalize(match);
}


module.exports = resolveAsset;
