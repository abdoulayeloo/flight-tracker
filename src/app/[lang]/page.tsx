import { getDictionary } from '../i18n';
import FlightSearch from '@/components/FlightSearch';

export default async function Page({ params }: { params: Promise<{ lang: 'fr' | 'en-US' }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <FlightSearch dictionary={dictionary} lang={lang} />;
}

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en-US' }];
}
