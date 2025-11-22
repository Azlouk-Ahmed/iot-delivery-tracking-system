import { ChartBarDefault } from "@/components/base/BarChart";
import { ChartRadarGridCircleNoLines } from "@/components/base/ChartRadar";
import { ChartLineDots } from "@/components/base/LineChart";
import React from "react";
import { DataTable, type Company } from "@/components/base/companies-table";
import { columns } from "@/components/base/companies-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/hooks/useAuthContext";

const companies: Company[] = [
  {
    id: "1",
    image: "https://via.placeholder.com/100",
    name: "TechFlow",
    email: "contact@techflow.com",
    location: "Tunis, Tunisia",
    responsible: "Ahmed Azlouk",
    phone: "+216 22 123 456",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/100",
    name: "SkyLink",
    email: "info@skylink.io",
    location: "Sousse, Tunisia",
    responsible: "Boris Taleb",
    phone: "+216 55 654 321",
  },
];

function Dashboard() {
  const { user } = useAuthContext();
  return (
    <div>
      <div className="p-4 bg-primary/30 rounded-2xl">
        <div className="flex gap-4 items-center">
        <Avatar className="w-28 h-28">
          <AvatarImage src={user?.photo} />
          <AvatarFallback>{user?.name[0] + user?.name[1]}</AvatarFallback>
        </Avatar>
<div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-2xl font-bold">Welcome Back, <span className="text-primary">{user?.name}</span></span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-4 md:gap-12 mb-4 mt-6 items-stretch">
        <ChartLineDots />
        <ChartBarDefault />
        <ChartRadarGridCircleNoLines />
      </div>
      <div className="p-10">
        <h1 className="text-2xl font-semibold mb-6">Companies</h1>
        <DataTable columns={columns} data={companies} />
      </div>
    </div>
  );
}

export default Dashboard;
