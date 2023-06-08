import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <h1 className="text-3xl font-bold text-center">Collective DAO Archive Catalog</h1>
      <p className="text-center">An open source index of DAO historical events.</p>
      <button className="btn btn-primary mt-10">Coming Soon!</button>
    </div>
  );
};

export default Home;
