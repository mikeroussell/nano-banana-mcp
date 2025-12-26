/**
 * Nano Banana MCP Server
 *
 * MCP server for Google's Nano Banana Pro (Gemini 3 Pro Image) and
 * Nano Banana (Gemini 2.5 Flash Image) models for AI image generation.
 *
 * Features:
 * - Text-to-image generation
 * - Image editing with text prompts
 * - Multi-image composition (up to 14 reference images)
 * - Various aspect ratios and resolutions up to 4K
 * - Google Search grounding for real-time information
 *
 * Authentication:
 * Set the GEMINI_API_KEY environment variable with your API key from
 * https://aistudio.google.com/apikey
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { MODELS } from "./types.js";
import { GenerateImageInputSchema, EditImageInputSchema, ComposeImagesInputSchema, ListModelsInputSchema, } from "./schemas.js";
import { generateImage, editImage, editImageWithReferences, getApiKey, } from "./services/gemini-client.js";
// Model information for list_models tool
const MODEL_INFO = [
    {
        id: MODELS.NANO_BANANA_PRO,
        name: "Nano Banana Pro (Gemini 3 Pro Image)",
        description: "State-of-the-art image generation and editing model. Optimized for professional asset production with advanced reasoning, high-fidelity text rendering, and up to 4K resolution.",
        features: [
            "High-resolution output (1K, 2K, 4K)",
            "Advanced text rendering (legible, stylized text)",
            "Google Search grounding for real-time data",
            "Up to 14 reference images for composition",
            "Thinking mode for complex prompts",
            "Multi-turn conversation for iterative refinement",
        ],
        maxResolution: "4K",
    },
    {
        id: MODELS.NANO_BANANA,
        name: "Nano Banana (Gemini 2.5 Flash Image)",
        description: "Fast, low-latency image generation model. Great for quick experimentation, iteration, and high-volume generation.",
        features: [
            "Fast generation speed",
            "Low latency",
            "Good for batch processing",
            "Text-to-image generation",
            "Image editing",
            "Multi-turn conversation",
        ],
        maxResolution: "1K",
    },
];
// Initialize MCP Server
const server = new McpServer({
    name: "nanobanana-mcp-server",
    version: "1.0.0",
});
// ============================================================================
// Tool: nanobanana_generate_image
// ============================================================================
server.registerTool("nanobanana_generate_image", {
    title: "Generate Image with Nano Banana",
    description: `Generate high-quality images from text descriptions using Google's Nano Banana models.

This tool creates images from natural language prompts. For best results, be descriptive about:
- Subject and composition
- Style (photorealistic, illustration, painting, etc.)
- Lighting and atmosphere
- Colors and mood
- Camera angle and lens (for photorealistic images)

Args:
  - prompt (string, required): Text description of the image to generate
  - model (string): Model to use. Options:
    * 'gemini-3-pro-image-preview' (Nano Banana Pro) - Best quality, 4K, text rendering
    * 'gemini-2.5-flash-image' (Nano Banana) - Fast generation
    Default: Nano Banana Pro
  - aspect_ratio (string): Image aspect ratio. Options: 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
  - resolution (string): Image resolution (Pro only). Options: 1K, 2K, 4K
  - use_google_search (boolean): Enable real-time information grounding (Pro only)

Returns:
  - success (boolean): Whether generation succeeded
  - imageData (string): Base64-encoded image data
  - mimeType (string): Image MIME type (usually image/png)
  - text (string): Any accompanying text from the model
  - error (string): Error message if generation failed

Examples:
  - "A photorealistic portrait of an astronaut on Mars at sunset"
  - "Kawaii-style sticker of a happy corgi with a transparent background"
  - "Minimalist logo for 'TechStart' in blue and white, modern sans-serif font"

Error Handling:
  - Returns error if GEMINI_API_KEY is not set
  - Returns error if API rate limit exceeded (try again later)
  - Returns error if content policy violated`,
    inputSchema: GenerateImageInputSchema,
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
    },
}, async (params) => {
    try {
        // Validate API key is available
        getApiKey();
        const result = await generateImage({
            prompt: params.prompt,
            model: params.model,
            aspectRatio: params.aspect_ratio,
            resolution: params.resolution,
            useGoogleSearch: params.use_google_search,
        });
        const output = {
            success: true,
            model: params.model || MODELS.NANO_BANANA_PRO,
            prompt: params.prompt,
            imageData: result.imageData,
            mimeType: result.mimeType,
            text: result.text,
        };
        // Format text response
        let textContent = `✅ Image generated successfully\n\n`;
        textContent += `**Model:** ${output.model}\n`;
        textContent += `**Prompt:** ${params.prompt.substring(0, 100)}${params.prompt.length > 100 ? "..." : ""}\n`;
        if (result.text) {
            textContent += `\n**Model Response:**\n${result.text}\n`;
        }
        if (result.imageData) {
            textContent += `\n**Image:** Base64 data available (${result.mimeType})\n`;
            textContent += `Data length: ${result.imageData.length} characters`;
        }
        return {
            content: [{ type: "text", text: textContent }],
            structuredContent: output,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        const output = {
            success: false,
            model: params.model || MODELS.NANO_BANANA_PRO,
            prompt: params.prompt,
            error: errorMessage,
        };
        return {
            content: [
                {
                    type: "text",
                    text: `❌ Image generation failed\n\n**Error:** ${errorMessage}\n\n**Troubleshooting:**\n- Ensure GEMINI_API_KEY environment variable is set\n- Check if your prompt complies with content policies\n- Try again if rate limited`,
                },
            ],
            structuredContent: output,
        };
    }
});
// ============================================================================
// Tool: nanobanana_edit_image
// ============================================================================
server.registerTool("nanobanana_edit_image", {
    title: "Edit Image with Nano Banana",
    description: `Edit an existing image using text prompts with Google's Nano Banana models.

Provide an image and describe your desired changes. The model will:
- Add, remove, or modify elements
- Change style, lighting, or colors
- Adjust composition
- Apply filters or effects

The model maintains the original image's style and context while applying changes.

Args:
  - prompt (string, required): Description of the edit to make
  - image_base64 (string, required): Base64-encoded image data (no data URI prefix)
  - image_mime_type (string, required): MIME type of the image (e.g., 'image/png', 'image/jpeg')
  - model (string): Model to use. Default: Nano Banana Pro
  - aspect_ratio (string): Output aspect ratio. Options: 1:1, 2:3, 3:2, etc.
  - resolution (string): Output resolution (Pro only). Options: 1K, 2K, 4K

Returns:
  - success (boolean): Whether editing succeeded
  - imageData (string): Base64-encoded edited image
  - mimeType (string): Image MIME type
  - text (string): Any accompanying text from the model
  - error (string): Error message if editing failed

Examples:
  - "Add a small wizard hat on the cat's head"
  - "Change the background to a sunset beach"
  - "Make this image look like a Van Gogh painting"
  - "Remove the person in the background"

Error Handling:
  - Returns error if image data is invalid
  - Returns error if MIME type is unsupported
  - Returns error if content policy violated`,
    inputSchema: EditImageInputSchema,
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
    },
}, async (params) => {
    try {
        getApiKey();
        const result = await editImage({
            prompt: params.prompt,
            imageBase64: params.image_base64,
            imageMimeType: params.image_mime_type,
            model: params.model,
            aspectRatio: params.aspect_ratio,
            resolution: params.resolution,
        });
        const output = {
            success: true,
            model: params.model || MODELS.NANO_BANANA_PRO,
            prompt: params.prompt,
            imageData: result.imageData,
            mimeType: result.mimeType,
            text: result.text,
        };
        let textContent = `✅ Image edited successfully\n\n`;
        textContent += `**Model:** ${output.model}\n`;
        textContent += `**Edit:** ${params.prompt.substring(0, 100)}${params.prompt.length > 100 ? "..." : ""}\n`;
        if (result.text) {
            textContent += `\n**Model Response:**\n${result.text}\n`;
        }
        if (result.imageData) {
            textContent += `\n**Edited Image:** Base64 data available (${result.mimeType})\n`;
            textContent += `Data length: ${result.imageData.length} characters`;
        }
        return {
            content: [{ type: "text", text: textContent }],
            structuredContent: output,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        const output = {
            success: false,
            model: params.model || MODELS.NANO_BANANA_PRO,
            prompt: params.prompt,
            error: errorMessage,
        };
        return {
            content: [
                {
                    type: "text",
                    text: `❌ Image editing failed\n\n**Error:** ${errorMessage}`,
                },
            ],
            structuredContent: output,
        };
    }
});
// ============================================================================
// Tool: nanobanana_compose_images
// ============================================================================
server.registerTool("nanobanana_compose_images", {
    title: "Compose Multiple Images with Nano Banana Pro",
    description: `Compose new images using multiple reference images with Nano Banana Pro.

Use up to 14 reference images to:
- Create group compositions
- Transfer styles between images
- Maintain character consistency across scenes
- Combine objects from different images

Limits:
- Up to 6 images of objects for high-fidelity inclusion
- Up to 5 images of humans for character consistency
- Total maximum: 14 images

Args:
  - prompt (string, required): Description of how to compose the images
  - images (array, required): Array of image objects with:
    * base64 (string): Base64-encoded image data
    * mime_type (string): Image MIME type
  - model (string): Must be Nano Banana Pro (gemini-3-pro-image-preview)
  - aspect_ratio (string): Output aspect ratio
  - resolution (string): Output resolution (1K, 2K, 4K)

Returns:
  - success (boolean): Whether composition succeeded
  - imageData (string): Base64-encoded composed image
  - mimeType (string): Image MIME type
  - text (string): Any accompanying text
  - error (string): Error message if failed

Examples:
  - "Create a group photo of these 5 people at a beach"
  - "Apply the style of the first image to the subject in the second"
  - "Combine these product images into a catalog layout"`,
    inputSchema: ComposeImagesInputSchema,
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
    },
}, async (params) => {
    try {
        getApiKey();
        const images = params.images.map((img) => ({
            base64: img.base64,
            mimeType: img.mime_type,
        }));
        const result = await editImageWithReferences({
            prompt: params.prompt,
            images,
            model: params.model,
            aspectRatio: params.aspect_ratio,
            resolution: params.resolution,
        });
        const output = {
            success: true,
            model: MODELS.NANO_BANANA_PRO,
            prompt: params.prompt,
            imageCount: params.images.length,
            imageData: result.imageData,
            mimeType: result.mimeType,
            text: result.text,
        };
        let textContent = `✅ Images composed successfully\n\n`;
        textContent += `**Model:** ${MODELS.NANO_BANANA_PRO}\n`;
        textContent += `**Input Images:** ${params.images.length}\n`;
        textContent += `**Prompt:** ${params.prompt.substring(0, 100)}${params.prompt.length > 100 ? "..." : ""}\n`;
        if (result.text) {
            textContent += `\n**Model Response:**\n${result.text}\n`;
        }
        if (result.imageData) {
            textContent += `\n**Composed Image:** Base64 data available (${result.mimeType})\n`;
            textContent += `Data length: ${result.imageData.length} characters`;
        }
        return {
            content: [{ type: "text", text: textContent }],
            structuredContent: output,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return {
            content: [
                {
                    type: "text",
                    text: `❌ Image composition failed\n\n**Error:** ${errorMessage}`,
                },
            ],
            structuredContent: {
                success: false,
                model: MODELS.NANO_BANANA_PRO,
                prompt: params.prompt,
                error: errorMessage,
            },
        };
    }
});
// ============================================================================
// Tool: nanobanana_list_models
// ============================================================================
server.registerTool("nanobanana_list_models", {
    title: "List Nano Banana Models",
    description: `List available Nano Banana image generation models and their capabilities.

Returns information about:
- Model IDs for API calls
- Model names and descriptions
- Features and capabilities
- Maximum resolution supported

Args:
  - response_format (string): Output format. Options: 'markdown' (default), 'json'

Returns:
  - models: Array of model information objects with id, name, description, features, maxResolution`,
    inputSchema: ListModelsInputSchema,
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
    },
}, async (params) => {
    const output = { models: MODEL_INFO };
    if (params.response_format === "json") {
        return {
            content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
            structuredContent: output,
        };
    }
    // Markdown format
    let markdown = "# Nano Banana Image Generation Models\n\n";
    for (const model of MODEL_INFO) {
        markdown += `## ${model.name}\n\n`;
        markdown += `**Model ID:** \`${model.id}\`\n\n`;
        markdown += `${model.description}\n\n`;
        markdown += `**Max Resolution:** ${model.maxResolution}\n\n`;
        markdown += `**Features:**\n`;
        for (const feature of model.features) {
            markdown += `- ${feature}\n`;
        }
        markdown += "\n---\n\n";
    }
    markdown += "## Quick Reference\n\n";
    markdown += "| Model | Best For | Max Res |\n";
    markdown += "|-------|----------|--------|\n";
    markdown += "| Nano Banana Pro | Professional assets, text in images, 4K output | 4K |\n";
    markdown += "| Nano Banana | Fast iteration, batch processing | 1K |\n";
    return {
        content: [{ type: "text", text: markdown }],
        structuredContent: output,
    };
});
// ============================================================================
// Server Transport Setup
// ============================================================================
/**
 * Run server with stdio transport (for local/CLI use)
 */
async function runStdio() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Nano Banana MCP Server running on stdio");
}
/**
 * Validate bearer token from Authorization header
 */
function validateBearerToken(authHeader) {
    const expectedToken = process.env.MCP_AUTH_TOKEN;
    // If no token is configured, allow all requests (for backwards compatibility)
    if (!expectedToken) {
        console.warn("WARNING: MCP_AUTH_TOKEN not set - server is unauthenticated!");
        return true;
    }
    if (!authHeader) {
        return false;
    }
    // Support both "Bearer <token>" and raw token formats
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;
    return token === expectedToken;
}
/**
 * Run server with HTTP transport (for remote/web use)
 */
async function runHTTP() {
    const app = express();
    app.use(express.json({ limit: "50mb" })); // Large limit for base64 images
    // Health check endpoint (no auth required)
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", server: "nanobanana-mcp-server", version: "1.0.0" });
    });
    // MCP endpoint (auth required)
    app.post("/mcp", async (req, res) => {
        // Validate bearer token
        if (!validateBearerToken(req.headers.authorization)) {
            res.status(401).json({ error: "Unauthorized - invalid or missing bearer token" });
            return;
        }
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        });
        res.on("close", () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    const port = parseInt(process.env.PORT || "3000");
    app.listen(port, () => {
        console.error(`Nano Banana MCP Server running on http://localhost:${port}/mcp`);
    });
}
// ============================================================================
// Main Entry Point
// ============================================================================
const transport = process.env.TRANSPORT || "stdio";
if (transport === "http") {
    runHTTP().catch((error) => {
        console.error("Server error:", error);
        process.exit(1);
    });
}
else {
    runStdio().catch((error) => {
        console.error("Server error:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map