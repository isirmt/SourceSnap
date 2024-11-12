import saveAs from 'file-saver';
import { DownloadStatus } from '@/types/DownloadStatus';

export async function DownloadFolder(
  // eslint-disable-next-line no-unused-vars
  updateFunc: (status: DownloadStatus) => void,
  owner: string,
  repo: string,
  path: string,
) {
  updateFunc('downloading');
  try {
    const response = await fetch(
      `/api/get-folder?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&path=${path}`,
    );
    if (!response.ok) {
      throw new Error('Failed to download folder');
    }
    const blob = await response.blob();
    saveAs(blob, path.split('/').slice(-1)[0]);
    updateFunc('completed');
  } catch (error) {
    console.error('Failed to download folder:', error);
    updateFunc('error');
  }
}

export async function DownloadFile(
  // eslint-disable-next-line no-unused-vars
  updateFunc: (status: DownloadStatus) => void,
  download_url: string | null,
  name: string,
) {
  updateFunc('downloading');
  try {
    if (download_url) {
      const response = await fetch(`/api/get-file?download_url=${encodeURIComponent(download_url)}`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      const blob = await response.blob();
      saveAs(blob, name);
      updateFunc('completed');
    } else {
      throw new Error('File does not have a download URL.');
    }
  } catch (error) {
    console.error('Failed to download file:', error);
    updateFunc('error');
  }
}
