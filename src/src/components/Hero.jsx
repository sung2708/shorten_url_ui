const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center'>
      <h4 className="font-family text-xl md:text-3xl md:text-[48px] md:leading-[48px] font-bold md:font-extrabold max-w-xl m-2">
        Shorten & Track Your URLs
      </h4>
      <p className="max-w-130 m-2 text-sm md:text-base font-medium">
        Shorten instantly. Log In to track clicks and control your links from a
        private dashboard. Transform your URLs into data assets—
        <b className="text-bl">
          <i>
            <a className="text-blue-700" href="auth?mode=signup">
              Sign Up
            </a>{" "}
            Now!
          </i>
        </b>
      </p>
      <div
        className=" text-gray-900 bg-blue-200/90 mx-auto max-w-xl md:p-10 p-8 text-center text-sm rounded-2xl shadow-[0px_0px_10px_0px] shadow-black/10
                opacity-70 ml-4 mr-4"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          Shorten Your URL Here
        </h2>

        <label htmlFor="url-form">URL</label>

        <input
          id="url-form"
          className="rounded-full text-gray-900 w-full border mt-1 border-gray-500 hover:border-white outline-none py-2.5 px-4"
          type="text"
          placeholder="e.g., https://example.com/very/long/link"
        />

        <button
          type="button"
          className="rounded-full w-full my-3 bg-gray-500 active:scale-95 transition py-2.5 text-gray-900 hover:bg-gray-700 cursor-pointer"
        >
          Get Short Link
        </button>
      </div>
    </div>
  );
};

export default Hero;
