/**
 * Type definitions for Nano Banana MCP Server
 */

// Model names
export const MODELS = {
  NANO_BANANA: "gemini-2.5-flash-image",
  NANO_BANANA_PRO: "gemini-3-pro-image-preview",
} as const;

export type ModelName = (typeof MODELS)[keyof typeof MODELS];

// Aspect ratios supported by the API
export const ASPECT_RATIOS = [
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
] as const;

export type AspectRatio = (typeof ASPECT_RATIOS)[number];

// Image resolutions (only for Nano Banana Pro)
export const RESOLUTIONS = ["1K", "2K", "4K"] as const;

export type Resolution = (typeof RESOLUTIONS)[number];

// Response format enum
export enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json",
}

// Gemini API request types
export interface GeminiContent {
  parts: GeminiPart[];
  role?: "user" | "model";
}

export interface GeminiPart {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

export interface ImageConfig {
  aspectRatio?: AspectRatio;
  imageSize?: Resolution;
}

export interface GenerationConfig {
  responseModalities?: string[];
  imageConfig?: ImageConfig;
}

export interface GeminiRequest {
  contents: GeminiContent[];
  generationConfig?: GenerationConfig;
  tools?: Array<{ google_search?: Record<string, unknown> }>;
}

// Gemini API response types
export interface GeminiResponsePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
  thought?: boolean;
  thought_signature?: string;
}

export interface GeminiCandidate {
  content: {
    parts: GeminiResponsePart[];
    role: string;
  };
  finishReason: string;
}

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

// Tool output types
export interface GenerateImageOutput {
  success: boolean;
  model: string;
  prompt: string;
  imageData?: string;
  mimeType?: string;
  text?: string;
  error?: string;
}

export interface EditImageOutput {
  success: boolean;
  model: string;
  prompt: string;
  imageData?: string;
  mimeType?: string;
  text?: string;
  error?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  features: string[];
  maxResolution?: string;
}

export interface ListModelsOutput {
  models: ModelInfo[];
}

// API client configuration
export interface ApiClientConfig {
  apiKey: string;
  baseUrl?: string;
}
