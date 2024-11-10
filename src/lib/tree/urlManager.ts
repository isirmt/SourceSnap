export const updateURL = (owner: string, repo: string, path: string, ref: string | undefined) => {
  if (!owner || !repo) return;
  const url = new URL(window.location.origin) + "tree" + `/${owner}/${repo}/${path}${ref ? `?ref=${ref}` : ""}`;
  window.history.pushState({}, "", url);
}