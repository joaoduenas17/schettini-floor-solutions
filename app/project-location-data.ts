import states from "./us-states.json" with { type: "json" };

export const usStates: { code: string; name: string }[] = states;
export const otherCity = "__other";

export function formatProjectLocation(state: string, city: string): string {
  const name = city.trim();
  if (!usStates.some((item) => item.code === state) || !name || name === otherCity || name.length > 100) return "";
  return `${name}, ${state}`;
}

export function projectLocationFromForm(fields: Pick<FormData, "get">): string {
  const text = (field: string) => {
    const value = fields.get(field);
    return typeof value === "string" ? value.trim() : "";
  };
  const city = text("projectCity");
  return formatProjectLocation(text("projectState"), city === otherCity ? text("projectCityOther") : city);
}

export async function loadStateCities(state: string, signal: AbortSignal): Promise<string[]> {
  if (!usStates.some((item) => item.code === state)) throw new Error("Unknown state");
  const response = await fetch(`/locations/2026/${state.toLowerCase()}.json`, { signal });
  if (!response.ok) throw new Error("City list unavailable");
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("state" in data) || data.state !== state || !("cities" in data) || !Array.isArray(data.cities) || !data.cities.length || !data.cities.every((city) => typeof city === "string" && city.trim() && city.length <= 100)) {
    throw new Error("Invalid city list");
  }
  return data.cities as string[];
}
