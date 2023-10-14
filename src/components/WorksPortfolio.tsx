import React from "react";

interface ArtistData {
  works1_url: string;
  works2_url: string;
  works3_url: string;
  works4_url: string;
}

const WorksPortfolio: React.FC<{ artistData: ArtistData }> = ({
  artistData,
}) => {
  return (
    <div className="p-4 bg-gray-100 max-w-[90vw] mx-auto mt-5 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 auto-flow-dense gap-4 items-center">
        <div className="relative group">
          <img
            src={artistData.works1_url || "/default_works.webp"}
            alt="Work 1"
            className="w-full h-auto object-cover p-1 border-double border-2"
          />
        </div>

        <div className="relative group">
          <img
            src={artistData.works2_url || "/default_works.webp"}
            alt="Work 2"
            className="w-full h-auto object-cover p-1 border-double border-2"
          />
        </div>

        <div className="relative group">
          <img
            src={artistData.works3_url || "/default_works.webp"}
            alt="Work 3"
            className="w-full h-auto object-cover p-1 border-double border-2"
          />
        </div>

        <div className="relative group">
          <img
            src={artistData.works4_url || "/default_works.webp"}
            alt="Work 4"
            className="w-full h-auto object-cover p-1 border-double border-2"
          />
        </div>
      </div>
    </div>
  );
};

export default WorksPortfolio;
