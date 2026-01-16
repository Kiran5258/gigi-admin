// ...existing code...
const Loader = ({ full = false }) => {
  if (full)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader-dot" />
      </div>
    );

  return <div className="loader-dot" />;
};

export default Loader;