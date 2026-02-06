const getCrewCount = (serviceType, capacityValue, capacityUnit) => {
  serviceType = serviceType.toLowerCase();
  capacityUnit = capacityUnit.toLowerCase();

  // HOUSE SHIFT RULES
  if (serviceType === "houseshift" && capacityUnit === "bhk") {
    if (capacityValue === 1) return 2; // 1 BHK → 2 crew
    if (capacityValue === 2) return 4; // 2 BHK → 4 crew
    if (capacityValue === 3) return 5; // 3 BHK → 5 crew

    throw new Error("Houseshift supports only up to 3 BHK");
  }

  // DEFAULT FALLBACK (OTHER SERVICES)
  if (capacityValue <= 1) return 2;
  if (capacityValue === 2) return 3;
  return 4;
};
export default getCrewCount;