export interface CelebOption {
  name: string;
  category: string;
}

export interface GeneratedImage {
  imageUrl: string;
  celebrityName: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}