import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PlusCircle, Mail, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Member {
  id: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  joinedAt: string;
}

const Members = () => {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [userRole] = useState<"Admin" | "Editor" | "Viewer">("Admin"); // This would come from auth context
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
      role: "Editor",
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
    if (userRole !== "Admin") {
      toast.error("Only admins can remove members");
      return;
    }
    toast.success(`Member ${email} removed`);
  };

  const handleRoleChange = (memberId: string, newRole: string) => {
    if (userRole !== "Admin") {
      toast.error("Only admins can change roles");
      return;
    }
    toast.success(`Role updated successfully`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Team Members</h1>
        {userRole === "Admin" && (
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
        )}
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
              <TableCell>
                {userRole === "Admin" ? (
                  <Select
                    defaultValue={member.role}
                    onValueChange={(value) => handleRoleChange(member.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">
                        <span className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Admin
                        </span>
                      </SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="flex items-center gap-2">
                    {member.role === "Admin" && <Shield className="h-4 w-4" />}
                    {member.role}
                  </span>
                )}
              </TableCell>
              <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                {userRole === "Admin" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.email)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Members;