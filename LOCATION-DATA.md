# Project location lists

Source: U.S. Census Bureau, **2026 Gazetteer Files**.

- https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html
- https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2026_Gazetteer/2026_Gaz_state_national.zip
- https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2026_Gazetteer/2026_Gaz_place_national.zip

The form covers the 50 states and Washington, DC. City lists include incorporated
places and census-designated places. Administrative suffixes such as `city`,
`town` and `CDP` are removed, duplicate display names within a state are combined,
and an **Other city or town** option allows locations outside the catalog.

To regenerate the lists, download and extract the two national files into a
temporary folder and run:

```bash
python3 scripts/prepare-us-locations.py /path/to/gazetteer-files
```

The generated state list is bundled with the form; only the selected state's
city file is requested from the website. No location API, API key, visitor
geolocation or third-party city lookup is used. A failed or timed-out city
request falls back to a required text field. Changing the state clears the
previous city and cancels any pending request. Successful submission resets
both selectors.
