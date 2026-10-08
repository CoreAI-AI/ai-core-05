import { PageShell } from '@/components/PageShell';
import { FounderIdentity } from '@/components/FounderIdentity';
import { brandIdentity } from '@/lib/brandIdentity';

export default function OfficialLaunch() {
  return <PageShell managedHead title={brandIdentity.announcement} description={brandIdentity.announcement}><FounderIdentity launch /></PageShell>;
}