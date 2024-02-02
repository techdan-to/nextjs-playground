import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export async function getStaticPaths() {
  const dataDirectory = path.join(process.cwd(), "data");
  const folders = fs.readdirSync(dataDirectory);

  const paths = folders.map((folderName) => ({
    params: { category: folderName },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({
  params,
}: {
  params: { category: string };
}) {
  const dataDir = path.join(process.cwd(), "data", params.category);
  const fileNames = fs.readdirSync(dataDir);

  const sectionsData: Record<string, string> = {};

  fileNames.forEach((fileName) => {
    if (fileName.endsWith(".yaml")) {
      const filePath = path.join(dataDir, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");

      const sectionName = fileName.replace(".yaml", "");
      // Zod validation
      sectionsData[sectionName] = yaml.load(fileContents) as string;
    }
  });

  return {
    props: {
      data: sectionsData,
    },
  };
}

type Card = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

type Props = {
  data: {
    benefits?: Card[];
    caseStudies?: Card[];
  };
};

export default function CategoryPage({ data }: Props) {
  return (
    <div className="flex w-full gap-3 m-6">
      {data.benefits?.map((benefit, index) => (
        <div key={index} className="p-5 text-gray-900 bg-white rounded-md">
          <h2>{benefit.title}</h2>
          <p>{benefit.description}</p>
          <a
            href={benefit.ctaHref}
            className="block pt-1 text-sm text-right text-blue-600"
          >
            {benefit.ctaLabel}
          </a>
        </div>
      ))}
    </div>
  );
}
