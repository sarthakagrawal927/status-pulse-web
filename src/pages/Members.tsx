import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PlusCircle, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Member {
  id: string;
  email: string;
  role: string;
  joinedAt: string;
}

const Members = () => {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [members] = useState<Member[]>([
    {
      id: "1",
      email: "john@example.com",
      role: "Admin",
      joinedAt: "2024-01-01",
    },
    {
      id: "2",
      email: "jane@example.com",
      role: "Member",
      joinedAt: "2024-01-15",
    },
  ]);

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail) {
      toast.error("Please enter an email address");
      return;
    }
    toast.success(`Invitation sent to ${newMemberEmail}`);
    setNewMemberEmail("");
  };

  const handleRemoveMember = (email: string) => {
    toast.success(`Member ${email} removed`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <form onSubmit={handleInviteMember} className="flex gap-4">
          <Input
            type="email"
            placeholder="Enter email address"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            className="w-64"
          />
          <Button type="submit">
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </form>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {member.email}
              </TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.email)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Members;