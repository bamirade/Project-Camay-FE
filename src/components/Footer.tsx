function Footer() {
  return (
    <footer className="bg-gradient-to-l from-[#e8d9c261] to-white p-4">
      <div className="container mx-auto flex justify-end items-center">
        <div className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()}{" "}
          <a href="mailto:projectcamay@gmail.com">
            Project:CAMAY
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
