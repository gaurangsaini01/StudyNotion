import type { AccountType } from "./domain";

export interface NavLinkItem {
  title: string;
  path: string;
  icon?: string;
}

export interface SidebarLinkItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  type?: AccountType;
}

export interface FooterNestedLink {
  title: string;
  link: string;
}

export interface FooterGroup {
  title: string;
  links: FooterNestedLink[];
}

export interface ExploreCourse {
  heading: string;
  description: string;
  level: string;
  lessionNumber: number;
}

export interface HomeExploreCategory {
  tag: string;
  courses: ExploreCourse[];
}

export interface LearningGridItem {
  order: number;
  heading: string;
  highlightText?: string;
  description: string;
  BtnText?: string;
  BtnLink?: string;
}
