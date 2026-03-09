import type { Metadata } from "next";
import { LegalLayout, Section, BulletList } from "@/features/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie პოლიტიკა",
  description: "LandLedger-ის Cookie პოლიტიკა — რა cookies-ს ვიყენებთ და რატომ.",
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie პოლიტიკა" lastUpdated="2026">
      <Section title="1. რა არის Cookies">
        <p>
          Cookies არის პატარა ტექსტური ფაილები, რომლებიც ვებსაიტი ათავსებს თქვენს ბრაუზერში
          პლატფორმის სწორი მუშაობის უზრუნველსაყოფად.
        </p>
      </Section>

      <Section title="2. რა Cookies-ს ვიყენებთ">
        <p>LandLedger იყენებს შემდეგი ტიპის cookies-ს:</p>
        <BulletList items={[
          "აუცილებელი — ავტორიზაციის session-ისთვის (მომხმარებლის შესვლისა და გამოსვლისთვის)",
          "უსაფრთხოების — CSRF და session ვალიდაციისთვის",
          "ანალიტიკური — პლატფორმის გამოყენების სტატისტიკისთვის",
        ]} />
      </Section>

      <Section title="3. მესამე მხარის Cookies">
        <p>LandLedger შეიძლება იყენებდეს მესამე მხარის სერვისებს, რომლებიც საკუთარ cookies-ს ათავსებენ:</p>
        <BulletList items={[
          "Supabase — ავტორიზაციისა და მონაცემთა ბაზის სერვისი",
          "Google/Facebook — OAuth ავტორიზაციისთვის (მხოლოდ სოციალური შესვლისას)",
        ]} />
      </Section>

      <Section title="4. Cookies-ის გამორთვა">
        <p>
          მომხმარებელს შეუძლია cookies გამორთოს ბრაუზერის პარამეტრებში.
          თუმცა, <strong>ავტორიზაციისთვის საჭირო cookies-ის გამორთვა</strong> გამოიწვევს
          პლატფორმის სრული ფუნქციონირების შეუძლებლობას.
        </p>
      </Section>

      <Section title="5. Cookie-ების ვადა">
        <p>Session cookies ავტომატურად იშლება ბრაუზერის დახურვისას. Persistent cookies ინახება მომხმარებლის მოქმედ session-მდე.</p>
      </Section>
    </LegalLayout>
  );
}
