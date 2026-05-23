export interface MockProperty {
  address: string;
  squareFootage: number;
  pitch: string;
  complexity: string;
  existingLayers: number;
}

export const MOCK_PROPERTY_DATABASE: Record<string, MockProperty> = {
  "640 bayview dr, aptos, ca 95003, usa": {
    address: "640 Bayview Dr, Aptos, CA 95003, USA",
    squareFootage: 3200,
    pitch: "8:12 (Steep)",
    complexity: "High",
    existingLayers: 2,
  },
  "641 bayview dr, aptos, ca 95003, usa": {
    address: "641 Bayview Dr, Aptos, CA 95003, USA",
    squareFootage: 2100,
    pitch: "4:12 (Walkable)",
    complexity: "Low",
    existingLayers: 1,
  },
  "1600 amphitheatre pkwy, mountain view, ca 94043, usa": {
    address: "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
    squareFootage: 4500,
    pitch: "5:12 (Walkable)",
    complexity: "Medium",
    existingLayers: 1,
  },
};

export function lookupMockProperty(inputAddress: string): MockProperty {
  const cleanInput = inputAddress.toLowerCase().trim();

  // 1. Check if we have an exact match for our testing addresses
  if (MOCK_PROPERTY_DATABASE[cleanInput]) {
    return MOCK_PROPERTY_DATABASE[cleanInput];
  }

  // 2. Fallback: If you type any random address, generate realistic bounds
  // using a deterministic method that doesn't feel entirely erratic
  return {
    address: inputAddress,
    squareFootage: 2400,
    pitch: "6:12 (Walkable)",
    complexity: "Medium",
    existingLayers: 1,
  };
}
