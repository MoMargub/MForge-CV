/**
 * lib/api.ts
 * Endpoint Fetching & TanStack Query Hooks Layer
 * Imports generic CRUD apiClient from ./interceptor and types from @/types.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './interceptor';
import type {
  UploadResumeResponse,
  ScoreResumeResponse,
  TailorResumeResponse,
} from '@/types';

// ── Endpoints API Service ──────────────────────────────────────────────────

export const resumeApi = {
  uploadResumeToFastApi: (file: File) => {
    const fd = new FormData();
    fd.append('resumeFile', file);
    return apiClient.postForm<UploadResumeResponse>('/api/v1/resume/upload', fd);
  },

  scoreResumeWithFastApi: (jd: string, resumeData?: string) => {
    const fd = new FormData();
    fd.append('jd', jd);
    if (resumeData) fd.append('resumeData', resumeData);
    // Use Next.js API route — works in all environments (Docker, local, Netlify)
    return apiClient.postForm<ScoreResumeResponse>('/api/score', fd, { baseUrl: '' });
  },

  uploadResumeToNextApi: (file: File) => {
    const fd = new FormData();
    fd.append('resumeFile', file);
    return apiClient.postForm<UploadResumeResponse>('/api/upload-resume', fd, { baseUrl: '' });
  },

  tailorResumeWithNextApi: (jd: string, resumeData?: string) => {
    const fd = new FormData();
    fd.append('jd', jd);
    if (resumeData) fd.append('resumeData', resumeData);
    return apiClient.postForm<TailorResumeResponse>('/api/tailor', fd, { baseUrl: '' });
  },
};

// ── TanStack Query Hooks ───────────────────────────────────────────────────

export const resumeKeys = {
  all: ['resume'] as const,
  upload: () => [...resumeKeys.all, 'upload'] as const,
  score: () => [...resumeKeys.all, 'score'] as const,
  tailor: () => [...resumeKeys.all, 'tailor'] as const,
};

export function useUploadResumeMutation() {
  const queryClient = useQueryClient();
  return useMutation<UploadResumeResponse, Error, File>({
    mutationKey: resumeKeys.upload(),
    mutationFn: (file: File) => resumeApi.uploadResumeToFastApi(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resumeKeys.all }),
  });
}

export function useScoreResumeMutation() {
  return useMutation<ScoreResumeResponse, Error, { jd: string; resumeData?: string }>({
    mutationKey: resumeKeys.score(),
    mutationFn: ({ jd, resumeData }) => resumeApi.scoreResumeWithFastApi(jd, resumeData),
  });
}

export function useTailorResumeMutation() {
  return useMutation<TailorResumeResponse, Error, { jd: string; resumeData?: string }>({
    mutationKey: resumeKeys.tailor(),
    mutationFn: ({ jd, resumeData }) => resumeApi.tailorResumeWithNextApi(jd, resumeData),
  });
}

export function useUploadResumeNextMutation() {
  return useMutation<UploadResumeResponse, Error, File>({
    mutationKey: [...resumeKeys.all, 'upload-next'],
    mutationFn: (file: File) => resumeApi.uploadResumeToNextApi(file),
  });
}
