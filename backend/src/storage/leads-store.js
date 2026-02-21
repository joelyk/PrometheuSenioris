import fs from "node:fs/promises";
import path from "node:path";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getNextId(leads) {
  let maxId = 0;
  for (const lead of leads) {
    const id = toNumber(lead?.id);
    if (id !== null && id > maxId) {
      maxId = id;
    }
  }
  return maxId + 1;
}

export function createLeadsStore({ persistPath } = {}) {
  const resolvedPath = persistPath ? path.resolve(persistPath) : "";
  const state = {
    leads: [],
    nextId: 1,
    loaded: false,
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
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        state.leads = data;
      }
    } catch (error) {
      if (error?.code !== "ENOENT") {
        // eslint-disable-next-line no-console
        console.warn("Leads store load failed:", error.message);
      }
    } finally {
      state.nextId = getNextId(state.leads);
    }
  }

  async function persist() {
    if (!resolvedPath) return;

    await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
    await fs.writeFile(resolvedPath, JSON.stringify(state.leads, null, 2), "utf8");
  }

  function list() {
    return state.leads.slice();
  }

  async function add(lead) {
    await loadIfNeeded();

    const toStore = { ...lead, id: state.nextId++ };
    state.leads.push(toStore);

    state.writeChain = state.writeChain.then(persist).catch((error) => {
      // eslint-disable-next-line no-console
      console.warn("Leads store persist failed:", error.message);
    });

    await state.writeChain;
    return toStore;
  }

  return {
    loadIfNeeded,
    list,
    add,
    persistPath: resolvedPath
  };
}

