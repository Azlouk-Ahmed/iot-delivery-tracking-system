import TeamMember from "@/components/base/TeamMember";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import type { Member } from "@/types/types";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

const mockAdmins = [
{
_id: 1,
name: "Leslie Alexander",
avatar: "https://i.pravatar6.cc/150?img=1",
joinedDate: "Today, 10:30 PM",
phone: "809 555-0111",
email: "sara.cruz@example.com",
suspended: false,
},
{
_id: 2,
name: "John Doe",
avatar: "https://i.pravatar.cc/150?img=2",
joinedDate: "Yesterday",
phone: "555 123-4567",
email: "john@example.com",
suspended: true,
},
{
_id: 3,
name: "John Doe",
avatar: "https://i.pravatar.cc/150?img=2",
joinedDate: "Yesterday",
phone: "555 123-4567",
email: "john@example.com",
suspended: true,
},
{
_id: 4,
name: "John Doe",
avatar: "https://i.pravatar.cc/150?img=2",
joinedDate: "Yesterday",
phone: "555 123-4567",
email: "john@example.com",
suspended: true,
},
];
function Drivers() {
    const [admins, setAdmins] = useState(mockAdmins);
  return (
    <div>
      <div className="flex justify-between ">
        <h1 className="font-bold text-2xl">Drivers</h1>
        <Button>Add new Driver</Button>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-4 md:gap-12 mb-4 mt-6">
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
        {admins.length > 0 ? (
          admins.map((admin : Member) => (
            <TeamMember
              key={admin._id}
              member={admin}
             
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No admins found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Drivers;
