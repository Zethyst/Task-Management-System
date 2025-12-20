import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
export default function Profile() {
  const { user, updateProfile } = useAuth();
  // console.log(user);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async () => {
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    setIsLoading(true);
    const result = await updateProfile({ name: name.trim() });
    setIsLoading(false);

    if (result.success) {
      setIsEditing(false);
      toast.success("Your profile has been updated successfully.");
    } else {
      toast.error(result.error || "Failed to update profile");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto ">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
        Profile
      </h1>

      <Card className="border-emerald-200/50 bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-500/10">
        <CardHeader className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-emerald-200 shadow-lg">
            <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-400 to-green-500 text-white font-bold">
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-emerald-700 text-2xl">{user?.name}</CardTitle>
          <CardDescription className="text-emerald-600/70">{user?.email}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-emerald-700 font-medium">
                <div className="p-1 rounded bg-emerald-100/50">
                  <User className="h-4 w-4 text-emerald-600" />
                </div>
                Name
              </Label>
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                />
              ) : (
                <p className="text-emerald-700 py-2 px-3 bg-emerald-50/50 rounded-lg">{user?.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-emerald-700 font-medium">
                <div className="p-1 rounded bg-emerald-100/50">
                  <Mail className="h-4 w-4 text-emerald-600" />
                </div>
                Email
              </Label>
              <p className="text-emerald-700 py-2 px-3 bg-emerald-50/50 rounded-lg">{user?.email}</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-emerald-700 font-medium">
                <div className="p-1 rounded bg-emerald-100/50">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                </div>
                Member since
              </Label>
              <p className="text-emerald-700 py-2 px-3 bg-emerald-50/50 rounded-lg">
                {user?.createdAt
                  ? format(new Date(user.createdAt), "MMMM d, yyyy")
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-emerald-200/50">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || "");
                  }}
                  disabled={isLoading}
                  className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="cursor-pointer bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02]"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}