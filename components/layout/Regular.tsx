import Navbar from "../UI/Navbar";
import Footer from "../UI/Footer";
import Head from "next/head";

export default function RegularLayout({ children }) {
  return (
    <>
      <Head>
        <title>Painel</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-light-900 dark:bg-dark-900">
        <div id="notifications" />
        <Navbar />
        <main className="flex w-full flex-1 bg-light-900 text-light-50 dark:bg-dark-900 dark:text-dark-50">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
