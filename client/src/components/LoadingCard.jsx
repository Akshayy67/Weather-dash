const LoadingCard = ({ message = "Loading..." }) => {
  return (
    <div className="card bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-white/20">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-white mb-4 sm:mb-6"></div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
          {message}
        </h3>
        <p className="text-white/70 text-sm sm:text-base">
          Please wait while we fetch the data...
        </p>
      </div>
    </div>
  );
};

export default LoadingCard;
