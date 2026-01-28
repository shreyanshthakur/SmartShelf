import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { getUserProfile } from "../utils/authUtils";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profile?: {
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  createdAt: string;
  lastLoginAt: string;
}

export const Profile = () => {
  // Get basic user info from Redux
  const { firstName, lastName, email, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  );

  // Local state for extended profile data
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch full profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfileData(data.userProfile);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {firstName} {lastName}
            </h1>
            <p className="text-gray-600 mt-1">{email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {profileData?.role || "Customer"}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="First Name" value={firstName || "N/A"} />
          <InfoField label="Last Name" value={lastName || "N/A"} />
          <InfoField label="Email" value={email || "N/A"} />
          <InfoField
            label="Phone"
            value={profileData?.profile?.phone || "Not provided"}
          />
          <InfoField
            label="Date of Birth"
            value={
              profileData?.profile?.dateOfBirth
                ? new Date(profileData.profile.dateOfBirth).toLocaleDateString()
                : "Not provided"
            }
          />
          <InfoField
            label="Gender"
            value={profileData?.profile?.gender || "Not specified"}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Address</h2>
        {profileData?.profile?.address ? (
          <div className="space-y-2">
            <InfoField
              label="Street"
              value={profileData.profile.address.street || "N/A"}
            />
            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="City"
                value={profileData.profile.address.city || "N/A"}
              />
              <InfoField
                label="State"
                value={profileData.profile.address.state || "N/A"}
              />
              <InfoField
                label="Zip Code"
                value={profileData.profile.address.zipCode || "N/A"}
              />
              <InfoField
                label="Country"
                value={profileData.profile.address.country || "N/A"}
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No address information provided</p>
        )}
      </div>

      {/* Account Activity Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Account Activity
        </h2>
        <InfoField
          label="Member Since"
          value={
            profileData?.createdAt
              ? new Date(profileData.createdAt).toLocaleDateString()
              : "N/A"
          }
        />
        <InfoField
          label="Last Login"
          value={
            profileData?.lastLoginAt
              ? new Date(profileData.lastLoginAt).toLocaleString()
              : "N/A"
          }
        />
      </div>
    </div>
  );
};

// Reusable component for displaying info fields
const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <p className="text-gray-800 mt-1">{value}</p>
  </div>
);
