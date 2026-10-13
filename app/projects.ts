import photos from "./project-photos.json";

export type ProjectPhoto = {
  src: string;
  width: number;
  height: number;
  widths: number[];
  alt: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  segment: string;
  tags: string[];
  summary: string;
  photos: ProjectPhoto[];
};

export const heroPhoto: ProjectPhoto = photos["industrial-safety-lanes"];

export const projects: Project[] = [
  {
    id: "industrial-safety-lanes",
    title: "Industrial Floors & Safety Lanes",
    category: "Industrial Flooring",
    segment: "Industrial",
    tags: ["Industrial Flooring"],
    summary: "Finished concrete floors and clearly marked work zones throughout an active production facility. Explore the walkways, equipment bays, and finished floor details.",
    photos: [photos["industrial-safety-lanes"], photos["production-walkway"], photos["production-aisle"], photos["work-area-floor"], photos["equipment-bay"], photos["workshop-walkway"], photos["marked-work-zone"], photos["machinery-floor"]],
  },
  {
    id: "industrial-concrete-renewal",
    title: "Industrial Concrete Renewal",
    category: "Polished Concrete",
    segment: "Industrial",
    tags: ["Industrial Flooring", "Polished Concrete", "Surface Preparation"],
    summary: "A look at the mechanical preparation and finished concrete floor in an industrial space, from grinding with dust extraction to the completed surface.",
    photos: [photos["industrial-concrete-renewal"], photos["renewed-concrete-detail"], photos["mechanical-floor-preparation"], photos["concrete-grinding"]],
  },
  {
    id: "interior-concrete-finish",
    title: "Interior Concrete Finish",
    category: "Polished Concrete",
    segment: "Interior",
    tags: ["Polished Concrete"],
    summary: "Reflective concrete finishing in an enclosed interior. The photographs show the floor from eye level and close to the surface while adjacent areas remain protected.",
    photos: [photos["interior-concrete-finish"], photos["interior-floor-detail"]],
  },
  {
    id: "polished-aggregate",
    title: "Polished Aggregate Detail",
    category: "Polished Concrete",
    segment: "Finish detail",
    tags: ["Polished Concrete"],
    summary: "A closer look at the exposed aggregate, natural variations, and reflected light in a polished concrete finish.",
    photos: [photos["polished-aggregate"]],
  },
];

export const filters = ["All", "Industrial Flooring", "Polished Concrete", "Surface Preparation"];

export function photoSrcSet(photo: ProjectPhoto, format: "webp" | "avif") {
  return photo.widths.map((width) => {
    const suffix = width === photo.width ? "" : `-${width}`;
    return `${photo.src.replace(/\.webp$/, `${suffix}.${format}`)} ${width}w`;
  }).join(", ");
}
