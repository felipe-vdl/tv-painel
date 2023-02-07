import Head from "next/head";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import { AppNotification } from "@/types/interfaces";
import React, { useState } from "react";

const UserCreate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notificationInitialState: AppNotification = { message: "", type: "" };
  const [notification, setNotification] = useState<AppNotification>(
    notificationInitialState
  );

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    try {
      if (file) {
        setNotification(notificationInitialState);
        setIsLoading(true);
        const formData = new FormData();
        formData.append("video", file, file.name);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/atualiza_video.php`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const data = await response.json();
        setNotification({ type: "success", message: data.message });
        setFile(null);
        setIsLoading(false);
      } else {
        setNotification({
          type: "error",
          message: "Selecione um arquivo.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      setNotification({
        message: error.message,
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const handleChangeFile = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFile(evt.target.files[0]);
  };

  return (
    <>
      <Head>
        <title>Vídeo</title>
      </Head>
      <div className="m-auto flex w-full flex-col items-center rounded-[12px] bg-light-500 text-white shadow shadow-black/20 dark:bg-dark-500 sm:w-[25rem] md:w-[30rem] lg:w-[38rem]">
        <div className="w-full rounded-t-[12px] bg-dourado py-1 text-center">
          <h2 className="text-2xl font-light">Trocar Vídeo</h2>
        </div>
        <form
          className="flex w-full flex-col gap-8 p-4 pt-8"
          onSubmit={handleSubmit}
        >
          {notification.message && (
            <div
              className={`flex w-full items-center rounded-[8px] px-3 py-1 text-center ${
                notification.type === "error"
                  ? "bg-red-300 text-red-800"
                  : "bg-green-300 text-green-800"
              }`}
            >
              <p className="mx-auto">{notification.message}</p>
              <span
                className="cursor-pointer hover:text-white"
                onClick={() => setNotification(notificationInitialState)}
              >
                X
              </span>
            </div>
          )}
          <div className="px-1">
            <label
              htmlFor="video"
              className="group flex cursor-pointer justify-center p-2 text-center"
            >
              <p className="flex flex-1 flex-col items-center justify-center gap-1 rounded-l bg-blue-500 py-2 text-sm hover:text-blue-100 group-hover:bg-blue-600 dark:bg-indigo-500 dark:group-hover:bg-indigo-600 dark:group-hover:text-indigo-100 md:flex-row md:gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707L6.354 9.854z" />
                </svg>
                Selecione um arquivo...
              </p>
              <input
                id="video"
                type="file"
                onChange={handleChangeFile}
                multiple={false}
                name="video"
                accept="video/*"
                className="hidden"
                placeholder="Vídeo"
              />
              <p className="flex flex-1 items-center justify-center rounded-r border border-blue-500 py-2 text-center text-sm text-blue-500 group-hover:border-blue-600 dark:border-indigo-500 dark:text-indigo-400 dark:group-hover:border-indigo-600 md:text-base">
                {file ? file.name : "Nenhum arquivo selecionado"}
              </p>
            </label>
          </div>
          <button
            disabled={isLoading}
            className="rounded-[10px] bg-roxo p-1 text-xl font-light hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? "Trocando o vídeo..." : "Enviar"}
          </button>
        </form>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  } else {
    return {
      props: {},
    };
  }
};

UserCreate.layout = "dashboard";
export default UserCreate;
