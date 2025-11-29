import TeamMember from "@/components/base/TeamMember";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import useFetch from "@/hooks/useFetchData";
import type { Member } from "@/types/types";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosPublic } from "@/api/axios";
import { toast } from "sonner";

function SuperAdmin() {
  const { data, loading } = useFetch("/auth/drivers", { immediate: true });
  console.log("Fetched drivers data:", data);
  const [admins, setAdmins] = useState<Member[]>(data || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data && data.users) {
      setAdmins(data.users);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const response = await axiosPublic.post("/auth/staff", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "driver",
    });

    // Axios response data
    const result = response.data;

    // Add new admin to the list
    setAdmins((prev) => [...prev, result.user]);

    // Reset form and close dialog
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setFormErrors({});
    setIsDialogOpen(false);

    toast.success("Super admin created successfully!");
  } catch (error: any) {
    console.error("Error creating super admin:", error);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create super admin";

    toast.error(message);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">Drivers</h1>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button>Add new Super Admin</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Create Super Admin Account</AlertDialogTitle>
              <AlertDialogDescription>
                Enter the details below to create a new super admin account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.name && (
                    <FieldDescription className="text-destructive">
                      {formErrors.name}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.email && (
                    <FieldDescription className="text-destructive">
                      {formErrors.email}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.password && (
                    <FieldDescription className="text-destructive">
                      {formErrors.password}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.confirmPassword && (
                    <FieldDescription className="text-destructive">
                      {formErrors.confirmPassword}
                    </FieldDescription>
                  )}
                  {!formErrors.confirmPassword && (
                    <FieldDescription>
                      Must be at least 6 characters long.
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>
              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel type="button" disabled={isSubmitting}>
                  Cancel
                </AlertDialogCancel>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Account"}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="mt-6 w-full">
        <CardContent className="flex justify-between items-center">
          <Input placeholder="Search for super admins..." className="w-1/3" />
          <Select>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-3 w-3" />A to Z
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-3 w-3" />Z to A
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <div className="my-4 flex flex-wrap gap-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        ) : admins.length > 0 ? (
          admins.map((admin: Member) => (
            <TeamMember key={admin._id} member={admin} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No drivers found.
          </p>
        )}
      </div>
    </div>
  );
}

export default SuperAdmin;