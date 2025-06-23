import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Cards = () => {
  return (
    <div className="h-full p-4 space-y-4">
      <div className="bg-second-lgt dark:bg-tertiary-drk p-6 rounded-2xl shadow-md space-y-6 max-w-2xl mx-auto">
        <header>
          <h1 className="text-4xl font-semibold">Tarjetas</h1>
          <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
            En esta página puedes ver tus tarjetas.
          </p>
        </header>
      </div>
      <div className="bg-second-lgt dark:bg-tertiary-drk p-6 rounded-2xl shadow-md space-y-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold">
          Actualmente no tienes tarjetas asignadas.
        </h2>
        <DotLottieReact
          src="https://lottie.host/0d984c5c-1e60-4e76-ac35-809c50de63bc/K7IH6AzhPu.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default Cards;
