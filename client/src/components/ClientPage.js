import React from 'react';
import "../styles/ClientPage.css";

function ClientPage() {
  return (
    <div className="flex overflow-hidden flex-col pb-16 bg-white">
      <header className="flex flex-col px-12 pt-2 pb-4 max-w-full bg-white w-[1246px] max-md:pl-5">
        <div className="flex flex-wrap gap-5 justify-between pb-2 bg-white border border-solid border-teal-700 border-opacity-30 max-md:max-w-full">
          <h2 className="text-2xl text-teal-700 border border-solid border-teal-300 border-opacity-0">
            Thera<span className="text-black">connect</span>
          </h2>
          <nav className="text-lg font-bold text-black border border-black border-solid">
            <button className="mr-4">Change therapist</button>
            <button>Log out</button>
          </nav>
        </div>
      </header>

      <main className="flex flex-col px-10 mt-4 w-full max-md:px-5 max-md:max-w-full">
        <h1 className="self-start ml-7 text-3xl text-teal-700 border border-teal-700 border-solid max-md:max-w-full">
          Hi Tumaini.. Welcome
        </h1>

        <section className="max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <article className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow items-start pt-2 pr-12 pb-40 pl-0.5 w-full text-xl text-black bg-white rounded-3xl border border-teal-700 border-solid max-md:pr-5 max-md:pb-24 max-md:mt-10">
                <h3 className="border border-teal-700 border-solid">My sessions</h3>
                <p className="mt-12 border border-black border-solid max-md:mt-10">No Current session</p>
              </div>
            </article>

            <article className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col items-start px-2.5 pt-2 pb-16 mx-auto w-full text-sm text-black bg-white rounded-3xl border border-teal-700 border-solid max-md:mt-10">
                <h3 className="text-xl border border-teal-700 border-solid">My therapist</h3>
                <div className="flex gap-2.5 self-stretch mt-4">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/0013e5a60ded0ca441ae634109dd8e8ecaf5fb05f73a19f2347ab2c4a64991a3?placeholderIfAbsent=true&apiKey=6580918b057948818913b37d5b0a12ce"
                    className="object-contain shrink-0 self-start aspect-[1.12] w-[86px]"
                    alt="Therapist profile"
                  />
                  <div>
                    <p>Mr. Allan Njoroge</p>
                    <p>Masters in Social psychology</p>
                    <p>7 years experience</p>
                  </div>
                </div>
                <div className="mt-8">
                  <p>Email:</p>
                  <p>Phone:</p>
                </div>
              </div>
            </article>

            <article className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex relative flex-col grow px-2 pt-1.5 pb-56 text-xl text-black rounded-3xl border border-black border-solid aspect-[0.968] max-md:pr-5 max-md:pb-24 max-md:mt-10">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/8776b8ce29ed8919492f99f9725cd14c468d518e51e0b15844123992d6f46dde?placeholderIfAbsent=true&apiKey=6580918b057948818913b37d5b0a12ce"
                  className="object-cover absolute inset-0 size-full"
                  alt=""
                />
                <h3>My notes</h3>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-20 max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <article className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow pt-2.5 pr-5 pb-32 pl-1 w-full text-black bg-white rounded-3xl border border-teal-700 border-solid max-md:pr-5 max-md:pb-24 max-md:mt-10">
                <h3 className="text-xl border border-teal-700 border-solid">Downloaded resources</h3>
                <p className="mt-16 text-lg max-md:mt-10">Access your downloaded resources here.</p>
              </div>
            </article>

            <article className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow items-start pt-2.5 pr-12 pb-32 pl-2 w-full text-black bg-white rounded-3xl border border-teal-700 border-solid max-md:pr-5 max-md:pb-24 max-md:mt-10">
                <h3 className="text-xl border border-teal-700 border-solid">Book appointment</h3>
                <p className="mt-9 text-lg">Schedule an appointment now with your therapist</p>
              </div>
            </article>

            <article className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <div className="px-2.5 pt-2.5 pb-56 w-full text-xl text-black whitespace-nowrap bg-white rounded-3xl border border-teal-700 border-solid aspect-square max-md:pr-5 max-md:pb-24 max-md:mt-10">
                <h3>Support</h3>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ClientPage;