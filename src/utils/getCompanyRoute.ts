/**
 * Maps company names to their respective route paths.
 */
export const getCompanyRoute = (companyName: string): string => {
  const companyRoutes: Record<string, string> = {
    "Sekai Cars Sales Ltd.": "/companies/car-sales",
    "Sekai Farm Produce": "/companies/farm-produce",
    "My Kenya Food Station": "/companies/food-station",
  };

  return companyRoutes[companyName] || "/";
};
