export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center text-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              DRENVÍO © {new Date().getFullYear()}
              {" • "}
              Challenge
              {" • "}
              Sebastián Mosquera Valencia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
