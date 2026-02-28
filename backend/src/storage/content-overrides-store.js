import fs from "node:fs/promises";
import path from "node:path";

function isAllowedPath(value) {
  if (!value) return false;
  return value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://");
}

function sanitizePath(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.length > 500) return "";
  return isAllowedPath(text) ? text : "";
}

export function sanitizeContentOverrides(input = {}) {
  const heroImagePath = sanitizePath(input.heroImagePath);
  const moduleImages = {};

  if (input.moduleImages && typeof input.moduleImages === "object") {
    for (const [moduleId, imagePath] of Object.entries(input.moduleImages)) {
      const safeModuleId = String(moduleId || "").trim().slice(0, 120);
      const safeImagePath = sanitizePath(imagePath);
      if (safeModuleId && safeImagePath) {
        moduleImages[safeModuleId] = safeImagePath;
      }
    }
  }

  return {
    heroImagePath,
    moduleImages
  };
}

export function createContentOverridesStore({ persistPath } = {}) {
  const resolvedPath = persistPath ? path.resolve(persistPath) : "";
  const state = {
    loaded: false,
    overrides: {
      heroImagePath: "",
      moduleImages: {}
    },
    writeChain: Promise.resolve()
  };

  async function loadIfNeeded() {
    if (state.loaded) return;
    state.loaded = true;

    if (!resolvedPath) {
      return;
    }

    try {
      const raw = await fs.readFile(resolvedPath, "utf8");
      const parsed = JSON.parse(raw);
      state.overrides = sanitizeContentOverrides(parsed);
    } catch (error) {
      if (error?.code !== "ENOENT") {
        // eslint-disable-next-line no-console
        console.warn("Content overrides load failed:", error.message);
      }
    }
  }

  async function persist() {
    if (!resolvedPath) return;
    await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
    await fs.writeFile(resolvedPath, JSON.stringify(state.overrides, null, 2), "utf8");
  }

  function get() {
    return {
      heroImagePath: state.overrides.heroImagePath,
      moduleImages: { ...state.overrides.moduleImages }
    };
  }

  async function replace(nextOverrides) {
    await loadIfNeeded();
    state.overrides = sanitizeContentOverrides(nextOverrides);
    state.writeChain = state.writeChain.then(persist).catch((error) => {
      // eslint-disable-next-line no-console
      console.warn("Content overrides persist failed:", error.message);
    });
    await state.writeChain;
    return get();
  }

  return {
    loadIfNeeded,
    get,
    replace,
    persistPath: resolvedPath
  };
}
