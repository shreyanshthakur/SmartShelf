import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { City, Country, State } from "country-state-city";
import type { RootState } from "../store";
import { getUserProfile, updateUserProfile } from "../utils/authUtils";
import { setUser } from "../features/userSlice";

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
  const { userId, firstName, lastName, email, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();

  // Local state for extended profile data
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    zipCode?: string;
  }>({});

  const countries = useMemo(() => Country.getAllCountries(), []);
  const selectedCountryName = formData?.profile?.address?.country ?? "";
  const selectedCountryIso = useMemo(
    () =>
      countries.find((country) => country.name === selectedCountryName)
        ?.isoCode ?? "",
    [countries, selectedCountryName],
  );
  const states = useMemo(
    () =>
      selectedCountryIso ? State.getStatesOfCountry(selectedCountryIso) : [],
    [selectedCountryIso],
  );

  const selectedStateName = formData?.profile?.address?.state ?? "";
  const selectedStateIso = useMemo(
    () =>
      states.find((state) => state.name === selectedStateName)?.isoCode ?? "",
    [states, selectedStateName],
  );
  const cities = useMemo(
    () =>
      selectedCountryIso && selectedStateIso
        ? City.getCitiesOfState(selectedCountryIso, selectedStateIso)
        : [],
    [selectedCountryIso, selectedStateIso],
  );

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length !== 10) return "Phone number must be 10 digits";
    return "";
  };

  const validateRequired = (value: string, label: string) => {
    if (!value.trim()) return `${label} is required`;
    return "";
  };

  const validateDob = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Invalid date";
    const today = new Date();
    if (date > today) return "Date of birth cannot be in the future";
    const age =
      today.getFullYear() -
      date.getFullYear() -
      (today.getMonth() < date.getMonth() ||
      (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
        ? 1
        : 0);
    if (age < 13) return "You must be at least 13 years old";
    return "";
  };

  const validateZip = (value: string, country?: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    // Country-specific zip code validation
    if (country === "India") {
      if (digits.length !== 6) return "Zip code must be 6 digits for India";
    } else if (country === "United States") {
      if (digits.length !== 5) return "Zip code must be 5 digits for US";
    } else if (country === "Canada") {
      // Canadian postal codes are alphanumeric, but we'll accept 6 characters
      if (value.replace(/\s/g, "").length !== 6)
        return "Postal code must be 6 characters for Canada";
    } else if (country === "United Kingdom") {
      // UK postcodes vary in length (5-7 characters)
      if (
        value.replace(/\s/g, "").length < 5 ||
        value.replace(/\s/g, "").length > 7
      ) {
        return "Postcode must be 5-7 characters for UK";
      }
    } else {
      // Generic validation for other countries (3-10 characters)
      if (digits.length < 3 || digits.length > 10) {
        return "Zip code must be between 3-10 digits";
      }
    }

    return "";
  };

  // Fetch full profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfileData(data.userProfile);
        setFormData(data.userProfile);
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

  const handleEditToggle = () => {
    if (profileData) {
      setFormData(profileData);
    }
    setFieldErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData(profileData);
    }
    setFieldErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      const nextErrors = {
        firstName: validateRequired(formData.firstName ?? "", "First Name"),
        lastName: validateRequired(formData.lastName ?? "", "Last Name"),
        phone: validatePhone(formData?.profile?.phone ?? ""),
        dateOfBirth: validateDob(formData?.profile?.dateOfBirth ?? ""),
        zipCode: validateZip(
          formData?.profile?.address?.zipCode ?? "",
          formData?.profile?.address?.country,
        ),
      };
      const hasErrors = Object.values(nextErrors).some(Boolean);
      if (hasErrors) {
        setFieldErrors(nextErrors);
        return;
      }
      setIsSaving(true);
      setError(null);
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        profile: formData.profile,
      };
      const data = await updateUserProfile(payload);
      const updated = data?.user ?? formData;
      setProfileData(updated);
      setFormData(updated);
      if (userId) {
        dispatch(
          setUser({
            userId,
            firstName: updated.firstName ?? firstName ?? "",
            lastName: updated.lastName ?? lastName ?? "",
            email: email ?? "",
          }),
        );
      }
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

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
              {profileData?.firstName || firstName}{" "}
              {profileData?.lastName || lastName}
            </h1>
            <p className="text-gray-600 mt-1">{email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {profileData?.role || "Customer"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField
            isEditing={isEditing}
            display={
              <InfoField
                label="First Name"
                value={profileData?.firstName || firstName || "N/A"}
              />
            }
            editor={
              <EditorField label="First Name">
                <input
                  className={`border px-2 py-1 rounded w-full ${fieldErrors.firstName ? "border-red-500" : ""}`}
                  value={formData?.firstName ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) =>
                      prev ? { ...prev, firstName: value } : prev,
                    );
                    const firstNameError = validateRequired(
                      value,
                      "First Name",
                    );
                    setFieldErrors((prev) => ({
                      ...prev,
                      firstName: firstNameError || undefined,
                    }));
                  }}
                />
                {fieldErrors.firstName ? (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.firstName}
                  </p>
                ) : null}
              </EditorField>
            }
          />
          <EditableField
            isEditing={isEditing}
            display={
              <InfoField
                label="Last Name"
                value={profileData?.lastName || lastName || "N/A"}
              />
            }
            editor={
              <EditorField label="Last Name">
                <input
                  className={`border px-2 py-1 rounded w-full ${fieldErrors.lastName ? "border-red-500" : ""}`}
                  value={formData?.lastName ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) =>
                      prev ? { ...prev, lastName: value } : prev,
                    );
                    const lastNameError = validateRequired(value, "Last Name");
                    setFieldErrors((prev) => ({
                      ...prev,
                      lastName: lastNameError || undefined,
                    }));
                  }}
                />
                {fieldErrors.lastName ? (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.lastName}
                  </p>
                ) : null}
              </EditorField>
            }
          />
          <InfoField label="Email" value={email || "N/A"} />
          <EditableField
            isEditing={isEditing}
            display={
              <InfoField
                label="Phone"
                value={profileData?.profile?.phone || "Not provided"}
              />
            }
            editor={
              <EditorField label="Phone">
                <input
                  className={`border px-2 py-1 rounded w-full ${fieldErrors.phone ? "border-red-500" : ""}`}
                  value={formData?.profile?.phone ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) =>
                      prev
                        ? {
                            ...prev,
                            profile: { ...prev.profile, phone: value },
                          }
                        : prev,
                    );
                    const phoneError = validatePhone(value);
                    setFieldErrors((prev) => ({
                      ...prev,
                      phone: phoneError || undefined,
                    }));
                  }}
                />
                {fieldErrors.phone ? (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.phone}
                  </p>
                ) : null}
              </EditorField>
            }
          />
          <EditableField
            isEditing={isEditing}
            display={
              <InfoField
                label="Date of Birth"
                value={
                  profileData?.profile?.dateOfBirth
                    ? new Date(
                        profileData.profile.dateOfBirth,
                      ).toLocaleDateString()
                    : "Not provided"
                }
              />
            }
            editor={
              <EditorField label="Date of Birth">
                <input
                  type="date"
                  className={`border px-2 py-1 rounded w-full ${fieldErrors.dateOfBirth ? "border-red-500" : ""}`}
                  value={formData?.profile?.dateOfBirth?.slice(0, 10) ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) =>
                      prev
                        ? {
                            ...prev,
                            profile: {
                              ...prev.profile,
                              dateOfBirth: value,
                            },
                          }
                        : prev,
                    );
                    const dobError = validateDob(value);
                    setFieldErrors((prev) => ({
                      ...prev,
                      dateOfBirth: dobError || undefined,
                    }));
                  }}
                />
                {fieldErrors.dateOfBirth ? (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.dateOfBirth}
                  </p>
                ) : null}
              </EditorField>
            }
          />
          <EditableField
            isEditing={isEditing}
            display={
              <InfoField
                label="Gender"
                value={profileData?.profile?.gender || "Not specified"}
              />
            }
            editor={
              <EditorField label="Gender">
                <select
                  className="border px-2 py-1 rounded w-full"
                  value={formData?.profile?.gender ?? ""}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev
                        ? {
                            ...prev,
                            profile: {
                              ...prev.profile,
                              gender: e.target.value,
                            },
                          }
                        : prev,
                    )
                  }
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </EditorField>
            }
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Address</h2>
        <div className="space-y-2">
          <EditableField
            isEditing={isEditing}
            display={
              <InfoField
                label="Street"
                value={profileData?.profile?.address?.street || "N/A"}
              />
            }
            editor={
              <EditorField label="Street">
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={formData?.profile?.address?.street ?? ""}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev
                        ? {
                            ...prev,
                            profile: {
                              ...prev.profile,
                              address: {
                                ...prev.profile?.address,
                                street: e.target.value,
                              },
                            },
                          }
                        : prev,
                    )
                  }
                />
              </EditorField>
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <EditableField
              isEditing={isEditing}
              display={
                <InfoField
                  label="Country"
                  value={profileData?.profile?.address?.country || "N/A"}
                />
              }
              editor={
                <EditorField label="Country">
                  <select
                    className="border px-2 py-1 rounded w-full"
                    value={formData?.profile?.address?.country ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              profile: {
                                ...prev.profile,
                                address: {
                                  ...prev.profile?.address,
                                  country: value,
                                  state: "",
                                  city: "",
                                },
                              },
                            }
                          : prev,
                      );
                    }}
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </EditorField>
              }
            />
            <EditableField
              isEditing={isEditing}
              display={
                <InfoField
                  label="State"
                  value={profileData?.profile?.address?.state || "N/A"}
                />
              }
              editor={
                <EditorField label="State">
                  <select
                    className="border px-2 py-1 rounded w-full"
                    value={formData?.profile?.address?.state ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              profile: {
                                ...prev.profile,
                                address: {
                                  ...prev.profile?.address,
                                  state: value,
                                  city: "",
                                },
                              },
                            }
                          : prev,
                      );
                    }}
                  >
                    <option value="">Select state</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </EditorField>
              }
            />
            <EditableField
              isEditing={isEditing}
              display={
                <InfoField
                  label="City"
                  value={profileData?.profile?.address?.city || "N/A"}
                />
              }
              editor={
                <EditorField label="City">
                  <select
                    className="border px-2 py-1 rounded w-full"
                    value={formData?.profile?.address?.city ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              profile: {
                                ...prev.profile,
                                address: {
                                  ...prev.profile?.address,
                                  city: value,
                                },
                              },
                            }
                          : prev,
                      );
                    }}
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </EditorField>
              }
            />
            <EditableField
              isEditing={isEditing}
              display={
                <InfoField
                  label="Zip Code"
                  value={profileData?.profile?.address?.zipCode || "N/A"}
                />
              }
              editor={
                <EditorField label="Zip Code">
                  <input
                    className={`border px-2 py-1 rounded w-full ${fieldErrors.zipCode ? "border-red-500" : ""}`}
                    value={formData?.profile?.address?.zipCode ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              profile: {
                                ...prev.profile,
                                address: {
                                  ...prev.profile?.address,
                                  zipCode: value,
                                },
                              },
                            }
                          : prev,
                      );
                      const zipError = validateZip(
                        value,
                        formData?.profile?.address?.country,
                      );
                      setFieldErrors((prev) => ({
                        ...prev,
                        zipCode: zipError || undefined,
                      }));
                    }}
                  />
                  {fieldErrors.zipCode ? (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.zipCode}
                    </p>
                  ) : null}
                </EditorField>
              }
            />
          </div>
        </div>
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

const EditableField = ({
  isEditing,
  display,
  editor,
}: {
  isEditing: boolean;
  display: ReactNode;
  editor: ReactNode;
}) => (isEditing ? editor : display);

const EditorField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <div className="mt-1">{children}</div>
  </div>
);

// Reusable component for displaying info fields
const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <p className="text-gray-800 mt-1">{value}</p>
  </div>
);
