/**
 * Type definitions for Nano Banana MCP Server
 */
// Model names
export const MODELS = {
    NANO_BANANA: "gemini-2.5-flash-image",
    NANO_BANANA_PRO: "gemini-3-pro-image-preview",
};
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
];
// Image resolutions (only for Nano Banana Pro)
export const RESOLUTIONS = ["1K", "2K", "4K"];
// Response format enum
export var ResponseFormat;
(function (ResponseFormat) {
    ResponseFormat["MARKDOWN"] = "markdown";
    ResponseFormat["JSON"] = "json";
})(ResponseFormat || (ResponseFormat = {}));
//# sourceMappingURL=types.js.map