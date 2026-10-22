import { useEffect, useRef, useState } from "react";
import type { Appearance } from "@bubbasfw/ui";
import { components } from "./showcase/catalog";
export type ReviewStatus = "pending" | "keep" | "change";
export interface Review {
  status: ReviewStatus;
  note: string;
  updatedAt: string;
}
export type Reviews = Record<string, Review>;
const prefix = "bubbas-ui-review-v2:";
const appearanceKey = `${prefix}appearance`;
const entryKey = (name: string) => `${prefix}component:${name}`;
const validAppearance = (value: unknown): value is Appearance =>
  ["light", "dark", "system"].includes(value as string);
function parseReview(value: string | null): Review | undefined {
  if (!value) return;
  try {
    const item = JSON.parse(value) as Partial<Review> | null;
    if (
      item &&
      ["pending", "keep", "change"].includes(item.status || "") &&
      typeof item.note === "string" &&
      typeof item.updatedAt === "string" &&
      Number.isFinite(Date.parse(item.updatedAt))
    )
      return item as Review;
  } catch {
    /* Ignore malformed entries without hiding healthy feedback. */
  }
}
function readLegacyReviews() {
  const reviews: Reviews = {};
  let legacy: { reviews?: Record<string, unknown> };
  try {
    legacy = JSON.parse(localStorage.getItem("bubbas-ui-review-v1") || "{}");
  } catch {
    return reviews;
  }
  for (const { name } of components) {
    const item = parseReview(JSON.stringify(legacy?.reviews?.[name]) || null);
    if (item) reviews[name] = item;
  }
  return reviews;
}
function readReviews() {
  const reviews = readLegacyReviews();
  for (const { name } of components) {
    const item = parseReview(localStorage.getItem(entryKey(name)));
    if (
      item &&
      (!reviews[name] ||
        Date.parse(item.updatedAt) >= Date.parse(reviews[name].updatedAt))
    )
      reviews[name] = item;
  }
  return reviews;
}
function mergeReviews(first: Reviews, second: Reviews) {
  const merged = { ...first };
  for (const [name, review] of Object.entries(second)) {
    if (
      !merged[name] ||
      Date.parse(review.updatedAt) >= Date.parse(merged[name].updatedAt)
    )
      merged[name] = review;
  }
  return merged;
}
function migrateLegacy() {
  const legacy = JSON.parse(
    localStorage.getItem("bubbas-ui-review-v1") || "{}",
  );
  for (const { name } of components) {
    if (!localStorage.getItem(entryKey(name)) && legacy.reviews?.[name]) {
      const item = parseReview(JSON.stringify(legacy.reviews[name]));
      if (item) localStorage.setItem(entryKey(name), JSON.stringify(item));
    }
  }
  if (
    !localStorage.getItem(appearanceKey) &&
    validAppearance(legacy.appearance)
  )
    localStorage.setItem(appearanceKey, legacy.appearance);
}
export function useReview() {
  const [reviews, setReviews] = useState<Reviews>({});
  const reviewRef = useRef(reviews);
  reviewRef.current = reviews;
  const [appearance, setLocalAppearance] = useState<Appearance>("light");
  const appearanceRef = useRef<Appearance>(appearance);
  const appearanceWriteFailed = useRef(false);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const load = () => {
      try {
        const storedReviews = readReviews();
        setReviews((current) => mergeReviews(current, storedReviews));
        const storedAppearance = localStorage.getItem(appearanceKey);
        if (
          validAppearance(storedAppearance) &&
          !appearanceWriteFailed.current
        ) {
          appearanceRef.current = storedAppearance;
          setLocalAppearance(storedAppearance);
        }
      } catch {
        setStorageError(true);
      }
    };
    const synchronize = (event: StorageEvent) => {
      if (event.key === null || event.key.startsWith(prefix)) load();
    };
    window.addEventListener("storage", synchronize);
    try {
      migrateLegacy();
    } catch {
      setStorageError(true);
    }
    load();
    setReady(true);
    return () => window.removeEventListener("storage", synchronize);
  }, []);
  const update = (name: string, patch: Partial<Review>) => {
    let previous = reviewRef.current[name];
    try {
      const stored = parseReview(localStorage.getItem(entryKey(name)));
      if (
        stored &&
        (!previous ||
          Date.parse(stored.updatedAt) > Date.parse(previous.updatedAt))
      )
        previous = stored;
    } catch {
      setStorageError(true);
    }
    const milliseconds = Math.max(
      Date.now(),
      previous ? Date.parse(previous.updatedAt) + 1 : 0,
    );
    const next: Review = {
      ...(previous || { status: "pending", note: "" }),
      ...patch,
      updatedAt: new Date(milliseconds).toISOString(),
    };
    try {
      localStorage.setItem(entryKey(name), JSON.stringify(next));
    } catch {
      setStorageError(true);
    }
    reviewRef.current = { ...reviewRef.current, [name]: next };
    setReviews((current) => ({ ...current, [name]: next }));
  };
  const setAppearance = (value: Appearance) => {
    appearanceRef.current = value;
    setLocalAppearance(value);
    try {
      localStorage.setItem(appearanceKey, value);
      appearanceWriteFailed.current = false;
    } catch {
      appearanceWriteFailed.current = true;
      setStorageError(true);
    }
  };
  const exportReviews = () => {
    let latest = reviewRef.current;
    let latestAppearance = appearanceRef.current;
    try {
      latest = mergeReviews(latest, readReviews());
      const storedAppearance = localStorage.getItem(appearanceKey);
      if (validAppearance(storedAppearance) && !appearanceWriteFailed.current)
        latestAppearance = storedAppearance;
    } catch {
      setStorageError(true);
    }
    const content = JSON.stringify(
      {
        package: "@bubbasfw/ui",
        version: "0.3.1",
        exportedAt: new Date().toISOString(),
        appearance: latestAppearance,
        reviews: latest,
      },
      null,
      2,
    );
    const url = URL.createObjectURL(
      new Blob([content], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "bubbas-ui-review.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return {
    reviews,
    appearance,
    setAppearance,
    update,
    exportReviews,
    storageError,
    ready,
  };
}
