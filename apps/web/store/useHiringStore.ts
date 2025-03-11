import { create } from "zustand";
import { z } from "zod";

const accountSchema = z.object({
  plan: z.enum(["free", "preferred"]),
});

const contactSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "ZIP code must be at least 5 digits"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().refine((dob) => {
    // Check if user is over 18
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, { message: "You must be at least 18 years old" }),
});

const rolesSchema = z.object({
  onDemand: z.array(z.enum(["lawncare", "laundry", "lighting"])),
  warehouse: z.array(
    z.enum(["plumbing", "electrical", "carpentry", "general"])
  ),
});

export const formSchema = z.object({
  account: accountSchema,
  contact: contactSchema,
  roles: rolesSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type HiringState = z.infer<typeof formSchema> & {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateAccount: (account: z.infer<typeof accountSchema>) => void;
  updateContact: (contact: z.infer<typeof contactSchema>) => void;
  updateRoles: (roles: z.infer<typeof rolesSchema>) => void;
  reset: () => void;
};

const initialState: Omit<
  HiringState,
  "setCurrentStep" | "updateAccount" | "updateContact" | "updateRoles" | "reset"
> = {
  currentStep: 0,
  account: {
    plan: "free",
  },
  contact: {
    username: "",
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  },
  roles: {
    onDemand: [],
    warehouse: [],
  },
  password: "",
};

export const useHiringStore = create<HiringState>((set) => ({
  ...initialState,
  setCurrentStep: (step) => set({ currentStep: step }),
  updateAccount: (account) => set({ account }),
  updateContact: (contact) => set({ contact }),
  updateRoles: (roles) => set({ roles }),
  reset: () => set(initialState),
}));
