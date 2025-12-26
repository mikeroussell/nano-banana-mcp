/**
 * Gemini API Client for Nano Banana image generation
 */
import { ModelName, AspectRatio, Resolution } from "../types.js";
/**
 * Get API key from environment variable
 */
export declare function getApiKey(): string;
/**
 * Generate an image from a text prompt
 */
export declare function generateImage(options: {
    prompt: string;
    model?: ModelName;
    aspectRatio?: AspectRatio;
    resolution?: Resolution;
    useGoogleSearch?: boolean;
}): Promise<{
    imageData?: string;
    mimeType?: string;
    text?: string;
}>;
/**
 * Edit an image using a text prompt
 */
export declare function editImage(options: {
    prompt: string;
    imageBase64: string;
    imageMimeType: string;
    model?: ModelName;
    aspectRatio?: AspectRatio;
    resolution?: Resolution;
}): Promise<{
    imageData?: string;
    mimeType?: string;
    text?: string;
}>;
/**
 * Edit an image using multiple reference images
 */
export declare function editImageWithReferences(options: {
    prompt: string;
    images: Array<{
        base64: string;
        mimeType: string;
    }>;
    model?: ModelName;
    aspectRatio?: AspectRatio;
    resolution?: Resolution;
}): Promise<{
    imageData?: string;
    mimeType?: string;
    text?: string;
}>;
//# sourceMappingURL=gemini-client.d.ts.map