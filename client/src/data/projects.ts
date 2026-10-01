/**
 * Design reminder: Galería Nocturna — este módulo centraliza el contenido
 * editorial de los casos de estudio, separado de la presentación visual.
 */

export type ProjectAccent = "lime" | "green" | "terra" | "red";

export interface PortfolioProject {
  number: string;
  title: string;
  type: string;
  category: string;
  location: string;
  tools: string;
  summary: string;
  image: string;
  accent: ProjectAccent;
  label: string;
}

export const projects: PortfolioProject[] = [
  {
    number: "01",
    title: "Colab",
    type: "Digital operations system",
    category: "Brand identity · Social media",
    location: "United Kingdom",
    tools: "Illustrator, Photoshop, Canva",
    summary:
      "A vivid, flexible identity for an operating system that brings restaurants, suppliers and service teams into one rhythm.",
    image: "/manus-storage/case-colab_9655ca53.jpg",
    accent: "lime",
    label: "One hub. Zero noise.",
  },
  {
    number: "02",
    title: "FoodPoint",
    type: "Fresh food distribution",
    category: "Brand identity · Campaign assets",
    location: "United Kingdom",
    tools: "Illustrator, Photoshop, Canva",
    summary:
      "A clean visual system designed to travel: from electric vehicles and uniforms to packaging, photography and everyday communications.",
    image: "/manus-storage/case-foodpoint_3a7770b9.jpg",
    accent: "green",
    label: "Freshness, made visible.",
  },
  {
    number: "03",
    title: "Tierra Mía",
    type: "Artisan coffee shop",
    category: "Brand identity · Packaging",
    location: "Valencia, Spain",
    tools: "Illustrator, Photoshop, Canva",
    summary:
      "A tactile identity built around local culture, nature and the slow ritual of artisan coffee—made for shelves, hands and conversation.",
    image: "/manus-storage/case-tierra-mia_a1e0d6f5.jpg",
    accent: "terra",
    label: "Rooted in the ritual.",
  },
  {
    number: "04",
    title: "Bitaxus",
    type: "Digital payments platform",
    category: "Brand identity · Product communication",
    location: "Colombia",
    tools: "Illustrator, Photoshop, Canva",
    summary:
      "A trustworthy, scalable visual language for a digital platform that simplifies money transfers through WhatsApp.",
    image: "/manus-storage/case-bitaxus_9e47886a.jpg",
    accent: "red",
    label: "Currency, in context.",
  },
];
