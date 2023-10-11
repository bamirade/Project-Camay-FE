import { useLocation } from "react-router-dom";

export const PageIndicator = () => {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment);

  if (pathSegments[0] === "artists" || pathSegments[0] === "products") {
    return pathSegments.map((segment, index) => {
      const url = "/" + pathSegments.slice(0, index + 1).join("/");
      const displayName = segment.charAt(0).toUpperCase() + segment.slice(1);
      return (
        <div key={index}>
          {index === 0 ? (
            <a
              href={url}
              className="text-black hover:text-gray-600 transition duration-300 font-semibold"
            >
              {displayName}
            </a>
          ) : (
            <div className="flex">
              <p className="text-black font-semibold ml-3">&gt;</p>
              <a
                key={index}
                href={url}
                className="text-black hover:text-gray-600 transition duration-300 font-semibold ml-3"
              >
                {displayName}
              </a>
            </div>
          )}
        </div>
      );
    });
  } else {
    return (
      <div>
        <a
          href="/artists"
          className="text-black hover:text-gray-600 transition duration-300 font-semibold"
        >
          Artists
        </a>
        <a
          href="/products"
          className="text-black hover:text-gray-600 transition duration-300 font-semibold ml-3"
        >
          Products
        </a>
      </div>
    );
  }
};
