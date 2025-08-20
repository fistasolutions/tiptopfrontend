// Mock facility data based on the UI design
export interface Facility {
  id: number;
  name: string;
  address: string;
  contactInformation: string;
  status: "Active" | "Inactive";
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  contactName: string;
}

// Mock facilities data
const mockFacilities: Facility[] = [
  {
    id: 1,
    name: "City Hospital",
    address: "123 Medical Ave, Anytown, CA 91234",
    contactInformation: "555-1234",
    status: "Active",
    city: "Anytown",
    state: "CA",
    zipCode: "91234",
    phoneNumber: "555-1234",
    contactName: "Dr. Smith",
  },
  {
    id: 2,
    name: "County Clinic",
    address: "456 Health Rd, Anytown, CA 91235",
    contactInformation: "555-5678",
    status: "Active",
    city: "Anytown",
    state: "CA",
    zipCode: "91235",
    phoneNumber: "555-5678",
    contactName: "Dr. Johnson",
  },
  {
    id: 3,
    name: "Community Care Center",
    address: "789 Wellness Ln, Anytown, CA 91236",
    contactInformation: "555-9012",
    status: "Inactive",
    city: "Anytown",
    state: "CA",
    zipCode: "91236",
    phoneNumber: "555-9012",
    contactName: "Dr. Williams",
  },
  {
    id: 4,
    name: "Regional Medical Center",
    address: "1010 Recovery Blvd, Anytown, CA 91237",
    contactInformation: "555-3456",
    status: "Active",
    city: "Anytown",
    state: "CA",
    zipCode: "91237",
    phoneNumber: "555-3456",
    contactName: "Dr. Brown",
  },
  {
    id: 5,
    name: "Specialty Surgery Center",
    address: "1212 Surgical Ct, Anytown, CA 91238",
    contactInformation: "555-7890",
    status: "Active",
    city: "Anytown",
    state: "CA",
    zipCode: "91238",
    phoneNumber: "555-7890",
    contactName: "Dr. Davis",
  },
];

// Get all facilities
export const getFacilities = async (): Promise<Facility[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockFacilities;
};

// Get facility by ID
export const getFacilityById = async (id: number): Promise<Facility | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockFacilities.find((facility) => facility.id === id) || null;
};

// Create new facility
export const createFacility = async (
  facilityData: Omit<Facility, "id">
): Promise<Facility> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newFacility: Facility = {
    ...facilityData,
    id: Math.max(...mockFacilities.map((f) => f.id)) + 1,
  };
  mockFacilities.push(newFacility);
  return newFacility;
};

// Update facility
export const updateFacility = async (
  id: number,
  facilityData: Partial<Facility>
): Promise<Facility | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const facilityIndex = mockFacilities.findIndex(
    (facility) => facility.id === id
  );
  if (facilityIndex === -1) return null;

  mockFacilities[facilityIndex] = {
    ...mockFacilities[facilityIndex],
    ...facilityData,
  };
  return mockFacilities[facilityIndex];
};

// Delete facility
export const deleteFacility = async (id: number): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const facilityIndex = mockFacilities.findIndex(
    (facility) => facility.id === id
  );
  if (facilityIndex === -1) return false;

  mockFacilities.splice(facilityIndex, 1);
  return true;
};

// Toggle facility status
export const toggleFacilityStatus = async (
  id: number
): Promise<Facility | null> => {
  const facility = mockFacilities.find((f) => f.id === id);
  if (!facility) return null;

  const newStatus = facility.status === "Active" ? "Inactive" : "Active";
  return updateFacility(id, { status: newStatus });
};
