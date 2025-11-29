import type { MemberCardProps } from "@/types/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Mail,
  Settings2,
  User2,
} from "lucide-react";

function TeamMember({ member }: MemberCardProps) {
  return (
    <Card className="w-full md:w-[30%]">
      <CardHeader className="flex justify-between w-full">
        <div className="flex gap-4">
          <Avatar className="w-[3rem] h-[3rem]">
            <AvatarImage src={member?.photo} />
            <AvatarFallback>{member?.name[0] + member?.name[1]}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col h-full justify-between">
            <span className="font-medium">{member?.name}</span>
            <span className="text-sm text-muted-foreground">
              {member?.createdAt}
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
          <User2 size={15} /> <span>{member.role}</span>
        </div>
        <div className="flex gap-4 items-center">
          <Mail size={15} /> <span>{member.email}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default TeamMember;
