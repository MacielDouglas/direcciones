import GoogleAuth from "@/components/auth/GoogleAuth";

const Login = () => {
  return (
    <div
      role="main"
      aria-label="Página de login"
      className="h-screen bg-cover bg-center flex flex-col justify-center items-center font-inter"
      style={{ backgroundImage: `url('./ciudad_2.svg')` }}
    >
      <div className="w-full h-full flex items-center justify-center bg-black/60">
        <div className="bg-gradient-to-b border border-slate-950/50 dark:border-white/20 from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 shadow-lg rounded-lg p-10 max-w-md h-[600px] w-full m-4 sm:m-0 flex flex-col justify-evenly">
          <h1 className="text-3xl font-bold mb-6">
            {" "}
            Bienvenido a{" "}
            <span className="text-bold text-orange-500 text-5xl font-public-sans">
              Direcciones
            </span>
          </h1>
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8rem"
              height="8rem"
              viewBox="0 0 24 24"
            >
              <circle cx={12} cy={9} r={2.5} fill="#ff6900" fillOpacity={0}>
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="0.813s"
                  dur="0.188s"
                  values="0;1"
                ></animate>
              </circle>
              <path
                fill="#ff6900"
                fillOpacity={0}
                stroke="#ff6900"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.6}
                d="M12 20.5C12 20.5 11 19 11 18C11 17.5 11.5 17 12 17C12.5 17 13 17.5 13 18C13 19 12 20.5 12 20.5z"
              >
                <animate
                  fill="freeze"
                  attributeName="d"
                  dur="0.5s"
                  keyTimes="0;0.7;1"
                  values="M12 20.5C12 20.5 11 19 11 18C11 17.5 11.5 17 12 17C12.5 17 13 17.5 13 18C13 19 12 20.5 12 20.5z;M12 20.5C12 20.5 5 13 5 8C5 4.5 8 1 12 1C16 1 19 4.5 19 8C19 13 12 20.5 12 20.5z;M12 20.5C12 20.5 6 13.5 6 9C6 5.68629 8.68629 3 12 3C15.3137 3 18 5.68629 18 9C18 13.5 12 20.5 12 20.5z"
                ></animate>
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="0.625s"
                  dur="0.188s"
                  values="0;0"
                ></animate>
                <animateTransform
                  attributeName="transform"
                  dur="3.75s"
                  keyTimes="0;0.3;0.4;0.54;0.6;0.68;0.7;1"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 20.5;0 12 20.5;-8 12 20.5;0 12 20.5;5 12 20.5;-2 12 20.5;0 12 20.5;0 12 20.5"
                ></animateTransform>
              </path>
              <g fill="#ff6900">
                <path d="M12 18c0 0 0 0 0 0c0 0 0 0 0 0l0 0c0 0 0 0 0 0c0 0 0 0 0 0c0 0 0 0 0 0c0 0 0 0 0 0l0 0c0 0 0 0 0 0c0 0 0 0 0 0Z">
                  <animate
                    fill="freeze"
                    attributeName="d"
                    begin="1.125s"
                    dur="0.25s"
                    values="M12 18c0 0 0 0 0 0c0 0 0 0 0 0l0 0c0 0 0 0 0 0c0 0 0 0 0 0c0 0 0 0 0 0c0 0 0 0 0 0l0 0c0 0 0 0 0 0c0 0 0 0 0 0Z;M12 21C15.3 21 18 19.9 18 18.5C18 17.8 17.3 17.2 16.2 16.7L16.8 15.8C18.8 16.6 20 17.7 20 19C20 21.2 16.4 23 12 23C7.6 23 4 21.2 4 19C4 17.7 5.2 16.6 7.1 15.8L7.7 16.7C6.7 17.2 6 17.8 6 18.5C6 19.9 8.7 21 12 21z"
                  ></animate>
                </path>
              </g>
            </svg>
          </div>

          <p
            className="mb-6 text-lg text-stone-500"
            // initial={prefersReducedMotion ? false : { opacity: 0 }}
            // animate={prefersReducedMotion ? false : { opacity: 1 }}
            // transition={
            //   prefersReducedMotion ? {} : { delay: 0.4, duration: 0.6 }
            // }
          >
            Para comenzar, inicie sesión con su cuenta{" "}
            <span className="text-red-500 font-semibold">Google</span>.
          </p>
          <GoogleAuth />
        </div>
      </div>
    </div>
  );
};

export default Login;
