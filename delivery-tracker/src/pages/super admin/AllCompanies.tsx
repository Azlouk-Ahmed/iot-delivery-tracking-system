import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { DataTable, type Company } from "@/components/base/companies-table"
import { columns } from "@/components/base/companies-table"


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
]

function AllCompanies() {
  return (
    <div>
      
      <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">Companies</h1>
      <DataTable columns={columns} data={companies} />
    </div>
    </div>
  )
}

export default AllCompanies
