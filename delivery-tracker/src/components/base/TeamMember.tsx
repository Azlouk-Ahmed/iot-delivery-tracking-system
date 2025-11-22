import type { MemberCardProps } from "@/types/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    Ban,
  LetterText,
  LetterTextIcon,
  Mail,
  Phone,
  Settings2,
  ShieldCheck,
} from "lucide-react";

function TeamMember({ member }: MemberCardProps) {
  return (
    <Card className="w-full md:w-[30%]">
      <CardHeader className="flex justify-between w-full">
        <div className="flex gap-4">
          <Avatar className="w-[3rem] h-[3rem]">
            <AvatarImage src={member?.avatar} />
            <AvatarFallback>{member?.name[0] + member?.name[1]}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col h-full justify-between">
            <span className="font-medium">{member?.name}</span>
            <span className="text-sm text-muted-foreground">
              {member?.joinedDate}
            </span>
          </div>
        </div>
        <span>
          {" "}
          <Settings2 />{" "}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
          <Phone size={15} /> <span>{member.phone}</span>
        </div>
        <div className="flex gap-4 items-center">
          <Mail size={15} /> <span>{member.email}</span>
        </div>
      </CardContent>
      <CardFooter>
        {
            member.suspended ? (
                <span className="text-red-600 font-medium flex items-center gap-2 bg-red-600/10 px-2.5 rounded text-xs">
                <Ban size={15} /> Suspended
                </span>
            ) : (
                <span className="text-green-600 font-medium flex items-center gap-2 text-xs bg-green-600/10 p-1 px-2.5 rounded">
                <ShieldCheck size={15} /> Active
                </span>
            )
        }
 
      </CardFooter>
    </Card>
  );
}

export default TeamMember;
