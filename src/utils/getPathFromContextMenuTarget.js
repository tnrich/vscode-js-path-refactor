export default function getPathFromContextMenuTarget(target) {
  if (target.dataset.path) {
    return target.dataset.path;
  }

  const el = target.querySelector('[data-path]');
  if (el) {
    return el.dataset.path;
  }

  return undefined;
}
