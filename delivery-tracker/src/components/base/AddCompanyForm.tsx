import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import useFetch from "@/hooks/useFetchData";
import { axiosPublic } from "@/api/axios";

export function AddCompanyForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  // Fetch admins list
  const { data: admins } = useFetch("/auth/admins", { immediate: true });
  console.log("Fetched admins for company form:", admins);


  const handleAdminCheck = (id: string) => {
    setSelectedAdmins((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const form = new FormData(e.currentTarget as HTMLFormElement);

  const payload = {
    name: form.get("name"),
    location: {
      address: form.get("address"),
      city: form.get("city"),
      latitude: Number(form.get("latitude")),
      longitude: Number(form.get("longitude")),
    },
    phone: form.get("phone"),
    admins: selectedAdmins,
  };

  console.log("Submitting company:", payload);

  try {
    const { data } = await axiosPublic.post("/companies", payload);

    console.log("Company created:", data);


    setSelectedAdmins([]);

    // toast.success("Company created successfully!");
  } catch (error: any) {
    console.error("Create company error:", error);
    // toast.error(error?.response?.data?.message || "Failed to create company");
  }
};


  return (
    <Card {...props} className="w-full md:w-1/2 mx-auto">
      <CardHeader>
        <CardTitle>Add a New Company</CardTitle>
        <CardDescription>
          Fill in the details to register a new delivery company.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {/* NAME */}
            <Field>
              <FieldLabel htmlFor="name">Company Name</FieldLabel>
              <Input id="name" name="name" type="text" required />
            </Field>

            {/* LOCATION */}
            <Field>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input id="address" name="address" type="text" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input id="city" name="city" type="text" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                required
              />
            </Field>

            {/* PHONE */}
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input id="phone" name="phone" type="text" />
            </Field>

            {/* ADMINS MULTI-SELECT */}
            <Field>
              <FieldLabel>Assign Company Admins</FieldLabel>

              <div className="flex flex-col gap-2 border rounded-md p-3">
                {admins?.users.length ? (
                  admins.users.map((admin: any) => (
                    <div className="flex items-center gap-2" key={admin._id}>
                      <Checkbox
                        checked={selectedAdmins.includes(admin._id)}
                        onCheckedChange={() => handleAdminCheck(admin._id)}
                      />
                      <span>{admin.name} ({admin.email})</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No admins found.</p>
                )}
              </div>

              <FieldDescription>
                You can assign multiple admins to manage this company.
              </FieldDescription>
            </Field>

            {/* SUBMIT */}
            <Field className="pt-4">
              <Button type="submit">Create Company</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
