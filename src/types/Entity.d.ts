interface LoginFormValues {
  email: string;
  password: string;
}

interface User {
  _id: number;
  name: string;
  phone_number: string;
  email: string;
  role: string;
  createdAt: string;
}

interface LoginReturnValues {
  message: string;
  token: string;
  user: User;
}

interface SignupFormValues {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role: "admin" | "salesperson";
}

interface APIReturnResponse {
  message: string;
}

interface Company {
  _id: string;
  name: string;
}

interface InsuranceCompany {
  _id: string;
  name: string;
  createdAt: string;
}

interface InsuranceAgent {
  _id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  insuranceCompanyId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Car {
  _id: string;
  make: string;
  model: string;
  manufacturingYear: number;
  engineCapacity: string;
  chasisNo: string;
  engineNo: string;
  regNo: string;
  gearType: "Auto" | "Manual" | "Column";
  carType: "Petrol" | "Diesel" | "Electric";
  createdAt: string;
}

interface CarFormValues {
  title: string;
  make: string;
  model: string;
  manufacturing_year: string; // sent as year e.g. "2020"
  condition: "new" | "used" | "accident";
  body_type: string;
  engine?: string;
  cylinders?: string;
  doors?: string;
  horsepower?: string;
  fuel_type: string;
  gear_type: string;
  drive_train?: string;
  exterior_color?: string;
  interior_color?: string[];
  chasis_no: string;
  engineNo: string;
  regNo?: string;
  state: string;
  price: number;
  currency: string;
  mileage: number;
  mileage_unit: "km" | "mi";
  description?: string;
  should_list_on_website?: boolean;
}

interface CarMake {
  _id: string;
  name: string;
  models: string[];
  createdAt: string;
  updatedAt: string;
}

interface ColorType {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ColorFormValues {
  name: string;
}
interface CarsList {
  _id: string;
  make: string;
  model: string;
  manufacturing_year: number;
  fuel_type: string;
  gear_type: string;
  price: number;
  currency: string; // e.g. "USD", "JPY"
}
