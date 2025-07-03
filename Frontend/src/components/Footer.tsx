import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-8 w-full">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section: Copyright and App Name */}
        <div className="text-center md:text-left mb-2 md:mb-0">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} SmartShelf. All rights reserved.
          </p>
        </div>

        {/* Middle Section: Navigation (Optional) */}
        <nav className="hidden md:flex space-x-4 mb-2 md:mb-0">
          <a
            href="/about"
            className="text-gray-300 hover:text-white transition duration-300 text-sm"
          >
            About
          </a>
          <a
            href="/contact"
            className="text-gray-300 hover:text-white transition duration-300 text-sm"
          >
            Contact
          </a>
          <a
            href="/privacy"
            className="text-gray-300 hover:text-white transition duration-300 text-sm"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-gray-300 hover:text-white transition duration-300 text-sm"
          >
            Terms of Service
          </a>
        </nav>

        {/* Right Section: Social Media Icons (Optional) */}
        <div className="flex items-center space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            {/* Replace with your Facebook icon (e.g., using a library like Font Awesome or a custom SVG) */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              {/* Placeholder Facebook SVG Path */}
              <path
                fill="currentColor"
                d="M12 2.04c-5.52 0-10 4.48-10 10 0 4.42 2.87 8.17 6.84 9.42V15.4h-2.06v-2.44h2.06V9.9c0-2.04 1.23-3.16 3.06-3.16 1.68 0 3.47.14 3.47.14v2.41h-1.92c-1 0-1.19.48-1.19 1.18v1.54h3.21l-.42 2.44h-2.79v9.46C19.13 20.2 22 16.44 22 12.04c0-5.52-4.48-10-10-10z"
              />
            </svg>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            {/* Replace with your Twitter icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              {/* Placeholder Twitter SVG Path */}
              <path
                fill="currentColor"
                d="M22.46 6c-.77.68-1.6.96-2.46.96A4.2 4.2 0 0 0 16 4c.88.14 1.66.38 2.3.66-1.02-.68-2.34-1.1-3.8-1.1-2.74 0-4.96 2.22-4.96 4.96 0 .38.04.76.12 1.1C8.07 8.1 5.5 6.5 3.6 4.1c-.4.7-.64 1.5-.64 2.4 0 1.7 1 3 4.1 5.8-1-.3-2-.5-3-.5-2 0-3.17 1.7-3.17 3.8 0 .7.14 1.4.4 2-2.1-.1-4.1-1.1-5.5-2.7 0 .9.18 1.8.5 2.5-1-.3-1.8-.5-2.8-.5 0 2.4 1.5 4.4 3.7 5.6-.5.1-.9.2-1.4.2C3.2 16.4 5.4 17.8 8 17.8c-1.6 1.3-3.7 2-6 2 2.7 1.6 5.9 2.6 9.4 2.6 11.4 0 17.6-9.4 17.6-17.6 0-.3-.1-.6-.1-.9A12.3 12.3 0 0 0 22.46 6z"
              />
            </svg>
          </a>
          {/* Add more social media links */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
