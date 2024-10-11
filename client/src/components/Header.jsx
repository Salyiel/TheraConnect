import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="flex flex-col self-stretch px-10 pt-3 pb-1 w-full border-b border-teal-700 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between pr-20 pb-2 w-full border border-gray-100 border-solid max-md:pr-5 max-md:max-w-full">
        <div className="my-auto text-2xl font-extrabold leading-none text-neutral-900">
          <span className="text-teal-700">Thera</span>
          <span>connect</span>
        </div>
        <nav className="flex gap-8 items-center">
          <Link to="/about" className="grow self-stretch my-auto text-lg font-semibold leading-none text-neutral-900">
            About
          </Link>
          <div className="flex gap-1.5 self-stretch my-auto text-lg font-semibold leading-none whitespace-nowrap text-neutral-900">
            <Link to="/services" className="grow">services</Link>
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/97ed5a2ddcdd9cfc3ffd549126190103557a3af3359775404f2856dec9d87c44?apiKey=79d7b859d37045a28ba37e0ac4eab217&" className="object-contain shrink-0 self-start mt-3.5 w-2.5 aspect-[2] fill-zinc-900" alt="" />
          </div>
          <div className="flex gap-1.5 self-stretch my-auto text-lg font-semibold leading-none whitespace-nowrap text-neutral-900">
            <Link to="/careers" className="grow">Careers</Link>
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/97ed5a2ddcdd9cfc3ffd549126190103557a3af3359775404f2856dec9d87c44?apiKey=79d7b859d37045a28ba37e0ac4eab217&" className="object-contain shrink-0 self-start mt-3.5 w-2.5 aspect-[2] fill-zinc-900" alt="" />
          </div>
          <div className="flex gap-10 self-stretch text-center">
            <Link to="/login" className="my-auto text-lg font-semibold leading-none text-neutral-900">
              Login
            </Link>
            <Link to="/find-therapist" className="overflow-hidden px-3.5 py-3 text-xl font-bold leading-none text-white bg-teal-700 rounded-xl border border-black border-solid shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              Find a therapist
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;