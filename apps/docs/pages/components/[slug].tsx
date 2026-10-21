import { components } from "../../src/showcase/catalog";
import { Workbench } from "../../src/Workbench";
export default function ComponentPage({ slug }: { slug: string }) {
  return <Workbench key={slug} initialSlug={slug} />;
}
export function getStaticPaths() {
  return {
    paths: components.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}
export function getStaticProps({ params }: { params: { slug: string } }) {
  return { props: { slug: params.slug } };
}
