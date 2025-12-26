# Nano Banana MCP Server

An MCP (Model Context Protocol) server for Google's **Nano Banana Pro** (Gemini 3 Pro Image) and **Nano Banana** (Gemini 2.5 Flash Image) AI image generation models.

## Features

- 🎨 **Text-to-Image Generation** - Create images from natural language descriptions
- ✏️ **Image Editing** - Modify existing images with text prompts
- 🖼️ **Multi-Image Composition** - Combine up to 14 reference images
- 📐 **Flexible Aspect Ratios** - 10 aspect ratio options (1:1, 16:9, 9:16, etc.)
- 🔍 **High Resolution** - Up to 4K output with Nano Banana Pro
- 🔤 **Text Rendering** - Generate images with accurate, legible text
- 🌐 **Google Search Grounding** - Real-time information for current events/weather

## Prerequisites

- Node.js 18 or higher
- Google AI API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Installation

### From Source

```bash
# Clone or download this directory
cd nanobanana-mcp-server

# Install dependencies
npm install

# Build the TypeScript
npm run build
```

### Configuration

Set your API key as an environment variable:

```bash
# Linux/macOS
export GEMINI_API_KEY="your-api-key-here"

# Windows (PowerShell)
$env:GEMINI_API_KEY="your-api-key-here"

# Windows (CMD)
set GEMINI_API_KEY=your-api-key-here
```

## Usage

### As stdio Server (for Claude Desktop, etc.)

```bash
npm start
```

Or directly:

```bash
node dist/index.js
```

### As HTTP Server

```bash
TRANSPORT=http PORT=3000 npm start
```

The server will listen at `http://localhost:3000/mcp`.

### Claude Desktop Configuration

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "nanobanana": {
      "command": "node",
      "args": ["/path/to/nanobanana-mcp-server/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

### `nanobanana_generate_image`

Generate images from text descriptions.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | string | Yes | Text description of the image |
| `model` | string | No | Model ID (default: `gemini-3-pro-image-preview`) |
| `aspect_ratio` | string | No | Aspect ratio (e.g., `1:1`, `16:9`) |
| `resolution` | string | No | Resolution: `1K`, `2K`, `4K` (Pro only) |
| `use_google_search` | boolean | No | Enable real-time info grounding (Pro only) |

**Example:**
```json
{
  "prompt": "A photorealistic portrait of an astronaut on Mars at sunset, dramatic lighting, 85mm lens",
  "model": "gemini-3-pro-image-preview",
  "aspect_ratio": "16:9",
  "resolution": "4K"
}
```

### `nanobanana_edit_image`

Edit an existing image using text prompts.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | string | Yes | Description of the edit |
| `image_base64` | string | Yes | Base64-encoded image data |
| `image_mime_type` | string | Yes | MIME type (e.g., `image/png`) |
| `model` | string | No | Model ID |
| `aspect_ratio` | string | No | Output aspect ratio |
| `resolution` | string | No | Output resolution (Pro only) |

**Example:**
```json
{
  "prompt": "Add a wizard hat to the cat",
  "image_base64": "<base64-image-data>",
  "image_mime_type": "image/png"
}
```

### `nanobanana_compose_images`

Compose images using multiple reference images (Nano Banana Pro only).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | string | Yes | Description of composition |
| `images` | array | Yes | Array of `{base64, mime_type}` objects (max 14) |
| `aspect_ratio` | string | No | Output aspect ratio |
| `resolution` | string | No | Output resolution |

**Example:**
```json
{
  "prompt": "Create a group photo of these 5 people at a beach party",
  "images": [
    {"base64": "<image1>", "mime_type": "image/jpeg"},
    {"base64": "<image2>", "mime_type": "image/jpeg"}
  ],
  "aspect_ratio": "16:9",
  "resolution": "2K"
}
```

### `nanobanana_list_models`

List available models and their capabilities.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `response_format` | string | No | `markdown` (default) or `json` |

## Models

### Nano Banana Pro (`gemini-3-pro-image-preview`)

Google's most advanced image generation model. Best for:
- Professional asset production
- Images with accurate text rendering
- Complex compositions
- High-resolution output (up to 4K)
- Real-time information grounding

### Nano Banana (`gemini-2.5-flash-image`)

Fast, low-latency image generation. Best for:
- Quick experimentation
- Batch processing
- Iterative design
- Cost-effective generation

## Aspect Ratios

| Ratio | Use Case |
|-------|----------|
| `1:1` | Square, social media posts |
| `16:9` | Landscape, presentations, YouTube thumbnails |
| `9:16` | Portrait, mobile screens, Stories |
| `4:3` | Classic photo format |
| `3:2` | DSLR photo format |
| `21:9` | Ultra-wide, cinematic |

## Tips for Best Results

### Prompting

1. **Be Descriptive**: Include details about style, lighting, composition, colors, and mood
2. **Use Photography Terms**: For photorealistic images, mention camera angles, lens types, lighting setups
3. **Specify Style**: "Oil painting", "3D render", "watercolor", "photorealistic", etc.
4. **Include Context**: Describe the environment, atmosphere, and mood

### Example Prompts

**Photorealistic:**
```
A photorealistic close-up portrait of an elderly Japanese ceramicist with 
deep wrinkles and a warm smile, inspecting a glazed tea bowl. Soft golden 
hour light from a window. Shot with 85mm portrait lens, bokeh background.
```

**Stylized:**
```
A kawaii-style sticker of a happy red panda wearing a bamboo hat, munching 
on a leaf. Bold outlines, cel-shading, vibrant colors. White background.
```

**Logo:**
```
Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. 
Clean, bold sans-serif font. Black and white. Circular design with a clever 
coffee bean element.
```

## Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "GEMINI_API_KEY is required" | Set the environment variable |
| Rate limit exceeded | Wait and retry, or reduce request frequency |
| Content policy violation | Modify prompt to comply with Google's policies |
| Invalid image format | Use supported formats: PNG, JPEG, GIF, WebP |

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run dev
```

## License

MIT

## Links

- [Google AI Studio](https://aistudio.google.com) - Get your API key
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs/image-generation) - Official documentation
- [MCP Protocol](https://modelcontextprotocol.io) - Learn about MCP
