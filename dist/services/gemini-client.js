/**
 * Gemini API Client for Nano Banana image generation
 */
import { MODELS, } from "../types.js";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
/**
 * Get API key from environment variable
 */
export function getApiKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required. " +
            "Get your API key from https://aistudio.google.com/apikey");
    }
    return apiKey;
}
/**
 * Make a request to the Gemini API
 */
async function makeGeminiRequest(model, request) {
    const apiKey = getApiKey();
    const url = `${BASE_URL}/${model}:generateContent`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error?.message || errorText;
        }
        catch {
            errorMessage = errorText;
        }
        throw new Error(`Gemini API error (${response.status}): ${errorMessage}`);
    }
    return (await response.json());
}
/**
 * Extract image data and text from Gemini response
 */
function extractResponseContent(response) {
    const result = {};
    if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No response candidates returned from API");
    }
    const parts = response.candidates[0].content.parts;
    const textParts = [];
    for (const part of parts) {
        // Skip thought parts (internal reasoning)
        if (part.thought)
            continue;
        if (part.text) {
            textParts.push(part.text);
        }
        else if (part.inlineData) {
            result.imageData = part.inlineData.data;
            result.mimeType = part.inlineData.mimeType;
        }
    }
    if (textParts.length > 0) {
        result.text = textParts.join("\n");
    }
    return result;
}
/**
 * Generate an image from a text prompt
 */
export async function generateImage(options) {
    const { prompt, model = MODELS.NANO_BANANA_PRO, aspectRatio, resolution, useGoogleSearch = false, } = options;
    const request = {
        contents: [
            {
                parts: [{ text: prompt }],
            },
        ],
        generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
        },
    };
    // Add image config if aspect ratio or resolution specified
    if (aspectRatio || resolution) {
        request.generationConfig.imageConfig = {};
        if (aspectRatio) {
            request.generationConfig.imageConfig.aspectRatio = aspectRatio;
        }
        if (resolution && model === MODELS.NANO_BANANA_PRO) {
            request.generationConfig.imageConfig.imageSize = resolution;
        }
    }
    // Add Google Search tool for grounding if requested
    if (useGoogleSearch) {
        request.tools = [{ google_search: {} }];
    }
    const response = await makeGeminiRequest(model, request);
    return extractResponseContent(response);
}
/**
 * Edit an image using a text prompt
 */
export async function editImage(options) {
    const { prompt, imageBase64, imageMimeType, model = MODELS.NANO_BANANA_PRO, aspectRatio, resolution, } = options;
    const contents = [
        {
            parts: [
                { text: prompt },
                {
                    inline_data: {
                        mime_type: imageMimeType,
                        data: imageBase64,
                    },
                },
            ],
        },
    ];
    const request = {
        contents,
        generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
        },
    };
    // Add image config if aspect ratio or resolution specified
    if (aspectRatio || resolution) {
        request.generationConfig.imageConfig = {};
        if (aspectRatio) {
            request.generationConfig.imageConfig.aspectRatio = aspectRatio;
        }
        if (resolution && model === MODELS.NANO_BANANA_PRO) {
            request.generationConfig.imageConfig.imageSize = resolution;
        }
    }
    const response = await makeGeminiRequest(model, request);
    return extractResponseContent(response);
}
/**
 * Edit an image using multiple reference images
 */
export async function editImageWithReferences(options) {
    const { prompt, images, model = MODELS.NANO_BANANA_PRO, aspectRatio, resolution, } = options;
    if (images.length > 14) {
        throw new Error("Maximum of 14 reference images allowed");
    }
    const parts = [
        { text: prompt },
    ];
    for (const img of images) {
        parts.push({
            inline_data: {
                mime_type: img.mimeType,
                data: img.base64,
            },
        });
    }
    const request = {
        contents: [{ parts }],
        generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
        },
    };
    // Add image config
    if (aspectRatio || resolution) {
        request.generationConfig.imageConfig = {};
        if (aspectRatio) {
            request.generationConfig.imageConfig.aspectRatio = aspectRatio;
        }
        if (resolution && model === MODELS.NANO_BANANA_PRO) {
            request.generationConfig.imageConfig.imageSize = resolution;
        }
    }
    const response = await makeGeminiRequest(model, request);
    return extractResponseContent(response);
}
//# sourceMappingURL=gemini-client.js.map