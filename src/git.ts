import { execSync } from 'child_process';

export interface Branch {
  name: string;
  current: boolean;
  merged: boolean;
  lastCommitDate: Date;
  daysStale: number;
  protected: boolean;
}

const PROTECTED_BRANCHES = ['main', 'master', 'develop', 'development'];

export function getCurrentBranch(): string {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

export function isGitRepo(): boolean {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function getBranches(): Branch[] {
  const currentBranch = getCurrentBranch();
  
  // Get all local branches with last commit date
  const branchOutput = execSync(
    'git for-each-ref --sort=-committerdate refs/heads/ --format="%(refname:short)|%(committerdate:iso8601)"',
    { encoding: 'utf8' }
  );

  // Get merged branches
  const mergedOutput = execSync(
    `git branch --merged ${currentBranch}`,
    { encoding: 'utf8' }
  );
  const mergedBranches = new Set(
    mergedOutput
      .split('\n')
      .map(b => b.replace('*', '').trim())
      .filter(Boolean)
  );

  const branches: Branch[] = [];
  const now = new Date();

  for (const line of branchOutput.split('\n').filter(Boolean)) {
    const [name, dateStr] = line.split('|');
    const lastCommitDate = new Date(dateStr);
    const daysStale = Math.floor((now.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const isProtected = PROTECTED_BRANCHES.includes(name) || name === currentBranch;

    branches.push({
      name,
      current: name === currentBranch,
      merged: mergedBranches.has(name) && !isProtected,
      lastCommitDate,
      daysStale,
      protected: isProtected,
    });
  }

  return branches;
}

export function gitFetch(): string {
  try {
    return execSync('git fetch --prune', { encoding: 'utf8', timeout: 30000 }).trim() || 'Fetched (up to date)';
  } catch (e: any) {
    return e.stderr?.trim() || 'Fetch failed';
  }
}

export function gitPull(): string {
  try {
    return execSync('git pull --ff-only', { encoding: 'utf8', timeout: 30000 }).trim();
  } catch (e: any) {
    return e.stderr?.trim() || 'Pull failed';
  }
}

export function deleteBranch(branchName: string, force: boolean = false): boolean {
  try {
    const flag = force ? '-D' : '-d';
    execSync(`git branch ${flag} "${branchName}"`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
