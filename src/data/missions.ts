export type MissionStatus =
  | "ACTIVE"
  | "READY"
  | "COMPLETE";

export interface Mission {
  id: string;
  code: string;
  title: string;
  description: string;
  location: string;
  distance: string;
  status: MissionStatus;
  progress: number;
}

export const missions: Mission[] = [
  {
    id: "exp-001",
    code: "E-001",
    title: "FIRST CONTACT",
    description:
      "Begin your first expedition and define the initial objective.",
    location: "ORIGIN",
    distance: "0.0 KM",
    status: "ACTIVE",
    progress: 38,
  },
  {
    id: "exp-002",
    code: "E-002",
    title: "UNKNOWN SECTOR",
    description:
      "Explore an unfamiliar location and record three observations.",
    location: "SECTOR 07",
    distance: "2.4 KM",
    status: "READY",
    progress: 0,
  },
  {
    id: "exp-003",
    code: "E-003",
    title: "ARCHIVE",
    description:
      "Document something worth remembering.",
    location: "MEMORY",
    distance: "N/A",
    status: "READY",
    progress: 0,
  },
];
