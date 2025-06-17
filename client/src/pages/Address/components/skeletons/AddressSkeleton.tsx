const AddressSkeleton = () => {
  return (
    <div className="w-full h-full bg-second-lgt dark:bg-tertiary-drk text-primary-drk dark:text-primary-lgt rounded-2xl max-w-2xl mx-auto md:p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6 p-6 md:p-0">
        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-zinc-700" />
        <div className="h-6 w-32 bg-gray-300 dark:bg-zinc-700 rounded" />
      </div>

      <div className="bg-primary-lgt dark:bg-primary-drk shadow-sm overflow-hidden md:rounded-2xl">
        <div className="p-6 flex flex-col space-y-4">
          <div className="w-full aspect-video bg-gray-300 dark:bg-zinc-700 rounded-lg" />

          <div className="h-4 w-1/2 mx-auto bg-gray-300 dark:bg-zinc-700 rounded" />

          <div className="flex justify-between items-center w-full">
            <div className="w-10 h-10 bg-gray-300 dark:bg-zinc-700 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 dark:bg-zinc-700 rounded-full" />
              <div className="h-4 w-12 bg-gray-300 dark:bg-zinc-700 rounded" />
            </div>
          </div>

          <div className="h-4 w-3/4 bg-gray-300 dark:bg-zinc-700 rounded" />
          <div className="flex justify-between w-full">
            <div className="h-4 w-1/3 bg-gray-300 dark:bg-zinc-700 rounded" />
            <div className="h-4 w-1/3 bg-gray-300 dark:bg-zinc-700 rounded" />
          </div>

          <div className="h-10 w-full bg-blue-300 dark:bg-blue-800 rounded mt-2" />
        </div>
      </div>
    </div>
  );
};

export default AddressSkeleton;
