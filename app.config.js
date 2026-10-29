const { execSync } = require('child_process');

function lerDoGit(comando) {
  try {
    return execSync(comando, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return undefined;
  }
}

const commitCompleto = process.env.EAS_BUILD_GIT_COMMIT_HASH || lerDoGit('git rev-parse HEAD');

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash: commitCompleto ? commitCompleto.slice(0, 7) : undefined,
    commitData: lerDoGit('git log -1 --format=%cI'),
    canal: process.env.EAS_BUILD_PROFILE || 'local',
  },
});
