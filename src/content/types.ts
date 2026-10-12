import type { ComponentType } from "react";

export type EntryStatus = "experiment" | "pilot" | "production" | "retired";

export type EntryMeta = {
  slug: string;
  title: string;
  /** One line, at most 90 characters, written for the explainer reader. */
  pitch: string;
  tags: string[];
  status: EntryStatus;
  /** Absolute date, e.g. "12 Oct 2026". */
  updated: string;
  source: string;
};

export type Entry = {
  meta: EntryMeta;
  Art: ComponentType<{ className?: string }>;
  Explainer: ComponentType;
  Tech: ComponentType;
};
