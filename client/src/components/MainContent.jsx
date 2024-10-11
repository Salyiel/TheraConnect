import React from 'react';
import TherapyOption from './TherapyOption';
import FeatureItem from './FeatureItem';

const MainContent = () => {
  const features = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d50f4c85-282e-44be-a73e-47f7b86aebb3?apiKey=79d7b859d37045a28ba37e0ac4eab217&", text: "Convenient" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6dbae2c7-53f7-455e-bfda-c685ab99a523?apiKey=79d7b859d37045a28ba37e0ac4eab217&", text: "Professional Support" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e01b3a99-d5fb-4da0-9ee6-65166714bf24?apiKey=79d7b859d37045a28ba37e0ac4eab217&", text: "Flexible Options" }
  ];

  const therapyOptions = [
    { title: "Individual Therapy", description: "Individual Support for ages 18+", bgColor: "bg-teal-700" },
    { title: "Couples Therapy", description: "Relationship Support for Myself & Partner", bgColor: "bg-teal-400" },
    { title: "Teen Therapy", description: "Specialized support for ages 13 - 17", bgColor: "bg-teal-200" }
  ];

  return (
    <main className="flex overflow-hidden flex-col items-center pb-5 w-full bg-white max-md:max-w-full">
      <h1 className="mt-9 text-4xl font-extrabold leading-none text-teal-700 max-md:max-w-full">
        Start feeling better today.
      </h1>
      <div className="flex flex-wrap gap-5 justify-between items-center py-4 pr-20 pl-0.5 mt-6 max-w-full bg-white rounded-xl border border-solid border-zinc-200 w-[928px] max-md:pr-5">
        {features.map((feature, index) => (
          <FeatureItem key={index} icon={feature.icon} text={feature.text} />
        ))}
      </div>
      <h2 className="mt-6 text-3xl leading-none text-neutral-900 max-md:max-w-full">
        What kind of therapy are you looking for?
      </h2>
      {therapyOptions.map((option, index) => (
        <TherapyOption
          key={index}
          title={option.title}
          description={option.description}
          bgColor={option.bgColor}
        />
      ))}
      <div className="overflow-hidden px-6 pt-2.5 pb-9 mt-16 max-w-full text-xl leading-5 text-black rounded-3xl border border-gray-200 border-solid w-[928px] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <span className="font-light">
          If you are in a crisis or any other person may be in danger - don't use this site.
        </span>
        <a
          href="https://www.Theraconnect.com/gethelpnow/"
          className="font-semibold text-teal-700 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          These resources
        </a>
        <span className="font-light"> can provide you with immediate help.</span>
      </div>
    </main>
  );
};

export default MainContent;