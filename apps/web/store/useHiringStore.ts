import { create } from "zustand";
import { z } from "zod";

const accountSchema = z.object({
  type: z.enum(["free", "preferred"]),
});

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
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
    type: "free",
  },
  contact: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
