import { View } from 'react-native';
import { Card, Heading, Link, Text, SectionDemo, UIReviewCatalog } from '@bubbasfw/ui';
import { Guide } from '../src/Guide';

const sections = [
  ['Brand opening', 'Open on white with the full-color original logo, the current red-cap mascot, a short licensed display headline and one red action. A thin red–white–blue civic stripe frames the opening. Keep the figure proportional and preserve its entire silhouette. Move artwork above the copy on narrow screens when a side column would shrink it too far.'],
  ['Stand finder section', 'Keep the invitation beside the stand’s verified facts. Show address, directions, published seasonal hours and local timezone, then separate reported status. Use an explicit missing-data state. The illustration supports the invitation; readable facts and the next action remain the focus.'],
  ['Category and product sections', 'Place existing category illustrations in circular fields with genuine text labels and destinations. Product panels keep original product artwork, identity, qualified retail price and availability together. Use a readable information surface; illustrations are never evidence of current stock or product specifications.'],
  ['Campaign band', 'One headline and one next step. Use the original logo blue with the full-color original logo. Put small copy on white or charcoal; inspect contrast across the complete gradient region. Keep gold subordinate. A campaign’s terms, dates/timezone, destination and source must be current before distribution.'],
  ['Operational page', 'Use a quiet page header, task navigation, generous field labels and a small number of independent information groups. Keep red for the decisive action. Show connection health, source and freshness where decisions depend on them. Mobile, HQ, Bulk, Social and Studio share the foundations while retaining their own platform and service boundaries.'],
  ['Policy and campaign details', 'Give long text a 720 px reading measure, ordered headings and visible navigation. Use the source’s approved wording and effective dates. Keep policy content separate from campaign urgency. Ended or unavailable destinations retain an honest explanation and a useful fallback.'],
] as const;

export default function Compositions() {
  return <Guide title="Compose with Bubba’s" description="Bold, illustrated public experiences and calm tools share the same recognizable identity.">
    <View className="gap-4">
      <Heading level={2}>One message. A real next step.</Heading>
      <Text>Start with the customer’s or operator’s task. Preserve original identity, use space to establish a clear hierarchy, and let illustration carry energy. Keep navigation, forms, editing, and long reading calm. A fixed marketing appearance can sit inside an app that follows the user’s Light/Dark/System preference.</Text>
    </View>
    <View className="gap-6">{sections.map(([title, description]) => <View key={title} className="gap-3 border-t border-ui-line pt-6"><Heading level={2}>{title}</Heading><Text>{description}</Text></View>)}</View>
    <Card className="gap-4">
      <Heading level={2}>Select an asset deliberately</Heading>
      <Text>Use Brand Studio’s catalog ID, version, SHA256, approval evidence, and distribution rights. Approved identity, a proposed working asset, a generated draft, and a deprecated historical reference remain distinct. Select the current mascot family; avoid mixing generations. Preserve original logo geometry and inks. Never retype, stretch, recolor, crop away essential detail, or regenerate the logo.</Text>
      <Text>Private preview access is separate from public distribution. The package carries no artwork or font binaries. The public docs have separately cleared original logo geometry and Montserrat/OFL. Eurostile’s binary stays excluded; consumers use a licensed local font or a clearly identified fallback.</Text>
      <Link href="/bubbas-ui/brand/NOTICE.txt">Public asset notice</Link>
    </Card>
    <View className="gap-4">
      <Heading level={2}>Social and print handoff</Heading>
      <Text>Use Studio’s maintained social and print templates, select the intended format, and keep text and original artwork editable. Preserve one message, an appropriate logo, a proportional figure, clear qualified details and a verified destination. Keep important content within the template’s safe region; export each platform size deliberately.</Text>
      <Text>For print, specify physical dimensions, bleed, printer profile, approved color conversion and a proof for the actual job. Screen HEX values and CSS shadows are not CMYK or spot-color production specifications. A sample template is not an approved campaign or print run.</Text>
    </View>
    <View className="gap-4">
      <Heading level={2}>Brand-aware generation</Heading>
      <Text>Find a suitable approved asset before generating. Brief the message, audience, medium, composition, approved source IDs, current mascot family and forbidden changes. Generate the mascot and scene together when coherence depends on it; overlay original logo geometry and editable text afterward. Use fictional sample content while live facts are unverified.</Text>
      <Text>Record tool/model/version, seed when available, prompt, source assets, edit lineage and output hash. Mark unknown metadata as unavailable. Generated work remains a private draft until independent review and explicit identity/campaign approval. Generation never grants artwork or font distribution rights.</Text>
    </View>
    <View className="gap-6"><Heading level={2}>Shared web examples</Heading><Text>These examples use the same reusable components as consumers, including the previously approved campaign marquee and metallic offer badge. Proposed header and directory refinements await their own owner review. Content below is synthetic; apps supply real content, cleared artwork and actions.</Text><UIReviewCatalog componentId="button"/>{['SiteHeader','AnnouncementEditor','HeroSection','ProductGrid','Icon','CampaignSection','SocialSection','FlagTicker','FocusMarquee','PromotionBanner','ProductDetail','SiteFooter'].map(name=><View key={name} className="gap-3"><Heading level={3}>{name}</Heading><SectionDemo name={name} variant="marketing"/></View>)}</View>
    <View className="gap-6"><Heading level={2}>Proposed website page sections</Heading><Text>These proposed directory, safety, product and offer compositions use the actual shared package. Every example is synthetic. New designs require owner review before publication or consumer adoption.</Text>{['LocationSearch','LocationMap','LocationCard','LocationGrid','LocationHours','FAQSection','SafetySection','FeaturedProductRow','OfferGrid','ReviewLocationLinks'].map(name=><View key={name} className="gap-3"><Heading level={3}>{name}</Heading><SectionDemo name={name} variant="marketing"/></View>)}<Text>The host supplies verified store coordinates, provider attribution, ten calendar dates from Core, reviewed safety wording, featured-product selection and offer terms. The actual map uses labelled synthetic pins and local grid tiles; it establishes no live store data. Browser automation stubs provider imagery.</Text></View>
    <View className="gap-4 border-t border-ui-line pt-6">
      <Heading level={2}>Reusable section contract</Heading>
      <Text>Product and category layouts support the shared wide container with two, three or four columns as space permits; full product names wrap safely. Transparent action regions use ContentSection and ThemeProvider surface="transparent". Hero action pairs keep one compact row and 48px targets.</Text>
      <Text>The static announcement accepts safe white/yellow text sections and an optional concise phone message. AnnouncementEditor formats selected words and previews the actual banner, with phone-fit warnings. Hosts own Core publication, revisions, enable and save; the shared editor never fetches. Gold reflections and continuous gold-only twinkles obey the same Motion and reduced-motion preferences as the ticker.</Text>
      <Text>A shared section declares its heading level, content fields, source IDs, layout widths, image treatment, actions, missing/error/offline behavior, appearance, accessibility and acceptance evidence. Add a real consumer example when extending it. Keep live product facts in Core’s interface and approved identity in Brand Studio.</Text>
      <Link href="/bubbas-ui/patterns/">Task pattern implementations</Link>
      <Link href="/bubbas-ui/reference/">Complete interface contract</Link>
    </View>
  </Guide>;
}
