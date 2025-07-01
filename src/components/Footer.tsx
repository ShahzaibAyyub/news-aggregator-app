import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-white border-t shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-600">&copy; 2025 News Aggregator</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a
              href="https://github.com/ShahzaibAyyub"
              target="_blank"
              className="hover:text-gray-700 transition-colors flex items-center space-x-2"
            >
              <FaGithub className="text-lg" />
              <span>Shahzaib Ayyub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
