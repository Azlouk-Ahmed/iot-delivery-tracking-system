import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type Company } from "@/components/base/companies-table";
import { columns } from "@/components/base/companies-table";
import { Skeleton } from "@/components/ui/skeleton";
import useFetch from "@/hooks/useFetchData";

function AllCompanies() {
  const { data, loading } = useFetch("/companies/all", {
    immediate: true,
  });

  // Skeleton Loader
  if (loading) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-semibold mb-6">Companies</h1>

        <Card className="p-4">
          <div className="space-y-4">
            {/* Row skeletons */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 border-b pb-4 last:border-none"
              >
                <Skeleton className="h-12 w-12 rounded-md" /> {/* image */}
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <Skeleton className="h-4 w-full" /> {/* name */}
                  <Skeleton className="h-4 w-full" /> {/* email */}
                  <Skeleton className="h-4 w-full" /> {/* location */}
                  <Skeleton className="h-4 w-full" /> {/* responsible */}
                </div>
                <Skeleton className="h-4 w-20" /> {/* phone */}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Map backend to table format
  const companies: Company[] = (data || []).map((item: any) => ({
    id: item._id,
    image: "https://via.placeholder.com/100", // temporary
    name: item.name,
    email: item.admins?.[0]?.email || "N/A",
    location: `${item.location?.city || ""}, ${item.location?.address || ""}`,
    responsible: item.admins?.[0]?.name || "No Admin",
    phone: item.phone || "N/A",
  }));

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">Companies</h1>
      <DataTable columns={columns} data={companies} />
    </div>
  );
}

export default AllCompanies;
