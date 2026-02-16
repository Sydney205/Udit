import { twMerge } from "tailwind-merge";

export function mergeClasses(existing, incoming) {
    return twMerge(existing, incoming)
}