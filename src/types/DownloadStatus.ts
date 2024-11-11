export type DownloadStatus = 'downloading' | 'completed' | 'error';

export type DownloadStatusData = {
  name: string;
  status: DownloadStatus;
};
