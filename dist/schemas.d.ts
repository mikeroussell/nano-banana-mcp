/**
 * Zod schemas for Nano Banana MCP Server tool inputs
 */
import { z } from "zod";
/**
 * Model selection schema
 */
export declare const ModelSchema: z.ZodDefault<z.ZodEnum<["gemini-2.5-flash-image", "gemini-3-pro-image-preview"]>>;
/**
 * Aspect ratio schema
 */
export declare const AspectRatioSchema: z.ZodOptional<z.ZodEnum<["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]>>;
/**
 * Resolution schema (only for Nano Banana Pro)
 */
export declare const ResolutionSchema: z.ZodOptional<z.ZodEnum<["1K", "2K", "4K"]>>;
/**
 * Schema for generate_image tool
 */
export declare const GenerateImageInputSchema: z.ZodObject<{
    prompt: z.ZodString;
    model: z.ZodDefault<z.ZodEnum<["gemini-2.5-flash-image", "gemini-3-pro-image-preview"]>>;
    aspect_ratio: z.ZodOptional<z.ZodEnum<["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]>>;
    resolution: z.ZodOptional<z.ZodEnum<["1K", "2K", "4K"]>>;
    use_google_search: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strict", z.ZodTypeAny, {
    model: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview";
    prompt: string;
    use_google_search: boolean;
    aspect_ratio?: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9" | "21:9" | undefined;
    resolution?: "1K" | "2K" | "4K" | undefined;
}, {
    prompt: string;
    model?: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview" | undefined;
    aspect_ratio?: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9" | "21:9" | undefined;
    resolution?: "1K" | "2K" | "4K" | undefined;
    use_google_search?: boolean | undefined;
}>;
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;
/**
 * Schema for edit_image tool
 */
export declare const EditImageInputSchema: z.ZodObject<{
    prompt: z.ZodString;
    image_base64: z.ZodString;
    image_mime_type: z.ZodString;
    model: z.ZodDefault<z.ZodEnum<["gemini-2.5-flash-image", "gemini-3-pro-image-preview"]>>;
    aspect_ratio: z.ZodOptional<z.ZodEnum<["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]>>;
    resolution: z.ZodOptional<z.ZodEnum<["1K", "2K", "4K"]>>;
}, "strict", z.ZodTypeAny, {
    model: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview";
    prompt: string;
    image_base64: string;
    image_mime_type: string;
    aspect_ratio?: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9" | "21:9" | undefined;
    resolution?: "1K" | "2K" | "4K" | undefined;
}, {
    prompt: string;
    image_base64: string;
    image_mime_type: string;
    model?: "gemini-2.5-flash-image" | "gemini-3-pro-image-preview" | undefined;
    aspect_ratio?: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9" | "21:9" | undefined;
    resolution?: "1K" | "2K" | "4K" | undefined;
}>;
export type EditImageInput = z.infer<typeof EditImageInputSchema>;
/**
 * Schema for multi-image editing (compose_images tool)
 */
export declare const ComposeImagesInputSchema: z.ZodObject<{
    prompt: z.ZodString;
    images: z.ZodArray<z.ZodObject<{
        base64: z.ZodString;
        mime_type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        base64: string;
        mime_type: string;
    }, {
        base64: string;
        mime_type: string;
    }>, "many">;
    model: z.ZodDefault<z.ZodLiteral<"gemini-3-pro-image-preview">>;
    aspect_ratio: z.ZodOptional<z.ZodEnum<["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]>>;
    resolution: z.ZodOptional<z.ZodEnum<["1K", "2K", "4K"]>>;
}, "strict", z.ZodTypeAny, {
    model: "gemini-3-pro-image-preview";
    prompt: string;
    images: {
        base64: string;
        mime_type: string;
    }[];
    aspect_ratio?: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9" | "21:9" | undefined;
    resolution?: "1K" | "2K" | "4K" | undefined;
}, {
    prompt: string;
    images: {
        base64: string;
        mime_type: string;
    }[];
    model?: "gemini-3-pro-image-preview" | undefined;
    aspect_ratio?: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9" | "21:9" | undefined;
    resolution?: "1K" | "2K" | "4K" | undefined;
}>;
export type ComposeImagesInput = z.infer<typeof ComposeImagesInputSchema>;
/**
 * Schema for list_models tool
 */
export declare const ListModelsInputSchema: z.ZodObject<{
    response_format: z.ZodDefault<z.ZodOptional<z.ZodEnum<["markdown", "json"]>>>;
}, "strict", z.ZodTypeAny, {
    response_format: "markdown" | "json";
}, {
    response_format?: "markdown" | "json" | undefined;
}>;
export type ListModelsInput = z.infer<typeof ListModelsInputSchema>;
//# sourceMappingURL=schemas.d.ts.map