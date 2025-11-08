import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { hashPassword, verifyPassword } from "../services/PasswordService";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "customer" | "admin" | "manager";
  profile: {
    phone?: string;
    dateOfBirth?: Date;
    gender?: "male" | "female" | "other" | "prefer-not-to-say";
    address: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    preferences: {
      newsLetter: boolean;
      notificatoins: boolean;
      currency: string;
      theeme: "light" | "dark";
    };
  };

  isActive: boolean;
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAt: Date;
  loginAttempts: number;
  lockUntil?: Date;

  createdAt: Date;
  updatedAt: Date;
  comparePassword(plainPassword: string): Promise<boolean>;

  fullName: string;
  isLocked: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: function (email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    role: {
      type: String,
      enum: {
        values: ["customer", "admin", "manager"],
        message: "Role must be either customer, admin or manager",
      },
      default: "customer",
      index: true,
    },

    profile: {
      phone: {
        type: String,
        sparse: true,
        validate: {
          validator: function (phone: string) {
            if (!phone) return true;
            return /^\+?[\d\s\-\(\)]{10,}$/.test(phone);
          },
          message: "Please provide a valid phone number",
        },
      },
      dateOfBirth: {
        type: Date,
        validate: {
          validator: function (date: Date) {
            if (!date) return true;
            return date <= new Date();
          },
          message: "Date of birth cannot be in the future",
        },
      },
      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer-not-to-say"],
      },
      address: {
        street: {
          type: String,
          maxlength: [100, "Street address cannot exceed 100 characters"],
        },
        city: {
          type: String,
          maxlength: [50, "City name cannot exceed 50 characters"],
        },
        state: {
          type: String,
          maxlength: [50, "State name cannot exceed 50 characters"],
        },
        zipCode: {
          type: String,
          maxlength: [20, "Zip code cannot exceed 20 characters"],
          validate: {
            validator: function (zip: string) {
              if (!zip) return true;
              return /^[\d\-\s]+$/.test(zip);
            },
            message: "Invalid zip code format",
          },
        },
        country: {
          type: String,
          maxlength: [50, "Country name cannot exceed 50 characters"],
          default: "United States",
        },
      },
      preferences: {
        newsletter: {
          type: Boolean,
          default: false,
        },
        notifications: {
          type: Boolean,
          default: true,
        },
        currency: {
          type: String,
          enum: ["USD", "EUR", "GBP", "CAD"],
          default: "USD",
        },
        theme: {
          type: String,
          enum: ["light", "dark"],
          default: "light",
        },
      },
    },
    // Account security fields
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    emailVerificationToken: {
      type: String,
      select: false, // Don't include in queries
    },

    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    lastLoginAt: {
      type: Date,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await hashPassword(this.password);
});

UserSchema.methods.comparePassword = async function (
  plainPassword: string
): Promise<boolean> {
  return await verifyPassword(plainPassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
