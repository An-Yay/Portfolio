export interface NavItem {
  id: string;
  label: string;
}

/** Order here drives both the nav and the active-section observer. */
export const navItems: NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const sectionIds = navItems.map((item) => item.id);
