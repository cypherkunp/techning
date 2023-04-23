import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  projects: {
    id: number;
    name: string;
  }[];
}

export default function Home({ projects }: Props) {
  console.log(projects);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex items-center justify-center min-h-screen text-black bg-slate-100 dark:bg-slate-900 dark:text-white ">
        <div className="flex flex-col items-start rounded-lg shadow-sm shadow-purple-400 p-4 m-6">
          <div className="flex flex-col rounded-lg shadow-sm shadow-purple-400 p-4 m-6">
            <ul>
              {projects.map((project) => (
                <li key={project.id}>{project.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetServerSideProps = async (): Promise<
  GetServerSidePropsResult<{ [key: string]: any }>
> => {
  const projects = await prisma.projects.findMany();
  return {
    props: { projects },
  };
};