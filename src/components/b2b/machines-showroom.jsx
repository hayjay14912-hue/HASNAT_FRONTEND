import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const MACHINE_CACHE_TTL_MS = 10 * 60 * 1000;
const MACHINE_CACHE_KEY = "nees:medical-devices:showroom-cache:v1";
let inMemoryShowroomCache = null;

const normalizeCachePayload = (payload) => {
  if (!payload || typeof payload !== "object") return null;

  const machines = Array.isArray(payload.machines) ? payload.machines : null;
  const brands = Array.isArray(payload.brands) ? payload.brands : null;
  const timestamp = Number(payload.timestamp);

  if (!machines || !brands || !Number.isFinite(timestamp) || timestamp <= 0) {
    return null;
  }

  return { machines, brands, timestamp };
};

const readShowroomCache = () => {
  if (inMemoryShowroomCache) {
    return normalizeCachePayload(inMemoryShowroomCache);
  }

  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(MACHINE_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const normalized = normalizeCachePayload(parsed);
    if (!normalized) return null;

    inMemoryShowroomCache = normalized;
    return normalized;
  } catch {
    return null;
  }
};

const writeShowroomCache = (machines, brands) => {
  const payload = normalizeCachePayload({
    machines: Array.isArray(machines) ? machines : [],
    brands: Array.isArray(brands) ? brands : [],
    timestamp: Date.now(),
  });

  if (!payload) return;

  inMemoryShowroomCache = payload;

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(MACHINE_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures (private mode/quota).
  }
};

const pickMachineArray = (payload) => {
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.machines)) return payload.machines;
  if (Array.isArray(payload.result)) return payload.result;
  return [];
};

const pickBrandArray = (payload) => {
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.result)) return payload.result;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.brands)) return payload.brands;
  return [];
};

const toBrandKey = (value) => String(value || "").trim().toLowerCase();
const toBrandName = (value) => {
  if (typeof value === "string") return String(value || "").trim();
  if (value && typeof value === "object") {
    return String(value.name || value.brandName || value.title || "").trim();
  }
  return "";
};

const toSafeUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return raw;
    return "";
  } catch {
    return "";
  }
};

const normalizeMachinesError = (message) => {
  const raw = String(message || "").trim();
  if (!raw) return "Machine catalog is temporarily unavailable. Please check again shortly.";
  const lowered = raw.toLowerCase();
  if (lowered.includes("not found")) {
    return "Machine catalog is being updated. Please check back shortly.";
  }
  return raw;
};

const MachinesShowroom = () => {
  const [machines, setMachines] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const cached = readShowroomCache();
      const cachedAgeMs = cached ? Date.now() - cached.timestamp : Number.POSITIVE_INFINITY;
      const hasFreshCache = cachedAgeMs < MACHINE_CACHE_TTL_MS;

      if (cached && !cancelled) {
        setMachines(cached.machines);
        setBrands(cached.brands);
        setError("");
        setLoading(false);
      }

      if (!API_BASE_URL) {
        if (!cancelled && !cached) {
          setError("Machine catalog is temporarily unavailable. Please check again shortly.");
          setLoading(false);
        }
        return;
      }

      if (hasFreshCache) return;
      if (!cached) {
        setLoading(true);
      }

      try {
        const [machinesResp, brandsResp] = await Promise.all([
          fetch(`${API_BASE_URL}/api/machines?active=true&limit=200&page=1`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/api/brand/active`, { cache: "no-store" }),
        ]);

        const machinesJson = await machinesResp.json().catch(() => ({}));
        const brandsJson = await brandsResp.json().catch(() => ({}));

        if (!machinesResp.ok) {
          throw new Error(machinesJson?.message || "Failed to load machines");
        }

        const nextMachines = pickMachineArray(machinesJson);
        const nextBrands = brandsResp.ok ? pickBrandArray(brandsJson) : [];
        writeShowroomCache(nextMachines, nextBrands);

        if (!cancelled) {
          setMachines(nextMachines);
          setBrands(nextBrands);
          setError("");
        }
      } catch (err) {
        if (!cancelled && !cached) {
          setMachines([]);
          setBrands([]);
          setError(normalizeMachinesError(err?.message || "Failed to load machines"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const brandLookup = useMemo(() => {
    const map = new Map();

    (Array.isArray(brands) ? brands : []).forEach((entry) => {
      const name = String(entry?.name || entry?.brandName || entry?.title || "").trim();
      if (!name) return;
      map.set(toBrandKey(name), {
        name,
        logo: String(entry?.logo || entry?.img || entry?.image || "").trim(),
        description: String(entry?.description || entry?.about || "").trim(),
      });
    });

    return map;
  }, [brands]);

  const groups = useMemo(() => {
    const grouped = new Map();

    (Array.isArray(machines) ? machines : []).forEach((entry) => {
      const isActive = entry?.isActive !== false;
      if (!isActive) return;

      const brandName = toBrandName(entry?.brand) || "Unbranded";
      const key = toBrandKey(brandName) || "unbranded";
      const current = grouped.get(key) || {
        brandName,
        machines: [],
      };

      current.machines.push({
        id: entry?._id || entry?.id || `${key}-${current.machines.length}`,
        name: String(entry?.name || "Machine").trim(),
        modelNumber: String(entry?.modelNumber || "").trim(),
        image: String(Array.isArray(entry?.images) ? entry.images[0] : "").trim(),
        href: toSafeUrl(entry?.productUrl),
      });

      grouped.set(key, current);
    });

    return Array.from(grouped.entries())
      .map(([key, value]) => {
        const fromBrand = brandLookup.get(key);
        return {
          key,
          brandName: fromBrand?.name || value.brandName,
          brandLogo: String(fromBrand?.logo || "").trim(),
          brandDescription: String(fromBrand?.description || "").trim(),
          brandHref: value.machines.find((m) => m.href)?.href || "",
          machines: value.machines,
        };
      })
      .filter((group) => group.machines.length > 0);
  }, [machines, brandLookup]);

  return (
    <section className="ids-machines-showcase">
      <div className="ids-machines-head">
        <h2>From Concept to Creation</h2>
        <p>Pioneering Laser Excellence through Innovation</p>
      </div>

      {loading && <div className="ids-machines-status">Loading machines...</div>}
      {!loading && error && <div className="ids-machines-status ids-machines-status-error">{error}</div>}
      {!loading && !error && groups.length === 0 && (
        <div className="ids-machines-status">No machines available right now.</div>
      )}

      {!loading && !error && groups.length > 0 &&
        groups.map((group, index) => {
          const isAlt = index % 2 === 1;
          const brandPanel = (
            <div className="ids-brand-rail">
              {group.brandHref ? (
                <a
                  href={group.brandHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ids-brand-link"
                  aria-label={`Open ${group.brandName}`}
                >
                  <div className="ids-brand-logo-shell">
                    {group.brandLogo ? (
                      <img src={group.brandLogo} alt={`${group.brandName} logo`} className="ids-brand-logo" loading="lazy" />
                    ) : (
                      <span className="ids-brand-fallback">{group.brandName}</span>
                    )}
                  </div>
                </a>
              ) : (
                <div className="ids-brand-link" aria-label={group.brandName}>
                  <div className="ids-brand-logo-shell">
                    {group.brandLogo ? (
                      <img src={group.brandLogo} alt={`${group.brandName} logo`} className="ids-brand-logo" loading="lazy" />
                    ) : (
                      <span className="ids-brand-fallback">{group.brandName}</span>
                    )}
                  </div>
                </div>
              )}

              <h3 className="ids-brand-name">{group.brandName}</h3>
              <p className="ids-brand-summary">
                {group.brandDescription || "Clinic-ready aesthetic device systems."}
              </p>
            </div>
          );

          return (
            <article key={group.key} className={`ids-brand-suite${isAlt ? " is-alt" : ""}`}>
              {brandPanel}
              <div className={`ids-machine-track ids-machine-track--${Math.min(group.machines.length, 3)}`}>
                {group.machines.map((machine) => {
                  const tile = (
                    <>
                      <div className="ids-machine-image-wrap">
                        {machine.image ? (
                          <img
                            src={machine.image}
                            alt={machine.modelNumber || machine.name}
                            className="ids-machine-image"
                            loading="lazy"
                          />
                        ) : (
                          <div className="ids-machine-image ids-machine-image-empty">No image</div>
                        )}
                      </div>
                      <h4 className="ids-machine-name">{machine.name}</h4>
                      <p className="ids-machine-model">{machine.modelNumber || "Model details available on request"}</p>
                      {machine.href && <span className="ids-machine-link">View Device</span>}
                    </>
                  );

                  if (!machine.href) {
                    return (
                      <div key={machine.id} className="ids-machine-item" aria-label={machine.name}>
                        {tile}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={machine.id}
                      href={machine.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ids-machine-item"
                      aria-label={`Open ${machine.name} ${machine.modelNumber}`}
                    >
                      {tile}
                    </a>
                  );
                })}
              </div>
            </article>
          );
        })}
    </section>
  );
};

export default MachinesShowroom;
