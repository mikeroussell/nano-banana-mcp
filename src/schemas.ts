/**
 * Zod schemas for Nano Banana MCP Server tool inputs
 */

import { z } from "zod";
import { ASPECT_RATIOS, RESOLUTIONS, MODELS } from "./types.js";

/**
 * Model selection schema
 */
export const ModelSchema = z
  .enum([MODELS.NANO_BANANA, MODELS.NANO_BANANA_PRO])
  .default(MODELS.NANO_BANANA_PRO)
  .describe(
    "Model to use. 'gemini-3-pro-image-preview' (Nano Banana Pro) for best quality and features, " +
      "'gemini-2.5-flash-image' (Nano Banana) for faster generation. Default: Nano Banana Pro"
  );

/**
 * Aspect ratio schema
 */
export const AspectRatioSchema = z
  .enum(ASPECT_RATIOS)
  .optional()
  .describe(
    "Aspect ratio of the generated image. Options: 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9. " +
      "Default: varies by prompt"
  );

/**
 * Resolution schema (only for Nano Banana Pro)
 */
export const ResolutionSchema = z
  .enum(RESOLUTIONS)
  .optional()
  .describe(
    "Resolution of the generated image (Nano Banana Pro only). Options: 1K, 2K, 4K. " +
      "Note: Must use uppercase 'K'. Default: 1K"
  );

/**
 * Schema for generate_image tool
 */
export const GenerateImageInputSchema = z
  .object({
    prompt: z
      .string()
      .min(1, "Prompt cannot be empty")
      .max(10000, "Prompt too long (max 10000 characters)")
      .describe(
        "Text description of the image to generate. Be descriptive for better results. " +
          "Include details about style, lighting, composition, colors, and mood."
      ),
    model: ModelSchema,
    aspect_ratio: AspectRatioSchema,
    resolution: ResolutionSchema,
    use_google_search: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "Enable Google Search grounding for real-time information (e.g., current weather, news). " +
          "Only available with Nano Banana Pro. Default: false"
      ),
  })
  .strict();

export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

/**
 * Schema for edit_image tool
 */
export const EditImageInputSchema = z
  .object({
    prompt: z
      .string()
      .min(1, "Prompt cannot be empty")
      .max(10000, "Prompt too long (max 10000 characters)")
      .describe(
        "Text description of the edit to make. Describe what to add, remove, or modify. " +
          "Be specific about the desired changes."
      ),
    image_base64: z
      .string()
      .min(1, "Image data cannot be empty")
      .describe(
        "Base64-encoded image data to edit. Do not include data URI prefix."
      ),
    image_mime_type: z
      .string()
      .regex(/^image\/(png|jpeg|jpg|gif|webp)$/, "Invalid MIME type")
      .describe(
        "MIME type of the image. Supported: image/png, image/jpeg, image/jpg, image/gif, image/webp"
      ),
    model: ModelSchema,
    aspect_ratio: AspectRatioSchema,
    resolution: ResolutionSchema,
  })
  .strict();

export type EditImageInput = z.infer<typeof EditImageInputSchema>;

/**
 * Schema for multi-image editing (compose_images tool)
 */
export const ComposeImagesInputSchema = z
  .object({
    prompt: z
      .string()
      .min(1, "Prompt cannot be empty")
      .max(10000, "Prompt too long (max 10000 characters)")
      .describe(
        "Text description of how to compose/combine the images. " +
          "Describe the desired scene, style transfer, or composition."
      ),
    images: z
      .array(
        z.object({
          base64: z.string().min(1, "Image data cannot be empty"),
          mime_type: z
            .string()
            .regex(/^image\/(png|jpeg|jpg|gif|webp)$/, "Invalid MIME type"),
        })
      )
      .min(1, "At least one image is required")
      .max(14, "Maximum of 14 images allowed")
      .describe(
        "Array of images to use as references. Up to 14 images total: " +
          "6 objects and 5 humans for character consistency. Each image needs base64 data and mime_type."
      ),
    model: z
      .literal(MODELS.NANO_BANANA_PRO)
      .default(MODELS.NANO_BANANA_PRO)
      .describe(
        "Model to use. Multi-image composition requires Nano Banana Pro (gemini-3-pro-image-preview)."
      ),
    aspect_ratio: AspectRatioSchema,
    resolution: ResolutionSchema,
  })
  .strict();

export type ComposeImagesInput = z.infer<typeof ComposeImagesInputSchema>;

/**
 * Schema for list_models tool
 */
export const ListModelsInputSchema = z
  .object({
    response_format: z
      .enum(["markdown", "json"])
      .optional()
      .default("markdown")
      .describe(
        "Output format: 'markdown' for human-readable or 'json' for machine-readable. Default: markdown"
      ),
  })
  .strict();

export type ListModelsInput = z.infer<typeof ListModelsInputSchema>;
