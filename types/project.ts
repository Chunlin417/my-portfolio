export interface Project {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  tech: string[];
  featured?: boolean;
  role?: string;
  stack?: string[];
  highlights?: string[];
  challenges?: string[];
  next?: string[];
  link?: string;
  github?: string;
  demo?: string;
}

export type ProjectCardVariant = "default" | "featured" | "compact";
