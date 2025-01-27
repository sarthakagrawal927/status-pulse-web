import { useEffect, useState } from "react";
import { API_FUNCTIONS } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserRole, UserStatus } from "@/utils/constants";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function TeamMembers() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: UserRole.MEMBER,
  });

  const fetchMembers = async () => {
    try {
      const { data } = await API_FUNCTIONS.getTeamMembers();
      setMembers(data);
    } catch (error) {
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInvite = async () => {
    try {
      await API_FUNCTIONS.inviteTeamMember(inviteForm);
      toast.success("Invitation sent successfully");
      setInviteDialogOpen(false);
      fetchMembers();
      setInviteForm({ email: "", role: UserRole.MEMBER });
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await API_FUNCTIONS.updateTeamMember(userId, { role });
      toast.success("Role updated successfully");
      fetchMembers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      await API_FUNCTIONS.removeTeamMember(userId);
      toast.success("Member removed successfully");
      fetchMembers();
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        {user?.role === UserRole.ADMIN && (
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>Invite Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new team member.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={inviteForm.role}
                    onValueChange={(value) =>
                      setInviteForm({ ...inviteForm, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleInvite}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            {user?.role === UserRole.ADMIN && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                {user?.role === UserRole.ADMIN && member.id !== user.id ? (
                  <Select
                    value={member.role}
                    onValueChange={(value) => handleUpdateRole(member.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  member.role
                )}
              </TableCell>
              <TableCell>{member.status}</TableCell>
              <TableCell>
                {new Date(member.createdAt).toLocaleDateString()}
              </TableCell>
              {user?.role === UserRole.ADMIN && (
                <TableCell>
                  {member.id !== user.id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
