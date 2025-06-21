export const GenderOptions = ["male", "female", "other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/images/dr-green.png",
    name: "John Green",
    specialization: "Cardiology"
  },
  {
    image: "/images/dr-cameron.png",
    name: "Leila Cameron",
    specialization: "Cardiology"
  },
  {
    image: "/images/dr-livingston.png",
    name: "David Livingston",
    specialization: "Cardiology"
  },
  {
    image: "/images/dr-peter.png",
    name: "Evan Peter",
    specialization: "Cardiology"
  },
  {
    image: "/images/dr-powell.png",
    name: "Jane Powell",
    specialization: "Cardiology"
  },
  {
    image: "/images/dr-remirez.png",
    name: "Alex Ramirez",
    specialization: "Cardiology"
  },
  {
    image: "/images/dr-lee.png",
    name: "Jasmine Lee",
    specialization: "Cardiology"
  },
  {
    image: "/images/dr-cruz.png",
    name: "Alyana Cruz",
    specialization: "Cardiology"
  },
  {
    image: "/images/dr-sharma.png",
    name: "Hardik Sharma",
    specialization: "Cardiology"
  },
];

export const StatusIcon = {
  scheduled: "/check.svg",
  pending: "/pending.svg",
  cancelled: "/cancelled.svg",
};