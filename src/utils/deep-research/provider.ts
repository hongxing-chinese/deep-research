import type { GoogleVertexProviderSettings } from "@ai-sdk/google-vertex/edge";
import type { AzureOpenAIProviderSettings } from "@ai-sdk/azure";
import type { LanguageModel } from "ai";

export interface AIProviderOptions {
  provider: string;
  baseURL: string;
  apiKey?: string;
  auth?: Record<string, string>;
  headers?: Record<string, string>;
  model: string;
  settings?: any;
}

export async function createAIProvider({
  provider,
  apiKey,
  baseURL,
  auth,
  headers,
  model,
}: AIProviderOptions): Promise<LanguageModel> {
  if (provider === "google") {
    const { createGoogleGenerativeAI } = await import("@ai-sdk/google");
    const google = createGoogleGenerativeAI({
      baseURL,
      apiKey,
    });
    return google(model) as LanguageModel;
  } else if (provider === "google-vertex") {
    const { createVertex } = await import("@ai-sdk/google-vertex/edge");
    const googleVertexOptions: GoogleVertexProviderSettings = {};
    if (auth) {
      googleVertexOptions.project = auth.project;
      googleVertexOptions.location = auth.location;
    }
    if (baseURL) {
      googleVertexOptions.baseURL = baseURL;
    }
    if (auth?.clientEmail && auth?.privateKey) {
      googleVertexOptions.googleCredentials = {
        clientEmail: auth.clientEmail,
        privateKey: auth.privateKey,
        privateKeyId: auth.privateKeyId,
      };
    }
    const googleVertex = createVertex(googleVertexOptions);
    return googleVertex(model) as LanguageModel;
  } else if (provider === "openai") {
    const { createOpenAI } = await import("@ai-sdk/openai");
    const openai = createOpenAI({
      baseURL,
      apiKey,
    });
    return (
      model.startsWith("gpt-4o") ||
      model.startsWith("gpt-4.1") ||
      model.startsWith("gpt-5")
        ? openai.responses(model)
        : openai(model)
    ) as LanguageModel;
  } else if (provider === "anthropic") {
    const { createAnthropic } = await import("@ai-sdk/anthropic");
    const anthropic = createAnthropic({
      baseURL,
      apiKey,
      headers,
    });
    return anthropic(model) as LanguageModel;
  } else if (provider === "deepseek") {
    const { createDeepSeek } = await import("@ai-sdk/deepseek");
    const deepseek = createDeepSeek({
      baseURL,
      apiKey,
    });
    return deepseek(model) as LanguageModel;
  } else if (provider === "xai") {
    const { createXai } = await import("@ai-sdk/xai");
    const xai = createXai({
      baseURL,
      apiKey,
    });
    return xai(model) as LanguageModel;
  } else if (provider === "mistral") {
    const { createMistral } = await import("@ai-sdk/mistral");
    const mistral = createMistral({
      baseURL,
      apiKey,
    });
    return mistral(model) as LanguageModel;
  } else if (provider === "azure") {
    const { createAzure } = await import("@ai-sdk/azure");
    const azureOptions: AzureOpenAIProviderSettings = {};
    if (auth) {
      azureOptions.resourceName = auth.resourceName;
      azureOptions.apiKey = auth.apiKey;
      azureOptions.apiVersion = auth.apiVersion;
    }
    if (baseURL) {
      azureOptions.baseURL = baseURL;
      azureOptions.apiKey = apiKey;
    }
    const azure = createAzure(azureOptions);
    return azure(model) as LanguageModel;
  } else if (provider === "openrouter") {
    const { createOpenRouter } = await import("@openrouter/ai-sdk-provider");
    const openrouter = createOpenRouter({
      baseURL,
      apiKey,
    });
    return openrouter(model) as LanguageModel;
  } else if (provider === "openaicompatible") {
    const { createOpenAICompatible } = await import(
      "@ai-sdk/openai-compatible"
    );
    const openaicompatible = createOpenAICompatible({
      name: "openaicompatible",
      baseURL,
      apiKey,
    });
    return openaicompatible(model) as LanguageModel;
  } else if (provider === "pollinations") {
    const { createOpenAICompatible } = await import(
      "@ai-sdk/openai-compatible"
    );
    const pollinations = createOpenAICompatible({
      name: "pollinations",
      baseURL,
      apiKey,
    });
    return pollinations(model) as LanguageModel;
  } else if (provider === "ollama") {
    const { createOllama } = await import("ollama-ai-provider");
    const local = global.location || {};
    const ollama = createOllama({
      baseURL,
      headers,
      fetch: async (input, init) => {
        const headers = (init?.headers || {}) as Record<string, string>;
        if (!baseURL?.startsWith(local.origin)) delete headers["Authorization"];
        return await fetch(input, {
          ...init,
          headers,
          credentials: "omit",
        });
      },
    });
    return ollama(model) as unknown as LanguageModel;
  } else {
    throw new Error("Unsupported Provider: " + provider);
  }
}
