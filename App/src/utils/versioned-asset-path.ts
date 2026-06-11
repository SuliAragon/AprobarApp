export function buildVersionedAssetPath(assetPath: string, sourceFilename: string) {
  return `${assetPath}?v=${encodeURIComponent(sourceFilename)}`;
}
