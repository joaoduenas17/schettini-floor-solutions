"use client";

import { useEffect, useState } from "react";
import { formatProjectLocation, loadStateCities, otherCity, usStates } from "./project-location-data";

const cityCache = new Map<string, string[]>();

export function ProjectLocation({ onLoadingChange }: { onLoadingChange: (loading: boolean) => void }) {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    if (!state) return;
    const cached = cityCache.get(state);
    if (cached) {
      setCities(cached);
      setStatus("ready");
      onLoadingChange(false);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let active = true;
    loadStateCities(state, controller.signal).then((list) => {
      if (!active) return;
      cityCache.set(state, list);
      setCities(list);
      setStatus("ready");
    }).catch(() => {
      if (active) setStatus("error");
    }).finally(() => {
      clearTimeout(timeout);
      if (active) onLoadingChange(false);
    });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [state, onLoadingChange]);

  const manual = status === "error" || city === otherCity;
  const location = formatProjectLocation(state, manual ? manualCity : city);

  return (
    <fieldset className="project-location">
      <legend>Project location</legend>
      <div className="form-row">
        <label htmlFor="project-state">
          <span className="form-label">State <span className="required-mark" aria-hidden="true">*</span></span>
          <select id="project-state" name="projectState" autoComplete="address-level1" required value={state} onChange={(event) => {
            const next = event.target.value;
            setState(next); setCity(""); setManualCity(""); setCities([]);
            setStatus(next ? "loading" : "idle"); onLoadingChange(Boolean(next));
          }}>
            <option value="">Select a state</option>
            {usStates.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
          </select>
        </label>
        <label htmlFor="project-city">
          <span className="form-label">City / town <span className="required-mark" aria-hidden="true">*</span></span>
          {status === "error" ? (
            <input id="project-city" name="projectCity" autoComplete="address-level2" required maxLength={100} pattern={".*\\S.*"} title="Enter a city or town name." placeholder="Enter your city or town" value={manualCity} onChange={(event) => setManualCity(event.target.value)} aria-describedby="project-city-status" />
          ) : (
            <select id="project-city" name="projectCity" autoComplete="address-level2" required value={city} disabled={!state || status === "loading"} aria-describedby="project-city-status" onChange={(event) => { setCity(event.target.value); setManualCity(""); }}>
              <option value="">{!state ? "Select a state first" : status === "loading" ? "Loading cities…" : "Select a city or town"}</option>
              {cities.map((name) => <option key={name} value={name}>{name}</option>)}
              {status === "ready" && <option value={otherCity}>Other city or town</option>}
            </select>
          )}
        </label>
      </div>
      {city === otherCity && status !== "error" && (
        <label className="manual-city" htmlFor="project-city-other">
          <span className="form-label">City or town name <span className="required-mark" aria-hidden="true">*</span></span>
          <input id="project-city-other" name="projectCityOther" autoComplete="address-level2" required maxLength={100} pattern={".*\\S.*"} title="Enter a city or town name." placeholder="Enter your city or town" value={manualCity} onChange={(event) => setManualCity(event.target.value)} />
        </label>
      )}
      <p id="project-city-status" className="location-note" role="status">
        {status === "loading" ? "Loading cities and towns…" : status === "error" ? "The city list is unavailable. You can enter your city or town above." : state ? "Can’t find your city? Choose Other city or town." : "Choose a state to see its cities and towns."}
      </p>
      <input type="hidden" name="location" value={location} />
    </fieldset>
  );
}
