import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { ParsedUrlQuery } from "node:querystring";
import { fetcher } from "@/lib/utils";
import Layout from "@/components/layout";
import useSWR from "swr";
import { getKey, DataProps } from "@/lib/upstash";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import PhotoBooth from "@/components/home/photo-booth";
import { getPlaiceholder } from "plaiceholder";

export default function PhotoPage({
  input,
  blurDataURL,
  data: fallbackData,
}: {
  input: string;
  blurDataURL: string;
  data: DataProps;
}) {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useSWR<DataProps>(`/api/images/${id}`, fetcher, {
    fallbackData,
  });

  return (
    <Layout>
      <motion.div
        className="max-w-2xl px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Your Results
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer ratio={0.6}>
            Your photos will be stored in our servers for 24 hours. After that,
            they will be deleted.
          </Balancer>
        </motion.p>
        <PhotoBooth
          input={input}
          blurDataURL={blurDataURL}
          output={data!.output}
        />
      </motion.div>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps = async (
  context: GetStaticPropsContext & { params: Params },
) => {
  const { id } = context.params;
  const input = `https://images.extrapolate.workers.dev/${id}`;
  const data = await getKey(id);
  if (data) {
    const { base64 } = await getPlaiceholder(input);
    return {
      props: {
        input,
        blurDataURL: base64,
        data,
      },
      revalidate: 1,
    };
  } else {
    return { notFound: true, revalidate: 1 };
  }
};
