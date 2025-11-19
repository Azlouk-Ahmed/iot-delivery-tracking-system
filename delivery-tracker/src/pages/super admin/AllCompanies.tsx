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
      <div className="flex flex-wrap justify-between items-center gap-4 md:gap-12 mb-4">
        <Card className="flex-1  bg-[url('/img/total.png')] bg-cover bg-center bg-transparent">
            <CardContent>
             <div className="flex gap-4 items-center">
                <span className='font-bold text-4xl text-primary'>173</span>
                <span>Total Partners</span>
             </div>
            </CardContent>
        </Card>
        <Card className="flex-1  bg-[url('/img/active.png')] bg-cover bg-center !bg-transparent">
            <CardContent>
             <div className="flex gap-4 items-center">
                <span className='font-bold text-4xl text-[var(--blue)]'>153</span>
                <span>Active Partners</span>
             </div>
            </CardContent>
        </Card>
        <Card className="flex-1  bg-[url('/img/suspended.png')] bg-cover bg-center bg-transparent">
            <CardContent>
             <div className="flex gap-4 items-center">
                <span className='font-bold text-4xl text-[var(--destructive)]'>20</span>
                <span>Suspended Partners</span>
             </div>
            </CardContent>
        </Card>
 


      </div>
      <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">Companies</h1>
      <DataTable columns={columns} data={companies} />
    </div>
    </div>
  )
}

export default AllCompanies
