const {spawnSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cacheRoot = path.join(root, '.deploy-cache');
const cache = path.join(cacheRoot, `deploy-gh-pages-${process.pid}-${Date.now()}`);
const branch = 'gh-pages';
const remote = 'origin';
const dryRun = process.env.DEPLOY_DRY_RUN === '1';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || root,
    encoding: 'utf8',
    stdio: options.quiet ? 'pipe' : 'inherit',
  });

  if (result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`${command} ${args.join(' ')} failed${details ? `\n${details}` : ''}`);
  }

  return (result.stdout || '').trim();
}

function copyContents(from, to) {
  for (const entry of fs.readdirSync(from, {withFileTypes: true})) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    fs.cpSync(source, target, {recursive: true});
  }
}

function removePath(target) {
  if (!fs.existsSync(target)) {
    return;
  }

  const stat = fs.lstatSync(target);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target)) {
      removePath(path.join(target, entry));
    }
  }

  try {
    fs.chmodSync(target, 0o666);
  } catch (error) {
    // Best effort for Windows readonly files in cloned .git directories.
  }

  fs.rmSync(target, {recursive: true, force: true, maxRetries: 3, retryDelay: 100});
}

if (!fs.existsSync(dist)) {
  throw new Error('dist does not exist. Run npm run build before deploying.');
}

const repo = process.env.DEPLOY_REPO || run('git', ['config', '--get', `remote.${remote}.url`], {quiet: true});
if (!repo) {
  throw new Error(`Could not find remote.${remote}.url`);
}

fs.mkdirSync(cacheRoot, {recursive: true});

run('git', ['clone', '--depth', '1', repo, cache]);
run('git', ['checkout', '--orphan', branch], {cwd: cache});
fs.rmSync(path.join(cache, '.git', 'index'), {force: true});

for (const entry of fs.readdirSync(cache, {withFileTypes: true})) {
  if (entry.name !== '.git') {
    removePath(path.join(cache, entry.name));
  }
}

copyContents(dist, cache);
fs.writeFileSync(path.join(cache, '.nojekyll'), '');

run('git', ['add', '.'], {cwd: cache});

const status = run('git', ['status', '--porcelain'], {cwd: cache, quiet: true});
if (!status) {
  console.log('No changes to deploy.');
  process.exit(0);
}

run('git', ['commit', '-m', 'Deploy to GitHub Pages'], {cwd: cache});
if (dryRun) {
  console.log('Dry run complete. Skipped push.');
  process.exit(0);
}

run('git', ['push', '--force', remote, branch], {cwd: cache});
