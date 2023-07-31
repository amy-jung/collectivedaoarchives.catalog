import type { NextPage } from "next";

const About: NextPage = () => {
  return (
    <div className="flex flex-col items-center p-8 md:px-24">
      <div className="container mx-auto w-[1150px] max-w-[90%] mt-14">
        <h1 className="font-bold text-xl md:text-4xl">About</h1>
        <p className="mt-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare mi ac iaculis varius. Cras convallis, nisi
          vitae luctus maximus, nisl felis vehicula nibh, sed elementum urna magna sit amet purus. Sed at semper ipsum.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum ante ipsum
          primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed eget varius purus, sit amet ornare est.
          Suspendisse potenti. Duis vel nisl sed leo vehicula ultricies. Aliquam erat volutpat. Donec euismod dui vitae
          augue dignissim, sed elementum sem ultricies. Donec auctor, diam vitae maximus euismod, justo arcu vehicula
          velit, sit amet semper dui ipsum non sem. Sed semper, ligula non faucibus ultrices, tellus ligula porta nunc,
          vitae ultrices felis mauris non justo. Sed vulputate, tortor a mollis molestie, nisl dolor lobortis arcu, non
          vehicula justo nisl vitae mauris. Praesent at semper leo.
        </p>
      </div>
    </div>
  );
};

export default About;
