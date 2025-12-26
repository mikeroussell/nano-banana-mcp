/**
 * Type definitions for Nano Banana MCP Server
 */
export declare const MODELS: {
    readonly NANO_BANANA: "gemini-2.5-flash-image";
    readonly NANO_BANANA_PRO: "gemini-3-pro-image-preview";
};
export type ModelName = (typeof MODELS)[keyof typeof MODELS];
export declare const ASPECT_RATIOS: readonly ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];
export type AspectRatio = (typeof ASPECT_RATIOS)[number];
export declare const RESOLUTIONS: readonly ["1K", "2K", "4K"];
export type Resolution = (typeof RESOLUTIONS)[number];
export declare enum ResponseFormat {
    MARKDOWN = "markdown",
    JSON = "json"
}
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
    tools?: Array<{
        google_search?: Record<string, unknown>;
    }>;
}
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
export interface ApiClientConfig {
    apiKey: string;
    baseUrl?: string;
}
//# sourceMappingURL=types.d.ts.map