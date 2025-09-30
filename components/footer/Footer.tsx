const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 p-4">
      <div className="flex justify-center items-center">
        <p className="text-center">
          Copyright &copy; {new Date().getFullYear()} — All rights reserved by{" "}
          <span className="font-semibold">Shaddyna</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;