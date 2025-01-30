import { getAssetPath } from "@/core/helpers/assets";

interface ICustomer {
  id: number;
  name: string;
  email: string;
  company: string;
  payment: {
    icon: string;
    ccnumber: string;
    label: string;
  };
  date: string;
}

const customers: Array<ICustomer> = [
  {
    id: 1,
    name: "Emma Smith",
    email: "L2KkV@example.com", 
    company: "Google",
    payment: {
      icon: getAssetPath("media/svg/brand-logos/google.svg"),
      ccnumber: "1234 1234 1234 1234",
      label: "Visa",
    },
    date: "01/01/2022",
  },
];

export type { ICustomer };

export default customers;
