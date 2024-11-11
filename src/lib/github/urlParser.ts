export function parseGitHubUrl(url: string) {
  const regex = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+)\/(.+))?$/;
  const match = url.match(regex);

  if (!match) {
    throw new Error('Invalid GitHub URL');
  }

  const owner = match[1];
  const repo = match[2];
  const ref = match[3] || undefined;
  const path = match[4] || '';

  return { owner, repo, path, ref };
}
