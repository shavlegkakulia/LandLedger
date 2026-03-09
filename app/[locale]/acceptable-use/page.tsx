import type { Metadata } from "next";
import { LegalLayout, Section, BulletList } from "@/features/legal/LegalLayout";

export const metadata: Metadata = {
  title: "გამოყენების წესები",
  description: "LandLedger პლატფორმის მისაღები გამოყენების წესები — რა არის ნებადართული და რა აკრძალული.",
  robots: { index: true, follow: true },
};

export default async function AcceptableUsePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <LegalLayout locale={locale} title="გამოყენების წესები (Acceptable Use Policy)" lastUpdated="2026">
      <Section title="1. ნებადართული გამოყენება">
        <p>LandLedger შექმნილია შემდეგი მიზნებისთვის:</p>
        <BulletList items={[
          "მიწის ნაკვეთების მოძიება",
          "მფლობელებთან კომუნიკაციის დაწყება",
          "საკუთარი ნაკვეთების განთავსება",
          "ინტერესის გამოხატვა ნაკვეთის მიმართ",
        ]} />
      </Section>

      <Section title="2. აკრძალული მოქმედებები">
        <p>მომხმარებლებს ეკრძალებათ:</p>
        <BulletList items={[
          "სპამის გაგზავნა — მასობრივი ან განმეორებადი შეტყობინებები",
          "ავტომატური ბოტების გამოყენება",
          "სისტემის უსაფრთხოების დარღვევა ან bypass",
          "სხვა მომხმარებლის შევიწროება ან მუქარა",
          "ყალბი პროფილის ან ნაკვეთის შექმნა",
          "თაღლითური შეთავაზებები",
          "პლატფორმის მონაცემების მასობრივი scraping",
          "უკანონო ქონების ყიდვა-გაყიდვის განხორციელება",
        ]} />
      </Section>

      <Section title="3. Anti-Spam წესები">
        <p>სპამად მიიჩნევა:</p>
        <BulletList items={[
          "ერთი და იმავე შინაარსის მრავალჯერ გაგზავნა",
          "კომერციული შეთავაზება, რომელიც არ ეხება კონკრეტულ ნაკვეთს",
          "კონტაქტი მას შემდეგ, რაც მომხმარებელმა უარი თქვა",
        ]} />
        <p className="mt-3">LandLedger იყენებს ავტომატურ ფილტრებს და შეტყობინებების ლიმიტებს.</p>
      </Section>

      <Section title="4. დარღვევის შედეგები">
        <p>წესების დარღვევა შეიძლება გამოიწვიოს:</p>
        <BulletList items={[
          "გაფრთხილება",
          "შეტყობინებების დროებითი შეზღუდვა",
          "ანგარიშის დროებითი შეჩერება",
          "ანგარიშის სამუდამო წაშლა",
          "სამართლებრივი ქმედება კანონის დარღვევის შემთხვევაში",
        ]} />
      </Section>

      <Section title="5. დარღვევის შეტყობინება">
        <p>
          თუ შეამჩნიეთ წესების დარღვევა, გთხოვთ, მოგვწეროთ:{" "}
          <strong>support@landledger.ge</strong>
        </p>
      </Section>
    </LegalLayout>
  );
}
